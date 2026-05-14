<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted, watch } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buildPath, getPoint, getAngle, getDetailScale, getCurvePulseDuration } from '@/lib/math-curves'
import type { BackgroundCurveKey } from '@/lib/math-curves'

interface MathCurveBackgroundProps extends PrimitiveProps {
  curve?: BackgroundCurveKey
  speed?: 'slow' | 'normal' | 'fast'
  opacity?: number
  trackColor?: string
  headColor?: string
  strokeWidth?: number
  class?: string
}

const props = withDefaults(defineProps<MathCurveBackgroundProps>(), {
  as: 'div',
  curve: 'rose',
  speed: 'slow',
  opacity: 0.15,
  strokeWidth: 2,
})

const speedMap: Record<NonNullable<MathCurveBackgroundProps['speed']>, number> = {
  slow: 9000,
  normal: 5500,
  fast: 3000,
}

const HEAD_SIZE = 8

const svgPathRef = shallowRef<SVGPathElement | null>(null)
const svgHeadRef = shallowRef<SVGRectElement | null>(null)

let rafId = 0
let startTime = 0

function startLoop() {
  cancelAnimationFrame(rafId)
  startTime = performance.now()

  function frame(now: number) {
    const elapsed = now - startTime
    const loopDuration = speedMap[props.speed ?? 'slow']
    const pulseDuration = getCurvePulseDuration(props.curve ?? 'rose')

    const progress = (elapsed % loopDuration) / loopDuration
    const detailScale = getDetailScale(elapsed, pulseDuration)

    if (svgPathRef.value) {
      svgPathRef.value.setAttribute('d', buildPath(props.curve ?? 'rose', detailScale))
    }

    if (svgHeadRef.value) {
      const { x, y } = getPoint(props.curve ?? 'rose', progress, detailScale)
      const angle = getAngle(props.curve ?? 'rose', progress, detailScale)
      svgHeadRef.value.setAttribute('x', String(x - HEAD_SIZE / 2))
      svgHeadRef.value.setAttribute('y', String(y - HEAD_SIZE / 2))
      svgHeadRef.value.setAttribute('transform', `rotate(${angle} ${x} ${y})`)
    }

    rafId = requestAnimationFrame(frame)
  }

  rafId = requestAnimationFrame(frame)
}

onMounted(() => {
  startLoop()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})

watch(
  () => [props.curve, props.speed],
  () => {
    startLoop()
  }
)
</script>

<template>
  <Primitive
    :as="as"
    :class="cn('relative', props.class)"
  >
    <!-- Background SVG layer -->
    <svg
      aria-hidden="true"
      class="absolute inset-0 w-full h-full pointer-events-none"
      style="z-index: 0"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      :opacity="opacity"
    >
      <path
        ref="svgPathRef"
        :stroke="trackColor ?? 'currentColor'"
        :stroke-width="strokeWidth"
        stroke-linecap="square"
        stroke-linejoin="miter"
        stroke-opacity="0.15"
        fill="none"
      />
      <rect
        ref="svgHeadRef"
        width="8"
        height="8"
        :fill="headColor ?? 'hsl(var(--primary))'"
        stroke="currentColor"
        stroke-width="1.5"
        x="0"
        y="0"
      />
    </svg>
    <!-- Content slot -->
    <div class="relative" style="z-index: 10">
      <slot />
    </div>
  </Primitive>
</template>
