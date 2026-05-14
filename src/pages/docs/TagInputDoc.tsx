import { useState } from 'react'
import { TagInput } from '@/components/ui/tag-input'
import { ComponentDoc, ExampleSection } from '@/components/docs/ComponentDoc'

const sourceCode = `import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export interface TagInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: string[]
  defaultValue?: string[]
  onChange?: (tags: string[]) => void
  suggestions?: string[]
  maxTags?: number
  allowDuplicates?: boolean
  delimiter?: string | RegExp
  validateTag?: (tag: string) => boolean | string
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ value, defaultValue, onChange, suggestions, maxTags, allowDuplicates, delimiter, validateTag, placeholder, disabled, className, ...props }, ref) => {
    // Implementation...
  }
)

export { TagInput }`

const usageCode = `import { TagInput } from '@/components/ui/tag-input'

export default function Example() {
  return <TagInput placeholder="Add tags..." />
}`

const vueSourceCode = `<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { X } from 'lucide-vue-next'

interface Props {
  modelValue?: string[]
  defaultValue?: string[]
  suggestions?: string[]
  maxTags?: number
  allowDuplicates?: boolean
  delimiter?: string
  validateTag?: (tag: string) => boolean | string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: () => [], suggestions: () => [], allowDuplicates: false, delimiter: ',', placeholder: 'Add tag...',
})
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const inputValue = ref('')
const showSuggestions = ref(false)
const error = ref<string | null>(null)

const tags = computed(() => props.modelValue ?? internalTags.value)
const filteredSuggestions = computed(() =>
  props.suggestions.filter(s => s.toLowerCase().includes(inputValue.value.toLowerCase()))
)
</script>

<template>
  <div class="relative">
    <div :class="cn('flex flex-wrap items-center gap-2 min-h-11 border-3 border-input bg-background px-3 py-2')">
      <span v-for="(tag, i) in tags" :key="tag" class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold border-2 border-foreground bg-primary text-primary-foreground">
        {{ tag }}
        <button @click="removeTag(i)"><X class="h-3 w-3" /></button>
      </span>
      <input v-model="inputValue" @keydown="handleKeyDown" :placeholder="tags.length === 0 ? placeholder : ''" />
    </div>
  </div>
</template>`

const vueUsageCode = `<script setup lang="ts">
import { ref } from 'vue'
import { TagInput } from '@/components/ui/tag-input'

const tags = ref(['react', 'vue'])
</script>

<template>
  <TagInput v-model="tags" placeholder="Add tags..." />
</template>`

export function TagInputDoc() {
  const [tags, setTags] = useState<string[]>(['react', 'typescript'])
  const [techTags, setTechTags] = useState<string[]>([])

  const techSuggestions = [
    'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt',
    'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust'
  ]

  return (
    <>
      <ComponentDoc
        name="Tag Input"
        description="A multi-value input component for adding and removing tags with keyboard support, suggestions, and validation."
        dependencies={['lucide-react']}
        vueDependencies={['lucide-vue-next']}
        sourceCode={sourceCode}
        usageCode={usageCode}
        vueSourceCode={vueSourceCode}
        vueUsageCode={vueUsageCode}
      >
        <div className="max-w-md">
          <TagInput placeholder="Add tags..." />
        </div>
      </ComponentDoc>

      {/* Controlled */}
      <ExampleSection
        title="Controlled"
        description="Control the tags with state."
        code={`const [tags, setTags] = useState(['react', 'typescript'])

<TagInput value={tags} onChange={setTags} />`}
        vueCode={`<script setup>
const tags = ref(['react', 'typescript'])
</script>

<template>
  <TagInput v-model="tags" />
</template>`}
      >
        <div className="space-y-2 max-w-md">
          <TagInput value={tags} onChange={setTags} />
          <p className="text-sm text-muted-foreground">
            Tags: {tags.join(', ') || 'None'}
          </p>
        </div>
      </ExampleSection>

      {/* With Suggestions */}
      <ExampleSection
        title="With Suggestions"
        description="Provide autocomplete suggestions as the user types."
        code={`const suggestions = ['React', 'Vue', 'Angular', 'Svelte', 'TypeScript']

<TagInput
  suggestions={suggestions}
  placeholder="Search technologies..."
/>`}
        vueCode={`<script setup>
const suggestions = ['React', 'Vue', 'Angular', 'Svelte', 'TypeScript']
</script>

<template>
  <TagInput
    :suggestions="suggestions"
    placeholder="Search technologies..."
  />
</template>`}
      >
        <div className="max-w-md">
          <TagInput
            value={techTags}
            onChange={setTechTags}
            suggestions={techSuggestions}
            placeholder="Search technologies..."
          />
        </div>
      </ExampleSection>

      {/* Max Tags */}
      <ExampleSection
        title="Max Tags"
        description="Limit the number of tags that can be added."
        code={`<TagInput maxTags={3} placeholder="Max 3 tags..." />`}
        vueCode={`<template>
  <TagInput :max-tags="3" placeholder="Max 3 tags..." />
</template>`}
      >
        <div className="max-w-md">
          <TagInput maxTags={3} placeholder="Max 3 tags..." />
        </div>
      </ExampleSection>

      {/* Validation */}
      <ExampleSection
        title="Validation"
        description="Validate tags before they're added."
        code={`<TagInput
  validateTag={(tag) => {
    if (tag.length < 2) return 'Tag must be at least 2 characters'
    if (tag.length > 10) return 'Tag must be at most 10 characters'
    return true
  }}
  placeholder="2-10 characters..."
/>`}
        vueCode={`<script setup>
function validateTag(tag: string) {
  if (tag.length < 2) return 'Tag must be at least 2 characters'
  if (tag.length > 10) return 'Tag must be at most 10 characters'
  return true
}
</script>

<template>
  <TagInput :validate-tag="validateTag" placeholder="2-10 characters..." />
</template>`}
      >
        <div className="max-w-md">
          <TagInput
            validateTag={(tag) => {
              if (tag.length < 2) return 'Tag must be at least 2 characters'
              if (tag.length > 10) return 'Tag must be at most 10 characters'
              return true
            }}
            placeholder="2-10 characters..."
          />
        </div>
      </ExampleSection>

      {/* Allow Duplicates */}
      <ExampleSection
        title="Allow Duplicates"
        description="Enable duplicate tags if needed."
        code={`<TagInput allowDuplicates placeholder="Duplicates allowed..." />`}
        vueCode={`<template>
  <TagInput allow-duplicates placeholder="Duplicates allowed..." />
</template>`}
      >
        <div className="max-w-md">
          <TagInput allowDuplicates placeholder="Duplicates allowed..." />
        </div>
      </ExampleSection>

      {/* Custom Delimiter */}
      <ExampleSection
        title="Custom Delimiter"
        description="Use a custom delimiter to separate tags."
        code={`<TagInput delimiter=";" placeholder="Separate with semicolon..." />`}
        vueCode={`<template>
  <TagInput delimiter=";" placeholder="Separate with semicolon..." />
</template>`}
      >
        <div className="max-w-md">
          <TagInput delimiter=";" placeholder="Separate with semicolon..." />
        </div>
      </ExampleSection>

      {/* Disabled */}
      <ExampleSection
        title="Disabled"
        description="Disable the tag input."
        code={`<TagInput disabled defaultValue={['fixed', 'tags']} />`}
        vueCode={`<template>
  <TagInput disabled :default-value="['fixed', 'tags']" />
</template>`}
      >
        <div className="max-w-md">
          <TagInput disabled defaultValue={['fixed', 'tags']} />
        </div>
      </ExampleSection>
    </>
  )
}
