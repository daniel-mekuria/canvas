<script setup lang="ts">
import { cn } from '@/lib/utils'

interface SidebarHeaderProps {
  class?: string
}

const props = defineProps<SidebarHeaderProps>()
</script>

<template>
  <div
    :class="cn(
      'flex items-center border-b-3 border-foreground p-4',
      'group-data-[state=collapsed]/sidebar:justify-center',
      props.class
    )"
  >
    <slot />
  </div>
</template>
