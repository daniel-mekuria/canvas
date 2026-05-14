import { inject } from 'vue'
import { SIDEBAR_INJECTION_KEY, type SidebarContext } from '../components/ui/SidebarProvider.vue'

export function useSidebar(): SidebarContext {
  const context = inject<SidebarContext>(SIDEBAR_INJECTION_KEY)
  if (!context) {
    throw new Error('useSidebar must be used within a <SidebarProvider />')
  }
  return context
}
