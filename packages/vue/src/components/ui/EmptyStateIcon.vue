<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconContainerVariants = cva(
  'flex items-center justify-center border-3 border-foreground shadow-[3px_3px_0px_hsl(var(--shadow-color))]',
  {
    variants: {
      size: {
        xs: 'w-10 h-10',
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20',
        xl: 'w-24 h-24',
      },
      iconColor: {
        default: 'bg-muted text-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        accent: 'bg-accent text-accent-foreground',
        muted: 'bg-muted text-muted-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        warning: 'bg-warning text-warning-foreground',
        success: 'bg-success text-success-foreground',
      },
    },
    defaultVariants: {
      size: 'md',
      iconColor: 'default',
    },
  }
)

type IconContainerVariants = VariantProps<typeof iconContainerVariants>

export interface EmptyStateIconProps {
  size?: IconContainerVariants['size']
  iconColor?: IconContainerVariants['iconColor']
  class?: string
}

const props = withDefaults(defineProps<EmptyStateIconProps>(), {
  size: 'md',
  iconColor: 'default',
})
</script>

<template>
  <div :class="cn(iconContainerVariants({ size, iconColor }), props.class)">
    <slot />
  </div>
</template>
