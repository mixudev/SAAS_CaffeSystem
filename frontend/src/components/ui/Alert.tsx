import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cn } from '../../lib/utils'
import { buttonVariants } from './Button'

const Alert = AlertDialogPrimitive.Root
const AlertTrigger = AlertDialogPrimitive.Trigger

const AlertPortal = AlertDialogPrimitive.Portal

const AlertOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
))
AlertOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertPortal>
    <AlertOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-white p-6 shadow-modal duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2 rounded-2xl md:w-full',
        className,
      )}
      {...props}
    />
  </AlertPortal>
))
AlertContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
AlertHeader.displayName = 'AlertHeader'

const AlertTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('font-display text-xl font-bold text-slate-900 tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-slate-500 leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants({ variant: 'destructive' }), 'w-full sm:w-auto px-5 py-2.5 font-semibold rounded-lg', className)}
    {...props}
  />
))
AlertAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline' }), 'w-full sm:w-auto mt-2 sm:mt-0 px-5 py-2.5 font-semibold rounded-lg', className)}
    {...props}
  />
))
AlertCancel.displayName = AlertDialogPrimitive.Cancel.displayName

const AlertFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 mt-4', className)} {...props} />
)
AlertFooter.displayName = 'AlertFooter'

export {
  Alert,
  AlertPortal,
  AlertOverlay,
  AlertTrigger,
  AlertContent,
  AlertHeader,
  AlertTitle,
  AlertDescription,
  AlertAction,
  AlertCancel,
  AlertFooter,
}
