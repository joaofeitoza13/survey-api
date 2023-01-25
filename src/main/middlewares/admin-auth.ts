import { middlewareAdapter } from '@/main/adapters'
import { makeAuthMiddleware } from '@/main/factories'

export const adminAuth = middlewareAdapter(makeAuthMiddleware('admin'))
