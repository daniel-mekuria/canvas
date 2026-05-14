<script setup lang="ts">
import { computed } from 'vue'
import { getPoint, getAngle, buildPath } from '@/lib/math-curves'
import type { ProgressCurveKey } from '@/lib/math-curves'

interface MathCurveProgressProps {
  value: number
  curve?: ProgressCurveKey
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  trackColor?: string
  fillColor?: string
  strokeWidth?: number
  ariaLabel?: string
  class?: string
}

const props = withDefaults(defineProps<MathCurveProgressProps>(), {
  curve: 'spiral',
  size: 'md',
  showValue: false,
  strokeWidth: 4,
})

const HEAD_SIZE = 8

const sizeMap: Record<NonNullable<MathCurveProgressProps['size']>, number> = {
  sm: 48,
  md: 64,
  lg: 96,
}

const pixelSize = computed(() => sizeMap[props.size ?? 'md'])

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value ?? 0)))

const trackPath = computed(() => buildPath(props.curve ?? 'spiral'))

const headPoint = computed(() => getPoint(props.curve ?? 'spiral', clampedValue.value / 100))

const headAngle = computed(() => getAngle(props.curve ?? 'spiral', clampedValue.value / 100))

const headTransform = computed(() => {
  const { x, y } = headPoint.value
  const angle = headAngle.value
  return `rotate(${angle} ${x} ${y})`
})
</script>

<template>
  <svg
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 100 100"
    role="progressbar"
    :aria-valuenow="clampedValue"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="props.ariaLabel ?? `${clampedValue}% progress`"
    :class="props.class"
    style="overflow: visible; display: block"
  >
    <!-- Track (full curve, low opacity) -->
    <path
      :d="trackPath"
      :stroke="trackColor ?? 'currentColor'"
      :stroke-width="strokeWidth"
      stroke-opacity="0.2"
      stroke-linecap="square"
      stroke-linejoin="miter"
      fill="none"
    />
    <!-- Head rect — moves along the curve proportional to value -->
    <rect
      :width="HEAD_SIZE"
      :height="HEAD_SIZE"
      :x="headPoint.x - HEAD_SIZE / 2"
      :y="headPoint.y - HEAD_SIZE / 2"
      :fill="fillColor ?? 'hsl(var(--primary))'"
      stroke="currentColor"
      stroke-width="1.5"
      :transform="headTransform"
      :style="{ transition: 'transform 300ms ease' }"
    />
    <!-- Optional numeric label -->
    <text
      v-if="showValue"
      x="50"
      y="50"
      text-anchor="middle"
      dominant-baseline="central"
      font-size="12"
      font-weight="700"
      fill="currentColor"
      letter-spacing="0.05em"
      style="user-select: none; font-family: inherit"
    >
      {{ Math.round(clampedValue) }}%
    </text>
  </svg>
</template>
