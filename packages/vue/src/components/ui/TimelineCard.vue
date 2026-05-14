<script setup lang="ts">
import { cn } from '@/lib/utils'

interface TimelineCardProps {
  class?: string
}

const props = defineProps<TimelineCardProps>()
</script>

<template>
  <div
    :class="cn(
      'border-3 border-foreground bg-card p-4',
      'shadow-[4px_4px_0px_hsl(var(--shadow-color))]',
      props.class
    )"
  >
    <slot />
  </div>
</template>
