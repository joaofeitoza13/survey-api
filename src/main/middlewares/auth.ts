import { middlewareAdapter } from '@/main/adapters'
import { makeAuthMiddleware } from '@/main/factories'

export const auth = middlewareAdapter(makeAuthMiddleware())
