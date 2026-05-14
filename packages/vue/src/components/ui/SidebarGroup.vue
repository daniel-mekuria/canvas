<script setup lang="ts">
import { cn } from '@/lib/utils'

interface SidebarGroupProps {
  class?: string
}

const props = defineProps<SidebarGroupProps>()
</script>

<template>
  <div :class="cn('space-y-2', props.class)">
    <slot />
  </div>
</template>
