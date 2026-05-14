<script setup lang="ts">
import { cn } from '@/lib/utils'

interface SidebarInsetProps {
  class?: string
}

const props = defineProps<SidebarInsetProps>()
</script>

<template>
  <div :class="cn('flex-1 overflow-auto', props.class)">
    <slot />
  </div>
</template>
