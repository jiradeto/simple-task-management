import { Resolvers } from 'generated/types'
import { Context } from '../../../libs/context'

export const query: Resolvers<Context>['Query'] = {
  lists: async (_parent, _args, ctx) =>
    ctx.prisma.list.findMany({
      include: {
        tasks: {
          orderBy: {
            rank: 'asc',
          },
        },
      },
    }),
  list: async (_parent, { id }, ctx) =>
    ctx.prisma.list.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            rank: 'asc',
          },
        },
      },
    }),
}
