# LiveStore Syncing Example: React & Node.js

This example shows how to sync data between a React app (with Vite) and a Node.js app.

## Usage

### 1. Set up the repo

```
git clone git@github.com:nikolasburk/livestore-monorepo-react-node-syncing-example.git
cd livestore-monorepo-react-node-syncing-example
pnpm install
```

### 2. Run the demo

Start the sync server:

```
pnpm run dev:sync
```


Start the Node.js app:

```
pnpm run dev:node
```

Start the React app:

```
pnpm run web
```

### 3. Create, update, delete todos in the web UI

The React app is running the web UI at [http://localhost:5173](http://localhost:5173). Open the app there and start creating, completing and deleting todos. You'll notice that every action will trigger an event that's printed in the sync server and also makes the Node.js server print the current list of todos.

