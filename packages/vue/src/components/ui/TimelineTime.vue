<script setup lang="ts">
import { cn } from '@/lib/utils'

interface TimelineTimeProps {
  datetime?: string
  class?: string
}

const props = defineProps<TimelineTimeProps>()
</script>

<template>
  <time :datetime="datetime" :class="cn('text-xs font-medium text-muted-foreground', props.class)">
    <slot />
  </time>
</template>
