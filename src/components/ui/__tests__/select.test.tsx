import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '../select'

const TestSelect = ({
  value,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
}: {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}) => (
  <Select value={value} onValueChange={onValueChange} disabled={disabled}>
    <SelectTrigger>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectContent>
  </Select>
)

const TestSelectWithGroups = () => (
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Vegetables</SelectLabel>
        <SelectItem value="carrot">Carrot</SelectItem>
        <SelectItem value="celery">Celery</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
)

describe('Select', () => {
  describe('Rendering', () => {
    it('renders trigger with placeholder', () => {
      render(<TestSelect />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    it('renders with selected value', () => {
      render(<TestSelect value="apple" />)
      expect(screen.getByText('Apple')).toBeInTheDocument()
    })

    it('does not show content when closed', () => {
      render(<TestSelect />)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('Opening and Closing', () => {
    it('opens dropdown when trigger is clicked', async () => {
      const { user } = render(<TestSelect />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })
    })

    it('shows all options when opened', async () => {
      const { user } = render(<TestSelect />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Orange' })).toBeInTheDocument()
      })
    })

    it('closes dropdown when option is selected', async () => {
      const { user } = render(<TestSelect />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('option', { name: 'Apple' }))

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })

    it('closes dropdown on Escape key', async () => {
      const { user } = render(<TestSelect />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })
  })

  describe('Selection', () => {
    it('calls onValueChange when option is selected', async () => {
      const handleChange = vi.fn()
      const { user } = render(<TestSelect onValueChange={handleChange} />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('option', { name: 'Apple' }))

      expect(handleChange).toHaveBeenCalledWith('apple')
    })

    it('displays selected value in trigger', async () => {
      const { user } = render(<TestSelect />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('option', { name: 'Banana' }))

      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument()
      })
    })

    it('shows check indicator on selected item', async () => {
      const { user } = render(<TestSelect value="apple" />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const appleOption = screen.getByRole('option', { name: 'Apple' })
        expect(appleOption).toHaveAttribute('data-state', 'checked')
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('opens dropdown with Enter key', async () => {
      const { user } = render(<TestSelect />)

      const trigger = screen.getByRole('combobox')
      trigger.focus()

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })
    })

    it('opens dropdown with Space key', async () => {
      const { user } = render(<TestSelect />)

      const trigger = screen.getByRole('combobox')
      trigger.focus()

      await user.keyboard(' ')

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })
    })

    it('navigates options with arrow keys', async () => {
      const { user } = render(<TestSelect />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      await user.keyboard('{ArrowDown}')

      // Check that an option is highlighted
      const options = screen.getAllByRole('option')
      const highlightedOption = options.find(
        (opt) => opt.getAttribute('data-highlighted') === ''
      )
      expect(highlightedOption).toBeDefined()
    })

    it('selects highlighted option with Enter', async () => {
      const handleChange = vi.fn()
      const { user } = render(<TestSelect onValueChange={handleChange} />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    it('applies disabled styling', () => {
      render(<TestSelect disabled />)
      const trigger = screen.getByRole('combobox')
      expect(trigger).toBeDisabled()
    })

    it('does not open when disabled', async () => {
      const { user } = render(<TestSelect disabled />)

      await user.click(screen.getByRole('combobox'))

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('Groups and Labels', () => {
    it('renders groups with labels', async () => {
      const { user } = render(<TestSelectWithGroups />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('Fruits')).toBeInTheDocument()
        expect(screen.getByText('Vegetables')).toBeInTheDocument()
      })
    })

    it('renders separator between groups', async () => {
      const { user } = render(<TestSelectWithGroups />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const listbox = screen.getByRole('listbox')
        // Radix uses aria-hidden="true" on separators
        const separator = listbox.querySelector('[aria-hidden="true"]')
        expect(separator).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has correct role on trigger', () => {
      render(<TestSelect />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('has correct role on content', async () => {
      const { user } = render(<TestSelect />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })
    })

    it('has correct role on options', async () => {
      const { user } = render(<TestSelect />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBe(3)
      })
    })

    it('associates trigger with listbox via aria-controls', async () => {
      const { user } = render(<TestSelect />)

      const trigger = screen.getByRole('combobox')

      await user.click(trigger)

      await waitFor(() => {
        const listbox = screen.getByRole('listbox')
        expect(trigger).toHaveAttribute('aria-controls', listbox.id)
      })
    })
  })

  describe('Styling', () => {
    it('applies neubrutalism border style to trigger', () => {
      render(<TestSelect />)
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveClass('border-3')
    })

    it('applies shadow styling to trigger', () => {
      render(<TestSelect />)
      const trigger = screen.getByRole('combobox')
      expect(trigger.className).toContain('shadow')
    })
  })

  describe('Custom ClassName', () => {
    it('accepts custom className on SelectTrigger', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger-class">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test</SelectItem>
          </SelectContent>
        </Select>
      )
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveClass('custom-trigger-class')
    })
  })
})
