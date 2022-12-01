import { gql } from 'apollo-server'

export const typeDefs = gql`
  type List {
    id: ID!
    title: String!
    tasks: [Task!]
  }

  type Task {
    id: ID!
    title: String!
    rank: String
    completed: Boolean
  }

  input CreateListInput {
    title: String!
  }

  input CreateTaskInput {
    title: String!
    listId: String!
  }

  type Query {
    lists: [List!]
    list(id: ID!): List        
  }

  input UpdateTaskInput {
    title: String
    position: Int
    completed: Boolean
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task
    createList(input: CreateListInput!): List!
  }
`
