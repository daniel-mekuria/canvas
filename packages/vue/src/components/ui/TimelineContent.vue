<script setup lang="ts">
import { inject } from 'vue'
import { cn } from '@/lib/utils'
import { TIMELINE_INJECTION_KEY, type TimelineContext } from './Timeline.vue'

interface TimelineContentProps {
  class?: string
}

const props = defineProps<TimelineContentProps>()

const timelineContext = inject<TimelineContext>(TIMELINE_INJECTION_KEY, {
  orientation: 'vertical',
})
</script>

<template>
  <div
    :class="cn(
      'flex-1',
      timelineContext.orientation === 'vertical' ? 'pb-8' : 'pr-8',
      props.class
    )"
  >
    <slot />
  </div>
</template>
