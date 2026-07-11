import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export interface AuthPayload {
  userId: number
  username: string
  role: string
  iat?: number
  exp?: number
}

const TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 24

export function getJwtSecret(): string {
  const config = useRuntimeConfig()
  return config.jwtSecret
}

export function signToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string {
  return jwt.sign(
    { ...payload },
    getJwtSecret(),
    { expiresIn: TOKEN_EXPIRES_IN_SECONDS }
  )
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, getJwtSecret()) as AuthPayload
}

export async function authMiddleware(event: H3Event): Promise<AuthPayload> {
  const authHeader = getHeader(event, 'Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { error: '未提供認證令牌' }
    })
  }

  const token = authHeader.slice(7)

  try {
    return verifyToken(token)
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { error: '令牌無效或已過期' }
    })
  }
}