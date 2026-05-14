<script setup lang="ts">
import { cn } from '@/lib/utils'

interface SidebarFooterProps {
  class?: string
}

const props = defineProps<SidebarFooterProps>()
</script>

<template>
  <div
    :class="cn(
      'flex items-center border-t-3 border-foreground p-4',
      'group-data-[state=collapsed]/sidebar:justify-center',
      props.class
    )"
  >
    <slot />
  </div>
</template>
