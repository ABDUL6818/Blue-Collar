import { z } from 'zod'
import { BookingStatus } from '@bluecollar/types'

export const createBookingRules = z.object({
  workerId: z.string().min(1, 'workerId is required'),
  startTime: z.string().datetime({ message: 'startTime must be an ISO-8601 datetime' }),
  endTime: z.string().datetime({ message: 'endTime must be an ISO-8601 datetime' }),
})

export const listMyBookingsQuery = z.object({
  role: z.enum(['worker', 'requester']).optional(),
  status: z.enum(BookingStatus).optional(),
})