import { PrismaClient } from '@prisma/client'
import type { ExpressContext } from 'apollo-server-express'

export interface Context {
  prisma: PrismaClient,
  name: string,
}

export function createContext(ctx: ExpressContext): Context {
  return {
    ...ctx,
    prisma: new PrismaClient(),
    name: "jiradet"
  }
}
