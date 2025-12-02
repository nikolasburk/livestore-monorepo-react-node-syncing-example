import { makeWorker } from '@livestore/adapter-web/worker'
import { makeWsSync } from '@livestore/sync-cf/client'

import { schema } from '@livestore-monorepo/shared/src/schema.ts'

makeWorker({
  schema,
  sync: {
    // backend: makeWsSync({ url: `${location.origin}/sync` }),
    backend: makeWsSync({ url: 'ws://localhost:8787' }), // Match node app URL
  }
})