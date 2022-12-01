import { Task } from 'generated/types'
import { LexoRank } from 'lexorank'

export interface LexoRankPayload {
  prevEntity?: Task | undefined
  entity?: Task
  nextEntity?: Task | undefined
}

class RankGenerator {
  async generateLexoRank(
    generateLexoRankPayload: LexoRankPayload
  ): Promise<LexoRank> {
    let newLexoRank: LexoRank
    const { prevEntity, entity, nextEntity } = generateLexoRankPayload
    // new position is head of the list
    if (!prevEntity && !!nextEntity) {
      newLexoRank = LexoRank.parse(nextEntity?.rank ?? '').genPrev()
      // new position is tail of the list
    } else if (!nextEntity && !!prevEntity) {
      newLexoRank = LexoRank.parse(prevEntity?.rank ?? '').genNext()
      // new position is between other items
    } else if (!!prevEntity && !!nextEntity) {
      newLexoRank = LexoRank.parse(nextEntity?.rank ?? '').between(
        LexoRank.parse(prevEntity?.rank ?? '')
      )
    } else {
      newLexoRank = LexoRank.parse(entity?.rank ?? '').genNext()
    }
    return newLexoRank
  }

  async initialRank(prevTask: Task | null): Promise<string> {
      return prevTask === null
        ? LexoRank.middle().toString()
        : LexoRank.parse(prevTask?.rank ?? '').genNext().toString()
  }

  async getRank(
    newIndex: number | undefined,
    task: Task | null,
    tasks: Task[]
  ): Promise<string | undefined> {
    if (task == null) return undefined
    if (newIndex == undefined) return undefined
    if (newIndex < 0) newIndex = 0
    if (newIndex >= tasks.length) newIndex = tasks.length - 1

    const currentIndex = tasks.findIndex(x => x.id === task?.id)
    if (currentIndex == newIndex) return undefined
    const generateLexoRankPayload: LexoRankPayload =
      await this.createLexoRankPayload(newIndex, currentIndex, task, tasks)

    const newRank: LexoRank = await this.generateLexoRank(
      generateLexoRankPayload
    )
    return newRank.toString()
  }

  async createLexoRankPayload(
    newIndex: number,
    currentIndex: number,
    task: Task,
    tasks: Task[]
  ): Promise<LexoRankPayload> {
    let lexoInput: LexoRankPayload
    // new position is head of the list
    if (newIndex == 0) {
      lexoInput = {
        prevEntity: undefined,
        entity: task,
        nextEntity: tasks[0],
      }
      // new position is tail of the list
    } else if (newIndex == tasks.length - 1) {
      lexoInput = {
        prevEntity: tasks[newIndex],
        entity: task,
        nextEntity: undefined,
      }
      // new position is between other items
    } else {
      const prevEntity = tasks[newIndex]
      const offset = currentIndex > newIndex ? -1 : 1
      const nextEntity = tasks[newIndex + offset]
      lexoInput = {
        prevEntity: prevEntity,
        entity: task,
        nextEntity: nextEntity,
      }
    }
    return lexoInput
  }
}

export const rankGenerator = new RankGenerator()
