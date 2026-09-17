# React + Vite

## Running the frontend

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and communicates with the Express API at `http://localhost:5000`.
Start the backend separately from `task-manager-api-24it086` with `npm install` and `node server.js`.

## Practical 8: Performance Optimization and Lazy Loading

### Objective

Improve frontend performance using route-based lazy loading and code splitting in React.

### Lazy loading implementation

The application uses `React.lazy()` with dynamic imports in `src/App.jsx`. The existing route structure, task CRUD functionality, API calls, styling, and backend integration were preserved.

### Lazy-loaded routes

- `/projects` loads `src/components/Projects/Projects.jsx` as a separate route chunk.
- `/contact` loads `src/components/Contact/Contact.jsx` as a separate route chunk.

The optional additional lazy-loaded component was not added because the Projects route already contains the substantial task-management CRUD interface and no extra split was necessary.

### Suspense fallback

The route section is wrapped in `Suspense` with this loading state:

```text
Loading page...
Please wait while the page loads.
```

The fallback appears while a lazy route component is being downloaded and evaluated.

### Baseline production build

Measured before implementing lazy loading:

```text
Vite: 8.1.4
Modules transformed: 49
Build time: 243 ms
Main JavaScript: 241.03 kB, gzip 77.06 kB
CSS: 12.72 kB, gzip 3.54 kB
```

The baseline build generated one main JavaScript file containing the route code.

### Optimized production build

Measured after implementing lazy loading:

```text
Build time: 191 ms
Main JavaScript: 236.53 kB, gzip 75.79 kB
Projects chunk: 5.16 kB, gzip 1.89 kB
Contact chunk: 0.13 kB, gzip 0.13 kB
```

The optimized build generated separate route chunks similar to:

```text
Projects-BWiedLep.js
Contact-CjIS4WOA.js
```

### Before and after comparison

The initial JavaScript bundle became smaller because Projects and Contact route code moved into separate chunks. The browser can download those chunks when their routes are visited. Total JavaScript downloaded over a complete session may eventually include all visited route chunks.

Browser measurements must be recorded from Chrome DevTools using the actual Network values:

```text
Baseline total JavaScript transferred: [record actual value]
Optimized total JavaScript transferred: [record actual value]
Baseline initial load time: [record actual value]
Optimized initial load time: [record actual value]
Projects chunk browser size: [record actual value]
Contact chunk browser size: [record actual value]
```

### Network testing

In Chrome DevTools, open **Network**, enable **Disable cache**, select the **JS** filter, and reload the home route. Then navigate to `/projects` and `/contact`.

The initial request list should contain the smaller main bundle. Navigating to `/projects` should request a file containing `Projects`, and navigating to `/contact` should request a file containing `Contact`.

### Slow 3G testing

Chrome DevTools was configured with **Slow 3G** throttling and **Disable cache** enabled. Each lazy route was opened while observing the Network tab.

```text
/projects fallback observed: [record Yes or No]
/contact fallback observed: [record Yes or No]
Fallback observation: [describe what was visible]
```

### Screenshots and evidence

Add the following screenshots to the practical submission:

1. Baseline build output showing the original single JavaScript bundle and its size. This proves the pre-optimization production asset structure.
2. Optimized build output showing the main bundle plus `Projects` and `Contact` chunks. This proves code splitting was generated.
3. Chrome Network tab after loading `/`. This proves the initial JavaScript requests and transferred sizes.
4. Chrome Network tab after navigating to `/projects`. This proves the Projects chunk loads on route navigation.
5. Chrome Network tab after navigating to `/contact`. This proves the Contact chunk loads on route navigation.
6. Chrome Slow 3G view while a lazy route loads, with the `Loading page...` fallback visible if observed. This proves the Suspense loading state during delayed chunk loading.

### How to run the project

From the frontend directory:

```powershell
npm install
npm run dev
```

To create a production build:

```powershell
npm run build
```

The frontend runs at `http://localhost:5173`. The backend can be started separately from `task-manager-api-24it086` with `npm install` and `node server.js`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
