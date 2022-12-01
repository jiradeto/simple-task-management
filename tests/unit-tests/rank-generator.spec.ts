import 'jest'
import { Task } from 'generated/types'
import { rankGenerator } from '../../libs/utils/rankGenerator'



describe('Environment', () => {
  let dummyTask: Task
  let tasks: Task[]
  let item_1: Task
  let item_2: Task
  let item_3: Task
  let item_4: Task
  let item_5: Task

  function sortByLexoRankAsc(a: any, b: any): number {
    if (!a.rank && b.rank) {
      return -1;
    }
    if (a.rank && !b.rank) {
      return 1;
    }
  
    if (!a.rank || !b.rank) {
      return 0;
    }
  
    return a.rank.localeCompare(b.rank);
  }

  const sort = (tasks: Task[]) => {
    return tasks.sort(sortByLexoRankAsc)
  }

  beforeEach(() => {
    dummyTask = <Task>{
      id: 'id_0',
      rank: '0|hzzzzz:',
      completed: false,
      title: 'foo',
    }

    item_1 = <Task>{
      id: 'id_1',
      rank: '0|hzzzzz:',
      completed: false,
      title: 'item_1',
    }
    item_2 = <Task>{
      id: 'id_2',
      rank: '0|i00007:',
      completed: false,
      title: 'item_2',
    }
    item_3 = <Task>{
      id: 'id_3',
      rank: '0|i0000f:',
      completed: false,
      title: 'item_3',
    }
    item_4 = <Task>{
      id: 'id_4',
      rank: '0|i0000n:',
      completed: false,
      title: 'item_4',
    }
    item_5 = <Task>{
      id: 'id_5',
      rank: '0|i0000v:',
      completed: false,
      title: 'item_5',
    }
    tasks = [item_1, item_2, item_3, item_4, item_5]
  })

  it('should assign valid rank for the first item in the list', async () => {
    const taskRank = await rankGenerator.initialRank(null)
    expect(taskRank).toBe('0|hzzzzz:')
  })

  it('should assign valid rank for the second item in the list', async () => {
    const taskRank = await rankGenerator.initialRank(dummyTask)
    expect(taskRank).toBe('0|i00007:')
  })

  it('should return undefined if move to the same position', async () => {
    const taskRank = await rankGenerator.getRank(0, item_1, tasks)
    expect(taskRank).toBe(undefined)
  })

  it('make item_1 as to index 3 ', async () => {
    const taskRank = await rankGenerator.getRank(3, item_1, tasks)
    item_1.rank = taskRank
    const newSortedTasks = sort(tasks)
    const newIndex = newSortedTasks.findIndex(x => x.id == item_1.id)
    expect(newIndex).toBe(3)
  })

  it('make item to last position of assigned to arbitrarily large number ', async () => {
    const taskRank = await rankGenerator.getRank(3000, item_3, tasks)
    item_3.rank = taskRank
    const newSortedTasks = sort(tasks)
    const newIndex = newSortedTasks.findIndex(x => x.id == item_3.id)
    expect(newIndex).toBe(tasks.length-1)
  })

  it('make item to first position of assigned to arbitrarily small number ', async () => {
    const taskRank = await rankGenerator.getRank(-3000, item_4, tasks)
    item_4.rank = taskRank
    const newSortedTasks = sort(tasks)
    const newIndex = newSortedTasks.findIndex(x => x.id == item_4.id)
    expect(newIndex).toBe(0)
  })

  it('move to somewhere between other items ', async () => {
    const taskRank = await rankGenerator.getRank(3, item_2, tasks)
    item_2.rank = taskRank
    const newSortedTasks = sort(tasks)
    const newIndex = newSortedTasks.findIndex(x => x.id == item_2.id)
    expect(newIndex).toBe(3)
    // also check adjacent items
    expect(newSortedTasks[2]).toBe(item_4)
    expect(newSortedTasks[4]).toBe(item_5)
    
  })
})
