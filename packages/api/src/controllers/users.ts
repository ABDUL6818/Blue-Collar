import type { Request, Response } from 'express'
import { db } from '../db.js'
import { sanitizeUser } from '../models/user.model.js'
import * as userService from '../services/user.service.js'
import { logger } from '../config/logger.js'
import { ErrorMessages, HttpStatus } from '../constants/index.js'

// ── Profile update ────────────────────────────────────────────────────────────

export async function updateProfile(req: Request, res: Response) {
  const userId = req.user?.id
  if (!userId) return res.status(HttpStatus.UNAUTHORIZED).json({ status: 'error', message: ErrorMessages.UNAUTHORIZED, code: HttpStatus.UNAUTHORIZED })

  try {
    const user = await db.user.update({
      where: { id: userId },
      data: req.body,
    })
    return res.json({ data: sanitizeUser(user), status: 'success', code: HttpStatus.OK })
  } catch (error) {
    logger.error({ err: error }, '[updateProfile] error')
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: ErrorMessages.FAILED_UPDATE_PROFILE, code: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}

export async function updateMe(req: Request, res: Response) {
  const userId = req.user?.id
  if (!userId) return res.status(HttpStatus.UNAUTHORIZED).json({ status: 'error', message: ErrorMessages.UNAUTHORIZED, code: HttpStatus.UNAUTHORIZED })

  try {
    const user = await userService.updateProfile(userId, req.body)
    return res.json({ data: user, status: 'success', code: 200 })
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return res.status(HttpStatus.BAD_REQUEST).json({ status: 'error', message: 'Validation failed', code: HttpStatus.BAD_REQUEST, errors: error.errors })
    }
    if (error?.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message, code: error.statusCode })
    }
    logger.error({ err: error }, '[updateMe] error')
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: ErrorMessages.FAILED_UPDATE_PROFILE, code: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}

// ── Change password ───────────────────────────────────────────────────────────

export async function changePassword(req: Request, res: Response) {
  const userId = req.user?.id
  if (!userId) return res.status(HttpStatus.UNAUTHORIZED).json({ status: 'error', message: ErrorMessages.UNAUTHORIZED, code: HttpStatus.UNAUTHORIZED })

  try {
    await userService.changePassword(userId, req.body.currentPassword, req.body.newPassword)
    return res.json({ status: 'success', message: 'Password updated', code: HttpStatus.OK })
  } catch (error: any) {
    if (error?.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message, code: error.statusCode })
    }
    logger.error({ err: error }, '[changePassword] error')
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: ErrorMessages.FAILED_CHANGE_PASSWORD, code: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}

// ── Delete account ────────────────────────────────────────────────────────────

export async function deleteAccount(req: Request, res: Response) {
  const userId = req.user?.id
  if (!userId) return res.status(HttpStatus.UNAUTHORIZED).json({ status: 'error', message: ErrorMessages.UNAUTHORIZED, code: HttpStatus.UNAUTHORIZED })

  try {
    await userService.deleteAccount(userId)
    return res.json({ status: 'success', message: 'Account deleted', code: HttpStatus.OK })
  } catch (error) {
    logger.error({ err: error }, '[deleteAccount] error')
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: ErrorMessages.FAILED_DELETE_ACCOUNT, code: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}

// ── Push subscriptions ────────────────────────────────────────────────────────

export async function savePushSubscription(req: Request, res: Response) {
  const userId = req.user?.id
  if (!userId) return res.status(HttpStatus.UNAUTHORIZED).json({ status: 'error', message: ErrorMessages.UNAUTHORIZED, code: HttpStatus.UNAUTHORIZED })

  try {
    const subscription = await userService.savePushSubscription(userId, req.body)
    return res.json({ data: subscription, status: 'success', code: HttpStatus.CREATED })
  } catch (error) {
    logger.error({ err: error }, '[savePushSubscription] error')
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: ErrorMessages.FAILED_SAVE_SUBSCRIPTION, code: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}

export async function deletePushSubscription(req: Request, res: Response) {
  const userId = req.user?.id
  if (!userId) return res.status(HttpStatus.UNAUTHORIZED).json({ status: 'error', message: ErrorMessages.UNAUTHORIZED, code: HttpStatus.UNAUTHORIZED })

  try {
    await userService.deletePushSubscription(userId, req.body.endpoint)
    return res.json({ status: 'success', message: 'Unsubscribed', code: HttpStatus.OK })
  } catch (error) {
    logger.error({ err: error }, '[deletePushSubscription] error')
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: ErrorMessages.FAILED_UNSUBSCRIBE, code: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}

// ── Onboarding ────────────────────────────────────────────────────────────────

export async function completeOnboarding(req: Request, res: Response) {
  const userId = req.user?.id
  if (!userId) return res.status(HttpStatus.UNAUTHORIZED).json({ status: 'error', message: ErrorMessages.UNAUTHORIZED, code: HttpStatus.UNAUTHORIZED })

  try {
    const user = await userService.completeOnboarding(userId)
    return res.json({ data: user, status: 'success', message: 'Onboarding completed', code: HttpStatus.OK })
  } catch (error) {
    logger.error({ err: error }, '[completeOnboarding] error')
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: ErrorMessages.FAILED_ONBOARDING, code: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}
