import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@/test/test-utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from '../dropdown-menu'
import { Button } from '../button'

const TestDropdownMenu = ({
  onSelect,
}: {
  onSelect?: (value: string) => void
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button>Open Menu</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onSelect={() => onSelect?.('item1')}>
        Item 1
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => onSelect?.('item2')}>
        Item 2
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => onSelect?.('item3')}>
        Item 3
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

const TestDropdownMenuWithGroups = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button>Open Menu</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Copy</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>More</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
)

const TestDropdownMenuWithCheckbox = ({
  checked,
  onCheckedChange,
}: {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button>Open Menu</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuCheckboxItem checked={checked} onCheckedChange={onCheckedChange}>
        Show Status Bar
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

const TestDropdownMenuWithRadio = ({
  value,
  onValueChange,
}: {
  value?: string
  onValueChange?: (value: string) => void
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button>Open Menu</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
        <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
)

describe('DropdownMenu', () => {
  describe('Rendering', () => {
    it('renders trigger button', () => {
      render(<TestDropdownMenu />)
      expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
    })

    it('does not show content when closed', () => {
      render(<TestDropdownMenu />)
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('shows content when opened', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })
    })

    it('renders all menu items when opened', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Item 1' })).toBeInTheDocument()
        expect(screen.getByRole('menuitem', { name: 'Item 2' })).toBeInTheDocument()
        expect(screen.getByRole('menuitem', { name: 'Item 3' })).toBeInTheDocument()
      })
    })
  })

  describe('Open/Close Behavior', () => {
    it('opens when trigger is clicked', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })
    })

    it('closes when item is selected', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('menuitem', { name: 'Item 1' }))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })

    it('closes on Escape key', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })

    it('closes when clicking outside', async () => {
      const { user } = render(
        <div>
          <TestDropdownMenu />
          <button data-testid="outside">Outside Button</button>
        </div>
      )

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      // Use pointerDown as Radix listens for that event
      fireEvent.pointerDown(screen.getByTestId('outside'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('opens with Enter key', async () => {
      const { user } = render(<TestDropdownMenu />)

      const trigger = screen.getByRole('button', { name: /open menu/i })
      trigger.focus()

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })
    })

    it('opens with Space key', async () => {
      const { user } = render(<TestDropdownMenu />)

      const trigger = screen.getByRole('button', { name: /open menu/i })
      trigger.focus()

      await user.keyboard(' ')

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })
    })

    it('navigates items with ArrowDown', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      await user.keyboard('{ArrowDown}')

      // Check that an item is highlighted
      const items = screen.getAllByRole('menuitem')
      const highlightedItem = items.find(
        (item) => item.getAttribute('data-highlighted') === ''
      )
      expect(highlightedItem).toBeDefined()
    })

    it('navigates items with ArrowUp', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      // Move down first then up
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowUp}')

      const items = screen.getAllByRole('menuitem')
      const highlightedItem = items.find(
        (item) => item.getAttribute('data-highlighted') === ''
      )
      expect(highlightedItem).toBeDefined()
    })

    it('selects item with Enter key', async () => {
      const handleSelect = vi.fn()
      const { user } = render(<TestDropdownMenu onSelect={handleSelect} />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')

      expect(handleSelect).toHaveBeenCalled()
    })
  })

  describe('Menu Item Selection', () => {
    it('calls onSelect when item is clicked', async () => {
      const handleSelect = vi.fn()
      const { user } = render(<TestDropdownMenu onSelect={handleSelect} />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('menuitem', { name: 'Item 2' }))

      expect(handleSelect).toHaveBeenCalledWith('item2')
    })
  })

  describe('Groups and Labels', () => {
    it('renders labels', async () => {
      const { user } = render(<TestDropdownMenuWithGroups />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByText('Actions')).toBeInTheDocument()
        expect(screen.getByText('More')).toBeInTheDocument()
      })
    })

    it('renders separators', async () => {
      const { user } = render(<TestDropdownMenuWithGroups />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        const menu = screen.getByRole('menu')
        const separator = menu.querySelector('[role="separator"]')
        expect(separator).toBeInTheDocument()
      })
    })
  })

  describe('Checkbox Items', () => {
    it('renders checkbox item', async () => {
      const { user } = render(<TestDropdownMenuWithCheckbox />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menuitemcheckbox')).toBeInTheDocument()
      })
    })

    it('shows checked state', async () => {
      const { user } = render(<TestDropdownMenuWithCheckbox checked={true} />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        const checkbox = screen.getByRole('menuitemcheckbox')
        expect(checkbox).toHaveAttribute('data-state', 'checked')
      })
    })

    it('calls onCheckedChange when clicked', async () => {
      const handleChange = vi.fn()
      const { user } = render(
        <TestDropdownMenuWithCheckbox checked={false} onCheckedChange={handleChange} />
      )

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menuitemcheckbox')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('menuitemcheckbox'))

      expect(handleChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Radio Items', () => {
    it('renders radio items', async () => {
      const { user } = render(<TestDropdownMenuWithRadio />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getAllByRole('menuitemradio')).toHaveLength(3)
      })
    })

    it('shows selected state', async () => {
      const { user } = render(<TestDropdownMenuWithRadio value="top" />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        const topRadio = screen.getByRole('menuitemradio', { name: 'Top' })
        expect(topRadio).toHaveAttribute('data-state', 'checked')
      })
    })

    it('calls onValueChange when radio is selected', async () => {
      const handleChange = vi.fn()
      const { user } = render(
        <TestDropdownMenuWithRadio value="top" onValueChange={handleChange} />
      )

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menuitemradio', { name: 'Bottom' })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('menuitemradio', { name: 'Bottom' }))

      expect(handleChange).toHaveBeenCalledWith('bottom')
    })
  })

  describe('Shortcuts', () => {
    it('renders shortcuts', async () => {
      const { user } = render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Save
              <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole('button', { name: /open/i }))

      await waitFor(() => {
        expect(screen.getByText('Ctrl+S')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has correct role on menu', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })
    })

    it('has correct role on menu items', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        const items = screen.getAllByRole('menuitem')
        expect(items.length).toBe(3)
      })
    })

    it('trigger has aria-haspopup', () => {
      render(<TestDropdownMenu />)
      const trigger = screen.getByRole('button', { name: /open menu/i })
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    })

    it('trigger has aria-expanded when open', async () => {
      const { user } = render(<TestDropdownMenu />)

      const trigger = screen.getByRole('button', { name: /open menu/i })

      await user.click(trigger)

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
      })
    })
  })

  describe('Styling', () => {
    it('applies neubrutalism border style to content', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        const menu = screen.getByRole('menu')
        expect(menu).toHaveClass('border-3')
      })
    })

    it('applies shadow styling to content', async () => {
      const { user } = render(<TestDropdownMenu />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      await waitFor(() => {
        const menu = screen.getByRole('menu')
        expect(menu.className).toContain('shadow')
      })
    })
  })

  describe('Disabled Items', () => {
    it('renders disabled items correctly', async () => {
      const { user } = render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole('button', { name: /open/i }))

      await waitFor(() => {
        const disabledItem = screen.getByRole('menuitem', { name: 'Disabled Item' })
        expect(disabledItem).toHaveAttribute('data-disabled')
      })
    })
  })

  describe('Custom ClassName', () => {
    it('accepts custom className on DropdownMenuContent', async () => {
      const { user } = render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="custom-menu-class">
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole('button', { name: /open/i }))

      await waitFor(() => {
        const menu = screen.getByRole('menu')
        expect(menu).toHaveClass('custom-menu-class')
      })
    })
  })
})
