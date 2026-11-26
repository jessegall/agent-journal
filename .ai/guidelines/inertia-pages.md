# Inertia v3 in this project

Laravel Boost writes `.claude/skills/inertia-vue-development/SKILL.md` from Inertia's own skill, and this guideline
comes first. It holds the corrections of report 350 to that skill, checked against `@inertiajs/vue3` 3.11.0 in
node_modules, and this project's rule for pages.

## Pages change and read only through Inertia

- A page changes data with `<Form>`, `useForm` or a router visit to the page's own action route, through
  `sendPageAction(route, data, { only })` from `@kit/pageActions` or `keyedPost` from `@kit/keyedPost`. The controller
  answers with a redirect back through `App\Http\Responses\PageActionAnswers` (`back()`, `backWithNotice()`,
  `backWith()`), never with JSON; a refusal comes back as the page's errors. A flashed `notice` shows as a toast.
- A page reads extra data through a loader it declares with `Loader::make(key, Reader::class)` on its `Page`
  (`->loaders(...)`; the shell's own loaders are in `App\Pages\ShellLoaders`). The frontend calls
  `load(descriptor, input)` or, riding on a write, `loadAfter(descriptor, input, send)` from `@kit/loaders`, with the
  typed descriptors generated into `resources/js/generated/loaders.ts`. The call is a same-page partial reload whose
  `X-Journal-Loader` header names the loader; `App\Http\Responses\LoaderProps` answers it under `load_<key>` or
  `loaderFailure` (ok, invalid or unavailable).
- What every page receives is the typed app context: `App\Web\Data\AppContextData`, built by
  `App\Web\AppContext` with `ContextLazy` fields and read with `useAppContext()` from `@kit/appContext`.
- Pages stay current through Inertia live props: `App\Web\LiveProps` marks a page's props live on the
  viewer's `journal.user` channel, `resources/js/framework/liveTransport.ts` carries them over the tab's one
  connection, and `composables/usePageChanges.ts` takes over each live reload as an async read that never cancels a
  form or a navigation.
- JSON is only for machine clients: the agent CLI's calls, the relay and the terminal's control stream. A sign-in
  challenge stays its own no-store request, so no page prop or history entry holds its secret.
- A post from a page with open state passes `only` and `preserveState` (rule 56).

## Corrections to the official skill

- Deferred props: use `<Deferred data="users">` with a `#fallback` slot (the component throws without one); the
  default slot gets `{ reloading }`, and `#rescue` shows for `Inertia::defer(fn, rescue: true)`.
- `usePoll(interval, requestOptions?, pollOptions?)` returns `{ start, stop, polling }`. Use
  `background: 'throttle' | 'pause' | 'continue'`, not the deprecated `keepAlive`; `mode` is
  `'overlap' | 'cancel' | 'rest'`.
- Vue 3 pages need no single root element.
- The router snippet needs `Link` imported.
- The Vue export is `setLayoutProps` (and `resetLayoutProps`), not `useLayoutProps`. Layout props merge as dynamic,
  then the static `[Layout, { title }]` tuple, then defaults; dynamic ones reset on navigation. Use
  `defineOptions({ layout: Layout })`, never a `<Layout>` wrapper in the template, which remounts on every visit.
- Forms in v3: `useForm('post', '/url', data)`, built-in precognition (`validate`, `touch`, `withPrecognition`),
  `transform`, `dontRemember`, `wasSuccessful`, `recentlySuccessful`, `isDirty`; `processing` and `progress` reset only
  in `onFinish`. `<Form>` also takes `transform`, `options`, `error-bag`, `disable-while-processing`,
  `cancel-on-unmount`, `instant`, `validation-timeout` and `with-all-errors`, and children read it with
  `useFormContext()`.
- Flash data: `Inertia::flash()` on the server, `usePage().flash`, `onFlash`, `router.on('flash')`, `router.flash()`.
- `Inertia::once()`, `Inertia::merge()` with `router.reload({ reset: [...] })`, and `Inertia::optional()` (the v3 name
  of `lazy`).
- v3 removed Axios (use `http.onRequest`, or `axiosAdapter()` from `@inertiajs/core`); `progress.hide()` and
  `progress.reveal()` replace `hideProgress()` and `revealProgress()`; the head attribute is `data-inertia`; the
  packages are ESM only.
- `@inertiajs/vite` can generate the resolver and run SSR in dev; this project keeps a manual `resolve`, which must
  return the same component object for a page on every visit.
- Also in v3: `WhenMounted`, `router.query`, `preserveErrors`, `router.replaceProp`, `usePrefetch`, `cacheTags` and
  `<Link instant>`.
- In the `useHttp` example, name the field `term`, not `query`, which is also a method.

## Sources

Report 350; `node_modules/@inertiajs/vue3/dist/index.js`, `node_modules/@inertiajs/core/types/types.d.ts` and
`node_modules/@inertiajs/vue3/types/usePoll.d.ts`; the v3 docs indexed at https://inertiajs.com/docs/llms.txt.
