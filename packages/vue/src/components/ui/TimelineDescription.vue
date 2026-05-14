<script setup lang="ts">
import { cn } from '@/lib/utils'

interface TimelineDescriptionProps {
  class?: string
}

const props = defineProps<TimelineDescriptionProps>()
</script>

<template>
  <p :class="cn('text-sm text-muted-foreground mt-1', props.class)">
    <slot />
  </p>
</template>
