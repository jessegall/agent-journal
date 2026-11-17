# Journal 6 domain UI design

To the main agent, from helper 61. This is a proposed design, not an implementation plan. The interactive screen is [index.html](index.html), beside this document. It needs no server or external assets. The example Notes content is illustrative.

## What the user sees

One Journal shell surrounds every signed-in page: the existing 232 px sidebar, title bar, viewer identity and one live connection. Home remains first. Plans and Rules remain where users know them. An installed Notes module adds Notes after Rules, without a separate module category or a technical registration screen. Selecting Notes opens its own page inside the same shell; the shell title comes from its human-readable page title, not its component name.

Home retains Conversation on the left and Plans on the right. The right column becomes a vertical stack of sections; Recent notes appears below Plans. Shared pages expose named placement slots, not arbitrary DOM targets. Home exposes `home.conversation` and `home.overview`. Conversation owns the first slot, and ordered overview sections fill the second. A section contributes its body and local actions; Web supplies its heading frame, loading frame, error boundary and View all link. The complete Notes page owns its list, reader and New note action. A contribution can supply only a page, only sections, or both. A section-only contribution does not produce a dead sidebar entry.

The diagram is an interactive screen study: choose Home, Notes, empty, first load, live update, connection lost, failure, module available, module removed, or unavailable saved link. Navigation and local draft fields work in the prototype. Save and send explicitly do not persist. Plans and Rules links are context placeholders, not redesigned screens.

At narrower widths the sidebar becomes a compact navigation row and the content becomes one column, Conversation then ordered overview sections. This order also defines keyboard and reading order. Production mobile navigation may reuse a shell drawer, but must keep the same order and selected-page label. Fine pointer navigation retains the app's compact density; touch controls need at least 44 px targets. Use semantic headings, visible field labels, a visible focus outline, a polite announcement for completed refreshes, and text alongside connection status. Do not announce each updated row or move focus on a background refresh.

## State decisions

| State | What appears | Behavior and recovery |
| --- | --- | --- |
| Available | Sidebar link and the permitted sections | Stable keys preserve the user's current selection and local state. |
| Initial load | Section heading, reserved body space and loading skeleton | The shell and other sections remain usable; no false zero count. |
| Empty | No notes yet, a short explanation and Open Notes | Authorized empty content stays visible. Permission-hidden content occupies no space. |
| Ready | Domain content and local actions | View all reaches the domain page with its approved selection context. |
| Refreshing | Existing rows remain; subtle updating text | Replace only when the new read succeeds. Never clear a draft, selection or scroll position. |
| Refreshed | New row and Updated just now | One polite announcement, then return to ordinary status. No automatic navigation. |
| Read failed | Existing data marked stale, or a contained error on first load | Retry reads that section. Other sections keep working. Log the failure with its contribution key; never show a stack trace. |
| Connection lost | Shell says Reconnecting; visible last-loaded data stays | Reconnection performs a complete authorized refresh. Manual refresh remains available; do not silently retry mutations. |
| Validation or rejected action | Field errors and the unchanged draft | The domain decides validity and permission again on submission. A lost mutation response requires a read of current state, not an automatic second mutation. |
| Newly installed | Notes appears after the release is ready; quiet availability notice | Refresh shared navigation and sections. If an old client needs new assets, offer Reload after preserving drafts. Do not force reload during a form submission. |
| Removed on Home | Notes navigation and section disappear | Remove only that section, retain other filters and drafts. No empty hole. |
| Removed while on Notes | This page is no longer available; Go to Home | Remove its navigation and readable data immediately on confirmed unavailability; no automatic redirect hiding the reason. A local unsent draft may remain until sign-out, but cannot be submitted. |
| Fresh missing or forbidden link | The same neutral page-unavailable screen | Do not reveal the former page's records or distinguish hidden data from missing data. An expired login instead returns the established sign-in flow. |
| Version mismatch or asset failure | Shell and readable existing content stay; reload action | Do not expose an unbuilt contribution. A failed lazy chunk load can retry once through an explicit reload; persistent failure is reported. |

Initial loads and refreshes are separate states. Every contribution has its own failure boundary, including a failed Vue render or lazy component import. An authorization failure removes stale protected content rather than leaving it under an ordinary retry error. Loading never means absence, and absence never masquerades as failure.

## Ownership and the registration contract

Choose a small public UI area in `app/Core/Ui`. Core owns the interfaces because it must accept implementations from arbitrary registered owners; it imports no domain. Add the public types deliberately to CoreApi. Interfaces live in `app/Core/Ui/Contracts`, failures in `app/Core/Ui/Exceptions`. This is the newly needed supplier seam that doc 10 deferred; it does not open all domain internals or introduce a general command bus.

Each owner provider contributes immutable definitions through Core's `UiRegistration`. The registry keeps definitions and class references for request adapters, never resolved adapters, models, current viewers or request context. Registration freezes once per worker and rejects duplicates. The owner binds its adapter in the request scope; Core invokes it only through `UiContribution`. Web asks Core's `UiCatalog` for authorized navigation and placement definitions. Web neither imports Notes nor reads its private classes through reflection. This is the same ownership principle as the existing Core extension contracts, with a concrete UI consumer now justifying it.

The names below describe the intended programming contract; they are proposed names, not current APIs.

| Declaration | Required information | Choice and reason |
| --- | --- | --- |
| Owner | Registered domain identity, stable UI namespace, UI contract major version | Use a vendor-qualified UI namespace, such as `example.notes`; current domain names remain unchanged. Collision rejection prevents one module replacing another. |
| Page | Stable key, human title, component key, named GET route, route parameters, active navigation key | Example page `example.notes.index`, component `example.notes/pages/Index`, route `example.notes.index`. Explicit titles decouple page labels from build paths. |
| Navigation | Stable key, label, icon from the shared icon set, page key, group and integer position | Home is pinned first. Other entries sort by position then stable key; same-position entries never depend on provider load order. The server filters entries by actor permission. |
| Section | Stable key, heading, shared-page slot key, integer position, component key, named read route, typed body, optional destination page | Example `example.notes.recent`, slot `home.overview`, position 200. Plans occupies position 100. A generic shell never interprets Notes fields. |
| Placement | Declared host slot and allowed cardinality | Web publishes Home's two slots as neutral Core values. Unknown or overfilled single slots fail registration, rather than disappearing at runtime. Multiple overview sections stack. |
| Request adapter | Core interface implementation resolved for this request; visibility and permission methods | Permission is recomputed for every page read, section read and action. No visibility result is frozen in the catalog. |
| Route registration | Owner-local route registration adapter implementing Core `UiRoutes` | Web invokes these adapters inside its authenticated browser group. The implementation names only its own controllers. Paths and names are explicit, reserved names cannot be overwritten. |
| Refresh | Owner-local fact listeners and the page/section keys each invalidates | Typed listeners name facts where the boundary already permits it. This is an explicit map, not wildcard event strings or a central list of foreign PHP classes. |
| Build sources | Owner-relative Vue source root, component entries and TypeScript Data roots | Resolve relative paths against the registered root. Only declared sources enter the build; arbitrary filesystem or remote component paths are refused. |

Keep structure in typed immutable values and request behavior in interfaces. The public Core interfaces return Core values and framework Data types, never a union mentioning every owner's PHP Data. A typed owner response stays opaque to Web; generated owner-specific browser types restore exact types at the Vue boundary. A read result distinguishes ready data, denied, and unavailable. Framework exceptions still keep their appropriate status and logs; rendering boundaries may contain an unexpected section failure without swallowing its diagnostics.

Every owner's UI reader uses its exported query interface and immutable values. Its UI command handler uses exported action interfaces. It never reaches its domain models or tables directly, even though the UI lives in that owner's folder. This stricter local rule keeps the presentation replaceable and makes cross-owner access unambiguous. Owner-private computed page Data can hold hidden composition services; published API Data still cannot hide private services or models (doc 10 section 10).

New features require their own domain exports only when a needed query or command is missing. No new domain-to-domain requirement is introduced by contributing UI. A contribution that wants another domain's data must use an already approved requirement and its exports, or seek approval for that dependency under rule 9; registration does not authorize it. In particular, no proposal adds Web → Notes or Notes → Web.

## File placement and browser composition

Choose co-location as the default. A built-in domain keeps PHP under `app/Domain/<Name>/Ui/` (Pages, Data, Http, and route registration) and Vue under `app/Domain/<Name>/Ui/resources/js/` (pages, sections and local components). Its normal Contracts and Api folders remain the domain's public business surface. A package keeps precisely the same relative Ui tree under its registered source root outside app. Modules do not copy files into app or the central pages folder.

For existing Web pages, keep `resources/js/pages` working during migration. Existing Web-owned adapters for its approved Chat, Plans and Rules requirements remain valid; the design does not force a wholesale move of those pages. New owner contributions use the same catalog path as existing contributions. A future move of Plans presentation into Plans must update its one registration, routes and generated imports, not duplicate the page. Do not create two live route owners.

Separate the shared browser kit from Web-specific page code: host-neutral controls, tokens and the section bridge are a public browser package exposed as `@journal/ui`. It may be implemented in a shared resources directory, but its contract belongs to Core UI and it names no domain. A contribution may import its own browser files, this kit, framework packages, its generated types and its generated route functions. It may not import another contribution's private Vue component or Web's private page code. Web may only reference generated neutral component keys for owners it does not require. The build-produced composition file is an explicit composition boundary, not permission for handwritten cross-owner imports.

On Home, Web sends authorized section definitions and stable read URLs. Each generic section host lazy-loads its declared component and performs the contribution's read through that component's typed adapter; the owner endpoint returns typed Data. Web does not merge all owners' fields into HomePage. This independent read is a deliberate choice: one slow or failed section cannot make Home fail, and a retry can target that section. Shared page sections are browser-loaded with skeletons; full domain pages keep Inertia's page response and server rendering where already supported. A section read is not a mutation.

The server resolves navigation hrefs using its named routes; the generic sidebar needs no imports of module route helpers. Owner Vue uses generated Wayfinder route functions for its own local links and forms. Page selection uses an explicit navigation key rather than prefix matching overlapping paths. Namespace each section's query state so one module's filters cannot overwrite another's, while preserving Home's existing conversation and plans query behavior. The shared bridge merges unrelated query keys and validates a module's query input server-side.

## Vite, Wayfinder and generated types

Generate a UI build manifest from exactly the domains and modules registered for that release. It records owner roots, literal component import paths, component keys, contract version and a content hash. PHP generation runs before TypeScript and Vite and requires no current actor or database read. Runtime navigation is never baked into this manifest: permissions belong to the request.

Vite consumes an emitted import map with literal lazy imports for pages and sections. This supports roots outside app without a broad filesystem glob or HTTP-loaded executable plugin. The Inertia page resolver combines existing pages with these keyed module pages; server and client consume the same generated map. Unknown keys are build failures, not a runtime import constructed from request input. Expose only explicitly registered source roots to the dev server and watcher; the current vendor ignore must be narrowed for an actively developed installed module. Build the module CSS into the release and include those source roots in utility-class scanning. Use shared tokens and scoped styles so module CSS cannot repaint the shell. SSR components must not read browser-only APIs until mount.

Every contribution's routes must be registered before Wayfinder generates. The current Vite Wayfinder integration remains the only route generator, with form variants. Generated route namespaces include the stable owner prefix, so two modules' index routes do not collide. Web's core routes such as login and home are reserved. Only browser GET routes appear as navigation targets; mutation routes have their own methods, CSRF protection and validation. Each owner controls its route implementation inside the mandatory browser middleware group.

Extend TypeScript generation from today's app-only scan to the registered owners' declared Data roots, including external roots. Mark browser Data with TypeScript, keep hidden fields hidden, and retain decimal-string ids and omitted optional values. Generate owner-qualified output modules under `resources/js/types/generated/<owner>/`, plus a shared index for current Web compatibility. Two unrelated `IndexPage` names must not collide in a flat writer. Vue imports these generated shapes; it does not hand-write mirrors of PHP fields. Generate the component-to-props mapping alongside the import map so the owner adapter is type-checked against its component and response.

Use the same manifest hash in the server catalog, built asset manifest and Inertia asset version. A release is not ready if component entries, routes, type output, CSS sources or contract versions disagree. The exact Inertia resolver hook and transformer writer integration must be confirmed by the implementing worker against installed package APIs; this design states the contract and makes no claim that the current config already supports external UI.

## Live updates and actor scope

Keep AppSidebarLayout as the sole owner of the authenticated connection and keep `PageChanged` on `journal.user.{id}` as the transport. Domains must not raise Web's event. Each owner listens to its own after-commit facts and calls Core's public `UiChanges` interface with its own contribution keys. Web supplies the implementation of that Core interface and converts invalidations into its own PageChanged broadcasts using Access's existing authorized audience. This interface call is a supplied service, not a domain emitting a Core extension event. It requires no new cross-domain dependency and no Web listener naming Notes facts.

The owner-local listener is the declaration of which facts matter: for illustration, a Notes-owned published NoteSaved fact would invalidate `example.notes.index` and `example.notes.recent`. That event does not exist in the current Notes fixture. A listener hearing another domain's fact still needs its direct approved dependency and the owner's export, as doc 10 requires. Foreign class names do not appear in neutral manifest values to evade the rule.

Extend the notification with safe contribution keys and the catalog revision, not records, titles, actor credentials or model objects. Only currently visible matching contributions reload. Coalesce a burst using the current 250 ms behavior; wait until form submission has completed so a reload cannot replace its errors. Keep an in-flight read counter per contribution and discard responses older than the latest read or from a previous viewer or route. A refresh updates server data without remounting keyed components. On reconnect, visibility return and explicit Refresh, re-read all visible contributions and the shell catalog to recover missed facts. The catalog revision is checked on ordinary navigation too.

Broadcasts are hints, not durable delivery. The current facts have no replay or outbox; a process can die between commit and publication, and a failed subscriber can prevent later listeners. Do not promise exactly-once updates or immediate recovery from every loss. A failed broadcast must be logged and reads must reconcile state. A retry of a mutation is not a replay mechanism.

Every page, section read and mutation runs `web`, authentication and `journal.user` before binding or resolving the scoped adapter. The actor remains the signed-in user even when an agent/session filter is selected. Verify that target through the domain export; request input is not authority. The same policy decides sidebar visibility, section visibility, endpoint access and actions, with every endpoint enforcing it again. Current owner-only access stays unchanged. A future wider audience must filter notification recipients as well as reads; metadata keys must not expose a hidden module to unauthorized viewers.

Only immutable structural definitions are worker-lived. CurrentActor, permission results, UI readers, Data objects, filters and per-request caches are scoped and discarded between Octane requests. Never capture them in singleton constructors, boot closures, static maps or retained component definitions. Queue jobs resolve their own required state and do not reuse a web request's actor. Sign-out or viewer change leaves the old channel, cancels pending reads and timers, clears sensitive drafts and data, and loads a fresh catalog. Browser state is tab-local; server rendering never shares a module-level current viewer or live connection.

## Installing and removing an external module

Choose deployment-time integration, not runtime script installation. A trusted package supplies its descriptor, provider, exports, Ui definitions, PHP adapters, Vue source, supported UI contract major and explicit asset dependencies. The registered root is derived from its real descriptor as today. It is checked as an owner in both directions; putting code in vendor grants no exemption. Its provider may register its own Core interface implementations but may not replace another owner's entries.

Installation registers that descriptor beside domains, resolves declared package dependencies, generates the route/type/component manifest, builds assets and ships one matching release. Restart Octane and queue workers into that release. Only after readiness succeeds does the module enter the served catalog. If registration or build fails, retain the previous working release; never publish a half-present sidebar. Source inspection must reject duplicate keys, missing or reserved routes, unknown slots, wrong response/component types, unsupported UI contract versions and unapproved cross-owner access. A worker must extend architecture checks to these new seams and frontend imports; no checks were run for this design.

Removal first disables the module in the served release's authorized catalog and routes, then ships the rebuilt release and restarts workers. Existing requests may complete under their old release; the client ignores removed contribution keys and old read responses after catalog reconciliation. Keep the previous static assets for active old tabs during the release transition, but deny removed routes on the current server. A matching queued invalidation for a removed key is ignored. Send a catalog-change hint when possible and reconcile on reconnect/navigation/focus; disconnected tabs cannot be updated instantly. Do not delete module records as part of UI removal. Data retention or uninstall migrations are a separate owner operation.

Shared deployment metadata records which former registered routes now need the neutral unavailable response. A fresh arbitrary nonexistent URL remains an ordinary 404 with the same safe shell treatment. This avoids catching all route failures as module removal. An old client crossing asset versions is offered a reload with unsent work preserved; it is never made to execute a remote plugin from an unverified URL.

## Evidence in the existing code

| Finding | Evidence |
| --- | --- |
| One persistent shell owns the live connection | `resources/js/layouts/app/AppSidebarLayout.vue:8-24`; `resources/js/composables/useLiveConnection.ts:11-33` |
| Sidebar is a fixed 232 px list of three pages | `resources/js/components/shell/AppSidebar.vue:8-16`, `:29-64` |
| Home has two hardcoded panes and preserves shared query state | `resources/js/components/home/HomePanes.vue:2-6`, `:14-36`; `resources/js/pages/Home.vue:8-18` |
| Current page reload is whole page prop, coalesced and delayed during forms | `resources/js/composables/usePageChanges.ts:11-36`, `:51-59`, `:70-80` |
| Web owns browser routes and its four declared dependencies | `app/Domain/Web/Routes/web.php:14-25`; `app/Domain/Web/WebDomain.php:25-35` |
| Current notification carries no data and Web names the known facts | `app/Domain/Web/Events/PageChanged.php:15-42`; `app/Domain/Web/Listeners/BroadcastPageChange.php:10-38` |
| Types currently scan app only with a flat writer | `app/Domain/Web/Types/TypeScriptServiceProvider.php:21-29` |
| Vite has automatic Inertia integration and Wayfinder; vendor changes are ignored | `vite.config.ts:11-35`, `:37-50`; `resources/js/app.ts:9-16` |
| External root discovery already follows the descriptor's file | `app/Domain/DomainEntry.php:35-58`; `app/Domain/DomainRegistry.php:26-60`, `:84-86` |
| External Notes is a boundary fixture, not a UI module | `tests/Fixtures/Modules/Notes/NotesDomain.php:12-31`; `tests/Fixtures/Modules/Notes/NotesServiceProvider.php:10-18` |
| Actor lifetime, authorized target and generated shapes are established requirements | `docs/web/boundary.md:5-17`, `:30-36`, `:59-65`, `:75-81` |
| Existing boundary checks include outside modules, public signatures and scoped dependencies | `docs/hooks/dependencies.md:54-67`; journal doc 10 sections 9, 10 and 14 |
| Facts are after commit with explicit failure and replay limits | `docs/hooks/public-events.md:3-7`, `:18-31` |
| Version 5 declared entry, placement, events, skeleton and slots | `/Users/jessegall/projects/agent-journal/src/engine/viewer/window_declaration.py:28-65`, `:67-88` |
| Version 5's external section fixture filled a named inspector slot | `/Users/jessegall/projects/agent-journal/tests/stories/fixtures/acme_plan_notes/module.py:14-23` |

Version 5 was read only as a reference for declarative ownership; no source was copied.

## Delivery and limits

Only `docs/designs/domain-ui/index.html` and this design document were written. No app code, tests, build, package installation or deployment was changed or run. A worker is required to implement the Core UI seam, owner adapters, catalog composition, route wrapping, browser import map, build/type discovery, live invalidation and architecture enforcement described here. There is no task list or implementation plan in this design.

The local preview is complete as a design source. Browser rendering and interactions were not executed in this helper session. No Claude Design or standalone Artifact publishing tool was available. The available Pages HTML publisher required creating a host Page; that call was blocked before execution by the read-only helper tool policy: `Read-only agents have no mcp__codex_apps__chatgpt_space__create_page: say in your report what you need.` No hosted Page was created and there is no published URL. The main agent must publish the saved HTML using an authorized artifact/design tool and return that actual link. The requested Claude Design pin cannot be made without a real `https://claude.ai/design/...` URL; do not pin this journal document or invent a URL.
