<script setup lang="ts">
import { inject } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { TIMELINE_INJECTION_KEY, type TimelineContext } from './Timeline.vue'

const timelineItemVariants = cva('relative flex', {
  variants: {
    status: {
      completed: '',
      current: '',
      upcoming: '',
    },
  },
  defaultVariants: {
    status: 'upcoming',
  },
})

type TimelineItemVariants = VariantProps<typeof timelineItemVariants>

interface TimelineItemProps {
  status?: TimelineItemVariants['status']
  class?: string
}

const props = withDefaults(defineProps<TimelineItemProps>(), {
  status: 'upcoming',
})

const timelineContext = inject<TimelineContext>(TIMELINE_INJECTION_KEY, {
  orientation: 'vertical',
})
</script>

<template>
  <div
    :data-status="status"
    :class="cn(
      timelineItemVariants({ status }),
      timelineContext.orientation === 'vertical' ? 'flex-row gap-4' : 'flex-col gap-4 items-center',
      props.class
    )"
  >
    <slot />
  </div>
</template>
