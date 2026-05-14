import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../dialog'
import { Button } from '../button'

const TestDialog = ({
  open,
  onOpenChange,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <Button>Open Dialog</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Test Dialog</DialogTitle>
        <DialogDescription>This is a test dialog description.</DialogDescription>
      </DialogHeader>
      <div>Dialog content goes here</div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

describe('Dialog', () => {
  describe('Rendering', () => {
    it('renders trigger button', () => {
      render(<TestDialog />)
      expect(screen.getByRole('button', { name: /open dialog/i })).toBeInTheDocument()
    })

    it('does not render content when closed', () => {
      render(<TestDialog />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders content when open', () => {
      render(<TestDialog open />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('renders DialogHeader correctly', () => {
      render(<TestDialog open />)
      expect(screen.getByText('Test Dialog')).toBeInTheDocument()
    })

    it('renders DialogDescription correctly', () => {
      render(<TestDialog open />)
      expect(screen.getByText(/test dialog description/i)).toBeInTheDocument()
    })

    it('renders DialogFooter with buttons', () => {
      render(<TestDialog open />)
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
    })
  })

  describe('Open/Close Behavior', () => {
    it('opens dialog when trigger is clicked', async () => {
      const { user } = render(<TestDialog />)

      await user.click(screen.getByRole('button', { name: /open dialog/i }))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('closes dialog when close button is clicked', async () => {
      const handleOpenChange = vi.fn()
      const { user } = render(<TestDialog open onOpenChange={handleOpenChange} />)

      // Click the X button (Close button)
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // DialogClose triggers onOpenChange with false
      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })

    it('closes dialog when Cancel button is clicked', async () => {
      const handleOpenChange = vi.fn()
      const { user } = render(<TestDialog open onOpenChange={handleOpenChange} />)

      await user.click(screen.getByRole('button', { name: /cancel/i }))

      // DialogClose triggers onOpenChange with false
      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })

    it('calls onOpenChange when dialog state changes', async () => {
      const handleOpenChange = vi.fn()
      const { user } = render(<TestDialog onOpenChange={handleOpenChange} />)

      await user.click(screen.getByRole('button', { name: /open dialog/i }))

      expect(handleOpenChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Keyboard Interactions', () => {
    it('closes dialog on Escape key', async () => {
      const handleOpenChange = vi.fn()
      const { user } = render(<TestDialog open onOpenChange={handleOpenChange} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      // Escape should trigger onOpenChange with false
      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })

    it('traps focus within dialog', async () => {
      render(<TestDialog open />)

      const dialog = screen.getByRole('dialog')

      // Focus should be trapped within the dialog
      // We verify by checking that focus is inside the dialog
      await waitFor(() => {
        expect(dialog.contains(document.activeElement)).toBe(true)
      })
    })
  })

  describe('Focus Management', () => {
    it('moves focus to dialog when opened', async () => {
      const { user } = render(<TestDialog />)

      await user.click(screen.getByRole('button', { name: /open dialog/i }))

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        // Focus should be within the dialog
        expect(dialog.contains(document.activeElement)).toBe(true)
      })
    })

    it('triggers onOpenChange with false on Escape', async () => {
      const handleOpenChange = vi.fn()
      const { user } = render(<TestDialog onOpenChange={handleOpenChange} />)

      const trigger = screen.getByRole('button', { name: /open dialog/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      // Verify it was called to close
      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Overlay', () => {
    it('renders overlay when dialog is open', () => {
      render(<TestDialog open />)
      // Check for overlay by its styling - it has fixed positioning
      const overlay = document.querySelector('[data-state="open"]')
      expect(overlay).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<TestDialog open />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has accessible name from DialogTitle', () => {
      render(<TestDialog open />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAccessibleName('Test Dialog')
    })

    it('has accessible description from DialogDescription', () => {
      render(<TestDialog open />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAccessibleDescription(/test dialog description/i)
    })

    it('close button has accessible name', () => {
      render(<TestDialog open />)
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies neubrutalism border style', () => {
      render(<TestDialog open />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass('border-3')
    })

    it('applies shadow styling', () => {
      render(<TestDialog open />)
      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('shadow')
    })
  })

  describe('Custom ClassName', () => {
    it('accepts custom className on DialogContent', () => {
      render(
        <Dialog open>
          <DialogContent className="custom-dialog-class">
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass('custom-dialog-class')
    })
  })
})
