import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  action?: any
  variant?: "default" | "destructive" | "success"
  [key: string]: any
}

// 1. Create a wrapper that handles the old object syntax
function toastFunction(props: ToastProps | string, options: any = {}) {
  // If the user passed a string (New Sonner syntax), pass it through
  if (typeof props === "string") {
    return sonnerToast(props, options)
  }

  // If the user passed an object (Old Shadcn syntax), extract title
  const { title, description, variant, ...rest } = props
  
  // Map "destructive" variant to sonner's error type
  if (variant === "destructive") {
    return sonnerToast.error(title, { description, ...rest })
  }

  // Default toast
  return sonnerToast(title, { description, ...rest })
}

// 2. Attach Sonner's static methods (dismiss, error, etc.) to the wrapper
// This allows toast.dismiss() or toast.success() to still work
Object.assign(toastFunction, sonnerToast)

// 3. Export the hybrid function
export const toast = toastFunction as typeof sonnerToast & typeof toastFunction

// 4. Export the hook for legacy support
export const useToast = () => ({
  toast: toastFunction,
  dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
})