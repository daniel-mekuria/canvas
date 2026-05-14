<script setup lang="ts">
import { inject, computed } from 'vue'
import { cn } from '@/lib/utils'
import { SIDEBAR_INJECTION_KEY, type SidebarContext } from './SidebarProvider.vue'

interface SidebarGroupLabelProps {
  class?: string
}

const props = defineProps<SidebarGroupLabelProps>()

const context = inject<SidebarContext>(SIDEBAR_INJECTION_KEY)
const state = computed(() => context?.state.value ?? 'expanded')
</script>

<template>
  <div
    :class="cn(
      'px-2 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground',
      'transition-opacity duration-200',
      state === 'collapsed' && 'opacity-0 hidden',
      props.class
    )"
  >
    <slot />
  </div>
</template>
