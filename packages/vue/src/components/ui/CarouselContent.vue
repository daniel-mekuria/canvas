<script setup lang="ts">
import { inject } from 'vue'
import { cn } from '@/lib/utils'
import { CAROUSEL_INJECTION_KEY, type CarouselContext } from './Carousel.vue'

interface CarouselContentProps {
  class?: string
}

const props = defineProps<CarouselContentProps>()

const context = inject<CarouselContext>(CAROUSEL_INJECTION_KEY)
if (!context) {
  throw new Error('CarouselContent must be used within a Carousel')
}
</script>

<template>
  <div :ref="context.carouselRef" class="overflow-hidden">
    <div
      :class="cn(
        'flex',
        context.orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
        props.class
      )"
    >
      <slot />
    </div>
  </div>
</template>
