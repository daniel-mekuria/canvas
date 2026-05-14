<script setup lang="ts">
import { cn } from '@/lib/utils'

export interface EmptyStateIllustrationProps {
  /** Max width for the illustration */
  maxWidth?: string | number
  class?: string
}

const props = withDefaults(defineProps<EmptyStateIllustrationProps>(), {
  maxWidth: '200px',
})
</script>

<template>
  <div
    :class="cn('flex items-center justify-center', props.class)"
    :style="{ maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }"
  >
    <slot />
  </div>
</template>
