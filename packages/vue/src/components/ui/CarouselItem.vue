<script setup lang="ts">
import { inject } from 'vue'
import { cn } from '@/lib/utils'
import { CAROUSEL_INJECTION_KEY, type CarouselContext } from './Carousel.vue'

interface CarouselItemProps {
  class?: string
}

const props = defineProps<CarouselItemProps>()

const context = inject<CarouselContext>(CAROUSEL_INJECTION_KEY)
if (!context) {
  throw new Error('CarouselItem must be used within a Carousel')
}
</script>

<template>
  <div
    role="group"
    aria-roledescription="slide"
    :class="cn(
      'min-w-0 shrink-0 grow-0 basis-full',
      context.orientation === 'horizontal' ? 'pl-4' : 'pt-4',
      props.class
    )"
  >
    <slot />
  </div>
</template>
