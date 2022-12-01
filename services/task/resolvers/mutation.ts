import { Resolvers, Task, InputMaybe } from 'generated/types'
import { Context } from '../../../libs/context'
import { rankGenerator } from '../../../libs/utils/rankGenerator'

export const mutation: Resolvers<Context>['Mutation'] = {
  updateTask: async (_parent, { id, input }, ctx) => {
    const task = await ctx.prisma.task.findUnique({ where: { id } })
    const tasks = await ctx.prisma.task.findMany({
      where: {
        listId: task?.listId,
      },
      orderBy: {
        rank: 'asc',
      },
    })
    const newRank: string | undefined = await rankGenerator.getRank(input?.position ?? undefined, task , tasks)
    return ctx.prisma.task.update({
      where: { id },
      data: {
        title: input.title ?? undefined,
        completed: input.completed ?? undefined,
        rank: newRank
      },
    })
  },
  createList: async (_parent, { input }, ctx) =>
    ctx.prisma.list.create({ data: input }),

  createTask: async (_parent, { input }, ctx) => {
    const prevTask: Task | null = await ctx.prisma.task.findFirst({
      where: {
        listId: input.listId,
      },
      orderBy: {
        rank: 'desc',
      },
    })
    const taskRank = await rankGenerator.initialRank(prevTask)
    return ctx.prisma.task.create({
      data: {
        ...input,
        rank: taskRank
      },
    })
  },
}
