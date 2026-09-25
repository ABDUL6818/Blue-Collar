import { z } from 'zod'
import { nameField, phoneField } from './shared.js'

/**
 * Validation schemas for user profile endpoints.
 */

// PATCH /users/me
export const updateProfileRules = z.object({
  firstName: nameField.optional(),
  lastName: nameField.optional(),
  phone: phoneField.optional(),
  bio: z.string().max(1000).optional(),
  onboardingCompleted: z.boolean().optional(),
})

// PUT /users/me/password
export const changePasswordRules = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

// POST /users/me/push-subscription
export const pushSubscriptionRules = z.object({
  endpoint: z.string().url('Invalid endpoint URL'),
  keys: z.object({
    auth: z.string().min(1, 'Auth key is required'),
    p256dh: z.string().min(1, 'P256DH key is required'),
  }),
})

// DELETE /users/me/push-subscription
export const deletePushSubscriptionRules = z.object({
  endpoint: z.string().url('Invalid endpoint URL'),
})

// POST /users/me/complete-onboarding
export const completeOnboardingRules = z.object({})
