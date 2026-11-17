# Journal 6 domain UI design

To the main agent, from helper 61. Proposed design, not an implementation plan. [Open the standalone visual](index.html). Reports 61 and 63 were read in full; every finding is settled below. Example data is illustrative. Ownership recommendations are not approvals to change the app.

## What the user sees

Version 6 uses version 5's look and feel (message 1350), including its existing visual density, rather than a new dashboard style. The shell has the same 232 px sidebar, 48 px breadcrumb/search bar, 26 px purple A mark, two-line project/environment identity, 30 px navigation rows and muted uppercase group labels. Home stays first; Work contains Plans and the installed Notes module, and Agents contains Rules. Only available version 6 pages are listed: the larger version 5 navigation inventory is not a promise to add unimplemented features. Notes has Recent and Collections children; Collections has Decisions and Research children. A navigation item can contain children recursively, without a fixed depth limit. Selecting a page opens it inside this shared shell; the shell title comes from its human-readable page title, not its component name. One live connection still belongs to the shell.

Draw a separate disclosure button beside a parent page link: selecting Notes opens its page; selecting its chevron expands or collapses children without navigation. A group with no page has a single labeled disclosure button. The visual includes expanded and collapsed sidebar presets and working disclosures at two levels. Lists nest semantically, with `aria-expanded` and `aria-controls` on disclosures, and `aria-current=page` only on the selected link. Expand the active page's ancestors on navigation, but allow the user to collapse them afterward; a collapsed ancestor shows a small “Current page inside” marker. Preserve expansion by stable key within the current viewer's tab and clear it at sign-out or removal. Sort siblings by position then key at every depth. A hidden parent prunes its whole subtree; an authorized page-less group with no visible children disappears. A visible parent page remains even when all children are hidden. Reject repeated keys, but never impose a maximum tree depth. Children are nested immutable values, not key references, so no cycle graph is introduced. After a few levels, cap visual indentation and use a branch line plus breadcrumb to retain readable width; do not truncate the actual hierarchy. On small screens, use a vertical navigation drawer, not a horizontal row of nested items.

Home follows the version 5 home renders: a 54 px Working/task band, a 30 px line of muted agent facts, then two equal, edge-to-edge panes separated by one 1 px rule. Each pane begins with the same 34 px compact tab strip. Conversation stays left, with a centered day label, alternating message bubbles, small inline journal marks and the composer anchored at the bottom. There is no oversized Home heading, marketing subtitle, padded canvas or card enclosing each pane. The right pane holds Plans and Notes tabs; Plans shows version 5's compact two-column plan cards with muted type/id facts, a small outlined status badge, a 4 px blue progress track and a narrow focus edge. Plans retains its complete full-height search, grid, paging and selected-record reader. Notes occupies a sibling tab rather than reducing the Plans slice to a summary. A Plan record preview also shows a related-notes section below the plan reader text. No new floating widget treatment is introduced.

Shared pages still expose named placement slots, not arbitrary DOM targets. Home exposes `home.conversation` and `home.overview`. Conversation owns the first slot; ordered overview sections receive sibling tabs in the second slot, not permanently stacked panels. A section contributes its body and local actions; Web supplies the version 5 tab/header band, loading rows, error boundary and View all link. The complete Notes page uses version 5's document list/reader layout: a compact 16 px title and New action, a filter strip, a 360 px list with a selected-row accent edge, and a reader with metadata, a 17 px title, underline tabs and a 16 px text inset. It owns its list, reader and New note action. A contribution can supply only a page, only sections, or both. A section-only contribution does not produce a dead sidebar entry.

The visual is an interactive screen study: choose Home, Notes, nested navigation expanded/collapsed, empty, first load, live update, connection lost, failure, module available, module removed, or unavailable saved link. A separate Appearance selector shows the same screen in Dark or Light. These review controls and the architectural caption sit outside the depicted application. Navigation links, sidebar disclosures, pane tabs, note selection, page finding and local draft fields are represented by local interactions. Save and send explicitly do not persist. Plans and Rules are context views, not redesigned feature flows. No prototype control invokes the app.

At widths below 860 px the panes stack, Conversation then overview, following the version 5 prototype's breakpoint. At phone widths the Pages button opens the vertical nested navigation; children never become a horizontal navigation row. The list/reader also stacks when its columns no longer fit. This order defines keyboard and reading order. Fine pointer navigation retains version 5's compact density; touch navigation uses 44 px targets. Use semantic headings, accessible field labels, a visible accent focus outline, polite refresh announcements and text alongside connection status. Do not announce each updated row or move focus on a background refresh.

The visual uses version 5's actual Geist font, embedded in the standalone HTML, with its 13 px / 1.45 body, 12.5 px navigation, 11–12 px metadata and 10.5 px group labels. The spacing scale is 4/8/12/16/20/24/32 px; shared content edges align at 16 px. Corners stay 6 px on controls, 8 px on search, 10 px on messages and plan cards, and 14 px on the composer. Rows and pane dividers remain quiet 1 px rules. Badges are compact outlined labels with a small state dot, not large filled pills. Purple is for selection, links and focus; blue is progress, amber is blocked or interrupted work, and red is failure.

Dark uses the exact reference tokens: sidebar `#0d0e10`, canvas `#131416`, raised `#18191c`, selected `#212329`, line `#25272b`, text `#e6e7ea`, secondary `#a9acb3`, muted `#83868e`, accent `#5e64c9`, link `#a3a8f0`, progress `#5b8def`. Light uses the existing version 5 app's `light.css`: sidebar `#f5f5f7`, canvas `#ffffff`, raised `#f6f6f8`, selected `#e8e9ee`, line `#e5e6ea`, text `#1a1b1f`, secondary `#474a52`, muted `#6b6e77`, the same accent and link `#4a50b5`. The supplied prototype and inspected page renders are dark; the light version is grounded in the app's light stylesheet, not a claimed light screenshot comparison.

Loading occupies the section's ordinary rows with static neutral skeleton lines. Empty content is one quiet inline statement with a small action, rather than an oversized illustrated empty card. Errors use a short red sentence and Retry in that same area. Disconnect and availability messages use a narrow tinted strip under the facts band. A refresh leaves existing rows visible, then adds small Updated just now text. Removal uses the usual shell with a restrained 16 px unavailable heading and Home action. The states below retain their behavior; all inherit these version 5 surface rules in both appearances.


Keep today's viewer, Light/Dark/System appearance control and Sign out in the top bar; remove the sidebar-footer viewer. Version 5 breadcrumb/search and Working/facts bands are proposed changes relative to today's v6 AppTopbar, required by the requested v5 appearance. Live status and manual Refresh are explicitly new recovery affordances. They are not claimed to exist in the current shell.

The revised selector also covers Chat, a page-only contribution, a Plan record section, six-level nesting, both mobile drawer states, and every state below. Review controls are outside the depicted product. A mobile drawer is modal: opening moves focus into it, Escape closes it, closing restores the Pages trigger, and background content is inert while open. Notes and conversation drafts are retained independently in the local demonstration.

## State decisions

| State / preview | What appears | Behavior |
| --- | --- | --- |
| Available / Home | Complete Plans pane; Notes sibling tab | Stable keys, no dead navigation. |
| Initial load / Loading | Section header and neutral row skeletons | Can represent chunk loading with props already received; no extra section fetch. |
| Empty | Quiet No notes yet line and Open Notes | Authorized empty content remains; hidden sections occupy no space. |
| Ready / Notes | Domain list and reader | Shared shell; domain content. |
| Refreshing | Existing rows and Updating | Keep filters, selected tab, scroll and both drafts. |
| Refreshed / Live update | New row and Updated just now | No focus move or navigation. |
| First-load read failure | Contained error and Retry | Retry reloads the host page prop. |
| Stale failure | Last readable rows, stale label and Retry | Only retain data when visibility was reconfirmed for the same viewer/context. |
| Connection lost | Last page, narrow status strip and Refresh | Reconnection reloads host props; never retry mutations silently. |
| Rejected action | Notes draft and field error | Domain validates permissions and current record state again. |
| Installed after deployment | Complete new shell with Notes | Fresh release, no runtime installation notice. |
| Removed on Home | Home without Notes navigation/tab | Plans retains its pane; no empty gap. |
| Removed page / Saved missing link | Ordinary safe 404 shell with Home action | No former-route database or module-removal routing system. |
| Permission removed | Protected section and stale rows disappear | A denial is never disguised as transient failure. |
| Version mismatch / Asset failure | Reload notice with preserved unsent draft | Normal Inertia asset-version reload; explicit recovery for failed chunks. |
| Login expired | Sign-in prompt without protected content | Existing auth flow. |
| Mobile closed / Mobile open | Pages trigger or modal navigation drawer | Focus containment, Escape and trigger restoration. |

All state previews retain v5 surfaces in both appearances. Browser interaction checks remain outstanding; local source demonstrations are not proof of application behavior.

## Ownership and optional Domain interfaces

The Domain class declares its UI through ProvidesNavigation::navigation(), ProvidesPages::pages() and ProvidesSections::sections(), all in App\Domain\Contracts beside ProvidesStates. Implement only what is needed. These methods are argument-free, return immutable definitions, and never read an actor/database or resolve a service.

No Core UI registry and no provider push API. DomainRegistry reads the optional interfaces on exactly the registered entries, following its current ProvidesStates pattern. A derived foundation catalog retains structural definitions and reader class references, never resolved readers, actor context or permission results. Web consumes the foundation contracts without naming unknown owners.

Concrete placement avoids loose PHP at app/Domain/Ui:

| Kind | Proposed location |
| --- | --- |
| Optional interfaces, PageReader, SectionReader, VisibilityCheck and ChangesPages marker | app/Domain/Contracts, matching App\Domain\Contracts namespace |
| Immutable NavigationItem, PageDefinition, SectionDefinition, SlotDefinition, RouteDefinition, SectionResult and SlotContext | app/Domain/Ui/Data, matching App\Domain\Ui\Data namespace |
| Derived UiCatalog and validation/composition support | app/Domain/Ui/Support, matching namespace |
| Startup declaration failures | Existing app/Domain/Exceptions, under DomainDeclarationError |
| Ordinary listeners | Registered owner's root Listeners folder, never Ui/Listeners |

FolderLayoutTest checks loose files at immediate folder roots: there are no app/Domain/Ui/*.php files and no requested blanket exemption. BoundaryChecker already recognizes foundation names, so no namespace allowlist widening is needed. Public signature/event checks must explicitly permit these listed foundation contracts where necessary, particularly ChangesPages on exported facts; they still reject private type leaks. No Core notification interface or Core export is added.

## Today's owners and the Chat example

Declaring navigation does not silently transfer the approved ownership in docs/web/boundary.md.

| Domain | What it declares | Status |
| --- | --- | --- |
| WebDomain | ProvidesPages for Home, Plans, Rules, Login; ProvidesNavigation for Home, Plans, Rules; Home and plan-reader slot definitions | Preserve current owners and URLs. Login has no navigation association. Remove sidebar's hardcoded list in favor of the catalog. |
| ChatDomain | User's example: ProvidesPages for a new Chat page; ProvidesNavigation for Chat with Conversations and Saved conversations children; optionally ProvidesSections | New owner-controlled UI under the recommended boundary extension below. Existing Home chat initially remains Web-owned. |
| PlansDomain | No duplicate page/navigation while Web owns Plans | Retains its business readers/actions. |
| RulesDomain | No duplicate page/navigation while Web owns Rules | Retains its business readers/actions. |
| External NotesDomain | Its own nested navigation, Notes page, Home notes section and plan-related notes section | Same interfaces under an outside-app registered root. |
| Page-only Notes example | ProvidesPages only, for a note reader with no navigation association | No empty navigation method or invented key. |
| Section-only example | ProvidesSections only | No fake page or sidebar entry. |

A navigation item points only at a same-owner declared page. Chat cannot claim Web's Home entry as a shortcut. Content links to an already approved URL are not navigation ownership. PageDefinition.navigationKey is genuinely optional; supplied keys must identify a same-owner entry. A page-only reader keeps its title/breadcrumb with no selected sidebar row. A detail page may explicitly associate with its owner's parent entry.

## Definitions and conventions

| Definition | Shape |
| --- | --- |
| NavigationItem | Local key, label, optional shared icon/page key, order, optional VisibilityCheck and recursive child values. Page or children required. Parent denial prunes subtree; authorized empty page-less group disappears. Siblings sort by order then key. |
| PageDefinition | Local key, title, component, PageReader class, optional navigation key/check, declarative routes and host slots. No listener references. |
| SectionDefinition | Local key, title, component, host slot key, order, SectionReader class, optional destination/check and declared actions. No separate data endpoint. |
| SlotDefinition | Host-owned key, label, placement (pane tab or inline record section), cardinality and exact typed context. |
| RouteDefinition | Method, relative path/name, local controller/action class, owning page/section key and optional stronger check. No executable registrar. |
| SectionResult | Ready with typed owner Data, or failed with safe error metadata. Omission means not visible. Log unexpected exceptions. |

Derive prefix from the registered domain name, lowercased: chat, notes, web. Reject normalized collisions; the registry already rejects duplicate owners. No vendor-qualified UI namespace, owner contract version or independently declared source roots. Convention: each reflected owner root contains Ui/resources/js and Ui/Data. Web keeps its existing resources/js/pages compatibility path. Installed outside-app modules use the same relative paths.

Keep reader implementations/controllers in kind folders under the owner's Ui. They may use their own Contracts and own code freely. Export an interface only when a different domain needs it; do not widen exports solely for a local presentation consumer. Foreign data still needs an approved direct dependency and exports, never private models/tables. Web reaches unknown owners solely through foundation readers.

## Web registers guarded routes

Web itself registers every RouteDefinition inside web, auth, journal.user and definition-aware visibility middleware. Owner code supplies values, never arbitrary Route::group code. For non-Web owners Web applies /ui/<owner>/ paths and <owner>. names, validates relative paths, rejects traversal/reserved names/collisions, and accepts no owner prefix override. Web's existing /, /plans, /rules and authentication routes are explicit compatibility exceptions, owned and registered once.

Before private record binding or controller reads, middleware resolves the definition and its optional VisibilityCheck. Default is visible for the already authenticated permitted journal owner. Every declared mutation inherits its page/section check and may strengthen it; it cannot omit or weaken the guard. Domain actions still enforce record-level permission and invariants. A navigation-only check may hide a link further but grants no access; page checks gate every link to that page. Host composition runs a section check before its reader on all reloads; section actions use the same definition guard.

This is one optional check, not a permission framework. The actor remains the signed-in user even when a target agent/session is selected. Denial removes protected data; directly forbidden/missing URLs reveal no private labels.

## Sections stay in host Inertia props

Keep one server-built page object. Its computed page.sections holds keyed SectionResult values. Web asks each visible SectionReader for typed Data through the foundation interface; a generated owner adapter supplies that Data as props to its Vue component. Web never inspects foreign fields.

There is no custom section fetch, separate section read endpoint, browser request counter or new query protocol. Retain router.reload({ only: ['page'] }), the 250 ms gather and form-submit delay. Retry reloads the host page prop. Initial design uses synchronous assembly; do not promise unverified deferred-prop exception behavior or section-only reloads. Loading can be navigation/component-chunk loading. Deferred props are an optimization only after actual performance evidence and framework verification.

Contain and log unexpected section-read failures with a failed result; do not blanket-catch authorization or a missing host record. A failed result may retain prior ready data only when the same response has confirmed visibility for the same viewer/context. Omission, denial, viewer change or target change clears it. Whole-page network failure keeps the existing page with a stale strip; 401/403 clears protected content. Vue rendering/chunk failures get a local boundary too, never an empty-data substitute.

Keep keyed components mounted and preserve tab, filters, scroll, selection and drafts. Drafts are scoped by viewer/target; clear at sign-out. Ordinary asset-version reload can preserve unsent drafts in tab session storage and restore only after authentication, consistent with the current conversation composer.

## Slot context and a record page

Home's conversation and overview slots explicitly provide a validated selected-session value or NoSession. Resolve input ids through Core's exported SessionReader under the current actor before a section runs. A missing/ended/forbidden session is not permission to query all agents. Context compatibility is checked at declaration time; a section needing a selection shows Choose a session for NoSession.

The plan reader exposes web.plan.details, drawn below its main reader text. Its context is a plan reference authorized by Web through Plans' exported reader: public id and approved display values, never an Eloquent model. Notes may read its own authorized notes linked to that opaque reference without inspecting Plans. If it wants additional plan data it needs an approved Notes → Plans dependency and exports; the slot does not grant one. Section actions re-resolve/authorize the host target through the host's foundation context-resolver contract, never trust browser ids, and then run their own record checks. This is an explicit host contract, not an indirect foreign table query.

## Live updates without a Core UI service

Remove Core UiChanges, invalidation keys and catalog revision. Preserve the empty PageChanged broadcast on journal.user.{id}. Choose a small foundation marker, App\Domain\Contracts\ChangesPages, for owner-published after-commit facts that can affect browser data. It has no methods, record keys or additional payload. Web's ordinary Listeners/BroadcastPageChange listens to this shared marker instead of naming all optional owners' facts, then produces its existing broadcast for Access's permitted audience.

For a page-only module, exported NoteSaved implements ChangesPages and ShouldDispatchAfterCommit; no dummy section or extra page registration is required. Chat's committed message facts can do likewise. Owners never raise Web/Core events. Ordinary business listeners remain discovered exactly once from the root Listeners folder; no definitions list listener classes and no listener lives under Ui. Existing foreign-event listeners retain dependency/export requirements.

This is a deliberate small foundation event-signature extension. PublicContract and event checks must explicitly recognize the listed marker and Web's interface listener. It needs no cross-owner container binding exception. Core gains no browser service. Empty notifications reload visible host props; keyed invalidation is deferred until cost justifies it. No outbox, durable delivery, replay or exactly-once promise. Reconnect, ordinary navigation and manual Refresh reconcile state.

## Build integration

One source of truth: registered Domain entries and their optional definitions. A generated literal import map is build output, not an availability service. Keep ordinary Inertia asset versioning; remove the second manifest-hash protocol.

| Integration | Required integration |
| --- | --- |
| Vite | Literal imports for declared owner page/section paths; shared client/SSR resolver; validate existence and duplicate keys. Development access/watch only registered roots; narrow vendor ignore for developed modules. |
| TypeScript | Generated includes for every registered Ui/resources/js/**/*.ts and **/*.vue plus existing resources includes; new files must be checked by vue-tsc. |
| Inertia PHP | config/inertia.php paths/resolver recognizes the same namespaced component keys and roots. Keep testing.ensure_pages_exist enabled. Exact installed resolver API remains a worker verification item. |
| Styles | Include registered paths in resources/css/app.css source scanning, scoped module styles and shared v5 tokens. No shell-wide owner styles. |
| PHP types | Existing app-wide scan already covers built-in domain Data. Add registered external Data roots only. Owner-qualified output avoids short-name collisions; preserve hidden fields, optional omission and decimal-string ids. |
| Imports | @journal/ui for shared kit; @journal/types/notes maps to resources/js/types/generated/notes; @journal/routes/notes maps to host resources/js/routes/notes. Configure both Vite and tsconfig aliases. Relative owner imports are allowed; @/ never grants Web-private access. |
| Wayfinder | Generate after Web registers all declarations and guards. Owner route names yield owner modules; preserve existing form variants. Generic navigation uses server-resolved hrefs. |

Generate routes/types and assets for one deployed code version. Worker verification must cover external-root inclusion, resolver/existence checks, type failures, SSR and boundary rules. No framework behavior is claimed verified by this design.

## Install and removal are deploys

A domain is a line in bootstrap/domains.php plus normal package/provider setup. Install/removal are matching code/assets deployments and worker restarts, not running UI operations. Switch traffic to a complete release atomically, drain old Octane/queue workers, retain old static assets for in-flight requests/old tabs. Already-running requests may finish under the previous release. Removal is confirmed only once new code serves traffic and old workers have drained.

Fresh visits see new declarations. Existing tabs cross versions through normal Inertia asset-version reload. Removed URLs are ordinary 404s; Home omits removed declarations. No in-place disable, runtime catalog edit, former-route database, catalog-change hint, contract-major protocol or “module available” notice. Failure retains the previous working release. UI removal does not delete module records.

## Questions for the user

The main agent should present these choices. Review continues with the recommendations; they are not permission to change approved ownership.

1. **Extend browser ownership?** Recommend: Web owns shell, shared pages, mandatory browser route registration and live transport; each domain/module owns the pages/sections/readers/controllers it declares. Alternative: keep all presentation in Web, which cannot support independent unknown modules without another approved adapter arrangement. This changes docs/web/boundary.md:129 and the “only place” ownership wording in app/Domain/Web/WebServiceProvider.php. State this boundary change explicitly before implementation.
2. **Move today's existing presentation now?** Recommend keep current Home, Plans, Rules and Home chat in Web and register their existing owners first. Chat demonstrates a new owner page under the approved extension. Alternative: transfer current Plans/Rules/Chat presentation immediately, with controllers/routes, URL compatibility and one owner each. The proposed registry does not require that broader move.
3. **Make Plans on Home a summary?** Recommend no: retain the full Plans tab, with contributed sections as sibling tabs. Alternative: approve a summary plus stacked sections and accept the change in full-height reader behavior. Revised visual uses the recommendation.

No additional user-dependent choices are concealed as implementation details. API checks are evidence still needed, not a mandate to invent another data path.

## Round 1 finding dispositions

| Finding | Resolution |
| --- | --- |
| 61.1 Optional navigation | Changed: optional same-owner association; page-only preview has title/breadcrumb and no selected sidebar row. |
| 61.2 Page-only refresh | Changed: no definition listener lists. ChangesPages and ordinary Web listener cover pages and sections equally. |
| 61.3 Foundation folders | Changed: Data/Support subfolders; existing Domain/Exceptions. Core notification service removed. |
| 61.4 Removal ordering | Changed: atomic release and draining; no in-place availability mutation. |
| 61.5 Recovery previews | Added all listed recovery states, drawer and separate draft preservation. Requested browser inspection remains outstanding: no browser tool available and this helper runs no tests. Main agent must inspect before calling visual review complete. |
| 63 G1 Chat/current owners | Added explicit declaration table and Chat preview; same-owner navigation. |
| 63 G2 Owner metadata | Derive prefix/source roots from DomainEntry conventions; remove independent metadata/version. |
| 63 G3 Record slot | Added plan-record section and authorized context. |
| 63 K1 Layout test | Kind subfolders, existing exception hierarchy; no broad folder exemption or unnecessary namespace allowlist change. |
| 63 K2 Web ownership | Explicit proposed boundary and both affected files; Questions 1–2 keep recommendation pending approval. |
| 63 K3 Listeners | Root Listeners discovery only; no duplicate declaration references. |
| 63 K4 Core UiChanges | Removed; shared foundation event marker avoids Core browser service and cross-owner bindings. Targeted public-signature/event support specified. |
| 63 K5 Frontend setup | Added tsconfig, Inertia page existence, style scanning and exact generated alias paths. Built-in Data already covered by app scan. |
| 63 K6 Cycles | Removed graph-cycle mechanism; nested values and duplicate-key rejection only. |
| 63 A1 Visibility | Web attaches mandatory definition middleware before private binding/reads; section guard inside host composition. |
| 63 A2 Context | Typed no-session/session/authorized record values, resolved under current actor and rechecked on actions. |
| 63 A3 Route adapter | Removed executable registrar; Web controls path/name prefixes and guards. |
| 63 S1 Missing states | Each state now represented, including stale failure, updating, denied action, Home removal and asset mismatch. |
| 63 S2 Deep tree | Six levels, long labels, capped indentation, branch lines, constrained scroll area and full breadcrumb. |
| 63 S3 Drawer | Modal open/closed previews, focus trap/restoration, Escape and inert background. |
| 63 S4 Home summary | Full Plans tab retained; summary design is a non-recommended user option. |
| 63 S5 Shell fidelity | Restore top-bar viewer, appearance and Sign out. Keep v5 bands/breadcrumbs because message 1350 asks for v5 appearance; mark these and Live/Refresh as proposed additions rather than current v6 behavior. |
| 63 O1 Runtime modules | Deploy only; existing asset version and 404. Remove notices/catalog revisions/former routes/contract major. |
| 63 O2 Second data path | Host page Data props, existing reload, no custom section fetch or unverified deferred behavior. |
| 63 O3 Keyed invalidation | Removed; empty PageChanged and visible host-prop reload. |
| 63 O4 Permission machinery | Optional VisibilityCheck, visible default behind current owner policy; PageReader/SectionReader replace vague UiContribution. |
| 63 O5 Export restriction | Own Contracts and own code allowed; export only for foreign consumers. |
| 63 O6 Vendor prefix | Registered domain-derived prefix with collision validation. |

## Evidence and limits

- app/Domain/Contracts/ProvidesStates.php:9–22 and DomainRegistry.php:84–97: optional interfaces and foundation discovery.
- tests/Architecture/FolderLayoutTest.php:26–40; Support/FolderKind.php:16–47: kind placement. Support/BoundaryChecker.php:17–19 already recognizes foundation.
- app/Domain/DomainEntry.php:35–58,126–133: reflected roots and conventions. bootstrap/domains.php:16–28: explicit installation list.
- docs/web/boundary.md:122–131 and app/Domain/Web/WebServiceProvider.php: approved ownership, not silently superseded.
- resources/js/components/shell/AppSidebar.vue:11–16; AppTopbar.vue:23–53: current navigation and viewer/appearance/sign-out.
- resources/js/components/home/HomePanes.vue:28–36, components/plans/PlansView.vue and composables/usePageChanges.ts:51–59: full Plans pane and current page-prop reload.
- app/Domain/Web/Types/TypeScriptServiceProvider.php:21–29; tsconfig.json:36–38,121–125; config/inertia.php:39–43,59–68: integration gaps.
- docs/hooks/public-events.md:3–7,27–31 and doc 10: boundaries and after-commit limits.
- Version 5 reference folder /Users/jessegall/projects/agent-journal/docs/designs/viewer-v5: read prototype/Viewer v5.html, styles.css, palette.css, home-now.css/.jsx, app.jsx, layouts.jsx and round-fourteen.css; inspected pages/home.png, r14-home.png, r14-home-plans.png, r14-home-tasks.png and r14-documents.png.
- Light palette: /Users/jessegall/projects/agent-journal/src/viewer/src/light.css:1–51. External record-section example: that checkout's tests/stories/fixtures/acme_plan_notes/module.py:14–23.

Only docs/designs/domain-ui files are edited. No app changes, tests, builds or deployment. Reference images were viewed; revised HTML has not been browser-rendered. Layout/runtime inspection remains outstanding for the main agent before visual acceptance. The main agent republishes; this helper claims no hosted URL or pin.

## Changelog

- Settled every finding from reports 61 and 63 and separated user ownership decisions.
- Retained v5 appearance, recursive navigation and the three optional Provides interfaces.
- Replaced loose foundation files, executable route registration, separate section fetches and runtime module machinery with kind folders, guarded route values, host props and deploys.
- Added Web/Chat ownership examples, page-only navigation, plan context, every recovery preview, deeper nesting and mobile drawer.
