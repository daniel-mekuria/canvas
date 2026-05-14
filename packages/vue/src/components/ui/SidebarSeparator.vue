<script setup lang="ts">
import { cn } from '@/lib/utils'

interface SidebarSeparatorProps {
  class?: string
}

const props = defineProps<SidebarSeparatorProps>()
</script>

<template>
  <div :class="cn('mx-2 h-[3px] bg-foreground', props.class)" />
</template>
