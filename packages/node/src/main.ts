import process from 'node:process'

import { makeAdapter } from '@livestore/adapter-node'
import { createStorePromise, queryDb } from '@livestore/livestore'
import { makeWsSync } from '@livestore/sync-cf/client'

import { schema, tables } from '@livestore-monorepo/shared/src/schema.ts'

const main = async () => {
  const adapter = makeAdapter({
    storage: { type: 'fs', baseDirectory: 'tmp' },
    sync: { backend: makeWsSync({ url: 'ws://localhost:8787' }), onSyncError: 'shutdown' },
  })

  const store = await createStorePromise({
    adapter,
    schema,
    storeId: 'todo-db-tutorial-v5',
  })

  console.log('✅ Store initialized and syncing...')

  // Set up reactive query to monitor todos changes
  const todos$ = queryDb(tables.todos, { label: 'todos$' })

  // Subscribe to changes (this will log whenever todos change)
  store.subscribe(todos$, (todos) => {
    console.log('📝 Todos updated:', todos.length, 'items')
    todos.forEach(todo => {
      console.log(`  - ${todo.completed ? '✓' : '○'} ${todo.text}`)
    })
  })

  // Optional: Set up a reactive query for specific events
  // You can also listen to specific event streams if needed

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log('\n🛑 Shutting down gracefully...')
    await store.shutdownPromise()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)  // Ctrl+C
  process.on('SIGTERM', shutdown) // Termination signal

  console.log('🚀 Node server running. Listening for events...')
  console.log('Press Ctrl+C to stop.')

  // Keep the process alive - the store will continue syncing in the background
  // The process will stay alive until interrupted
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})



// import { makeAdapter } from '@livestore/adapter-node'
// import { createStorePromise } from '@livestore/livestore'
// import { makeWsSync } from '@livestore/sync-cf/client'

// import { events, schema, tables } from '@livestore-monorepo/shared/src/schema.ts'

// const main = async () => {
//   const adapter = makeAdapter({
//     storage: { type: 'fs', baseDirectory: 'tmp' },
//     sync: { backend: makeWsSync({ url: 'ws://localhost:8787' }), onSyncError: 'shutdown' },
//   })

//   const store = await createStorePromise({
//     adapter,
//     schema,
//     storeId: 'todo-db-tutorial-v5',
//   })

//   const id = crypto.randomUUID()
//   store.commit(events.todoCreated({ id, text: 'new task completed' }))
//   store.commit(events.todoCompleted({ id }))

//   const todos = store.query(tables.todos)

//   console.log('todos', todos)

//   // TODO wait for syncing to be complete
//   await new Promise((resolve) => setTimeout(resolve, 1000))
//   await store.shutdownPromise()
// }

// main().catch(console.error)
