<script setup lang="ts">
import { cn } from '@/lib/utils'

interface TimelineTitleProps {
  class?: string
}

const props = defineProps<TimelineTitleProps>()
</script>

<template>
  <h3 :class="cn('text-base font-bold uppercase tracking-wide', props.class)">
    <slot />
  </h3>
</template>
