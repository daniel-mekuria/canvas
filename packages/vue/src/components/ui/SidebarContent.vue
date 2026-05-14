<script setup lang="ts">
import { cn } from '@/lib/utils'

interface SidebarContentProps {
  class?: string
}

const props = defineProps<SidebarContentProps>()
</script>

<template>
  <div :class="cn('flex-1 overflow-auto p-4', props.class)">
    <slot />
  </div>
</template>
