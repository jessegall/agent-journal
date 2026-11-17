# Journal 6 domain UI in the version 5 look

From helper 62 to the main agent. This is a design and its specification. It is not a plan, and it changes no app code. The artboards sit beside this file. Each screen is drawn dark and then light: the light copy is a clone of the dark one with the light tokens.

| File | Screen |
| --- | --- |
| `01-shell-home.html` | The full shell (sidebar, breadcrumb, agent bar, information bar, pane grid), Home with three panes and a detached window, and the dock above the composer. Also the Default preset on a first visit. |
| `02-domain-page.html` | A domain's own page in a window: the outside Notes module three levels deep, and the Plans reader with a section from Notes in a record slot |
| `03-sidebar-navigation.html` | The sidebar expanded five levels deep, collapsed, mini (52 px) with a flyout, and the phone drawer |
| `04-windows-drag-resize.html` | A tab mid-drag (ghost, drop compass, insert line), splitters (hover, snapped), a detached window's grip and its minimised bar. Also the pane menu, the add bar, presets and the split offer. |
| `05-states.html` | Loading, empty, live update, first-load error, failed refresh, removed module, connection lost, refused action, page not available, and restart during a deploy |
| `index.html` | Links to the five screens |

## Changelog

This revision is by helper 62 and replaces helper 61's revision:

- The visual now draws version 5's real shell from its components: the 220 px sidebar, the 40 px breadcrumb with top buttons, the 54 px agent bar, the 30 px information bar, and the pane grid with tabs. It adds draggable and detachable windows, splitters, presets and the dock. The previous revision used a fixed two-pane Home.
- The visual is five artboard files under `docs/designs/domain-ui-v5/`, each drawn dark and light. Every state and five levels of nesting are drawn. The previous revision was one `domain-ui/index.html`.
- The unit a domain declares is a window: one component and one Data, shown in a pane, detached, or as a page of its own.
- Sections and windows are Inertia props, deferred or optional; there is no second fetch path.
- Web registers every declared route behind its visibility check, with the domain's prefix applied.
- Install and removal are a deploy. The catalogue revision, contract version, UiChanges, listener references, vendor prefix and runtime states are removed.
- Values move to `app/Domain/Support`, with the folder test's reserved list extended.
- The Chat example and a table of who declares Home, Plans, Rules and Notes are added.
- The questions for the user are Q1 (who owns a page), Q2 (where saved layouts are kept) and Q3 (bar facts).
- Every round 1 finding is answered in section 7.

Requests worked in: message 1301 (each domain and outside module brings its own UI), message 1323 (small Provides interfaces on the Domain class), and messages 1350 and 1372 (the exact version 5 look, with draggable windows, sizes the person can arrange, and the bar). Both round 1 reviews of doc 12 are also worked in: report 61 and report 63, listed one by one at the end.

## 1. What the person sees

Version 5's viewer is a set of **windows**. A module declared each window (`src/engine/viewer/window_declaration.py:28-65`). The shell put a window in one of four places (`src/viewer/src/windows/PaneStage.vue`):

- a tab of a pane on Home;
- a detached floating window;
- a page of its own opened from the sidebar;
- a part of the bar.

Version 6 keeps all four. The thing a domain declares through `ProvidesPages` is such a window. Each window has one component and one Data, wherever it is shown.

### 1.1 Shell (artboard 01)

From left to right and top to bottom, every size comes from the version 5 source:

- **Sidebar** (`shell/SidebarPages.vue`). The sidebar is 220 px wide on `--side`, with a 1 px right border.
  - Head: padding 14×18, a 20 px accent logo with a 6 px radius, the project name (14/600) and the environment line (11, `--text-3`).
  - Group fold-heads: 11 px, weight 600, letter spacing .06em, uppercase, `--text-3`, margin-top 14. A click folds the group.
  - Rows: padding 6×8, radius 7, gap 10, a 14 px icon, `--raised` on hover and when active, and the count at the right (12 px, `--text-3`).
  - Foot: "Agent journal 6.0.0", padding 10×18, with a top border.
  - Mini form: 52 px, icons only.
- **Breadcrumb** (`shell/Breadcrumb.vue`): minimum height 40, padding 0 16, an 8 px accent swatch, then project / environment / page, with separators in `--text-4`. New: navigation ancestors are listed between the environment and the page (artboard 02).
- **Top buttons** (`windows/StageTopButtons.vue`). Left to right:
  - sidebar toggle;
  - Search, 200×28, with ⌘K;
  - bell with its count;
  - phone;
  - appearance;
  - full screen;
  - activity.

  The appearance control stays the Light/Dark/System segmented control that version 6's AppTopbar already has. Version 5 used a ColorSchemePicker there; the artboard names this as the one kept version 6 part. The version 6 sign-out moves into the bell menu's foot.
- **Agent bar** (`shell/AgentBar.vue`). Minimum height 54 and padding 0 16. It holds, in order:
  - the 8 px state dot (accent while working);
  - the state word (bold), the held task as a link, and the plan (11 px, `--text-3`);
  - bar sections (slot `shell.bar`);
  - pause, a divider, then the process and helper counts.
- **Information bar** (`shell/InformationBar.vue`): minimum height 30, 12 px `--text-3` facts 16 px apart, and the presets button at the right.
- **Pane grid** (`panes/PaneGrid.vue`). Panes are placed absolutely by fractions of the grid. A pane that is not at the left or top edge has a 1 px border on that side. Moves ease over 0.26 s, except while the person drags and during the first 1.5 s.
  - Each pane begins with the 34 px tab strip on `--side` (`kit/EditorTabs.vue`). A tab is 11.5 px with .03em spacing. The open tab is `--text` with a 1 px accent underline. A count turns accent on the open tab or when it is new. The close cross is 16 px. At the right sit + (add a window) and ⋮ (pane menu).
- **Detached windows** (`kit/FloatWindow.vue`): 1 px `--border-3`, radius 10, shadow `0 18px 48px`. The bar is 34 px and is dragged to move the window. It holds the title and icon, then minimise, menu and Dock. The resize grip is 14 px in the bottom right corner.
- **The dock** (chat docked cards). Cards sit above the composer, not above the history (version 5 review row 1). Each card has a 1 px `--border-2` border, radius 10 and `--raised` fill. The head holds an icon, a 500-weight title, a bordered Open button and a ×. The body is 12.5 px `--text-2`. The cards are sections in slot `chat.dock`, so Plans and any outside module can dock a card there.
- **Composer**: a `--raised` field with a 1 px `--border-2` border and radius 12. It has a placeholder, a paperclip, and one corner button that reads "Dump files" while the field is empty and "Send" once text is typed (version 5 review row C).

The colours are version 5's tokens. Dark comes from `src/viewer/src/tokens.css` and light from `light.css` (report 16, section 1). Version 6's `resources/css/app.css` already holds most of them, with `--accent` renamed `--brand` (doc 4, choice 2). Three tokens are defined here because version 5 left them undefined or hard-coded:

- `--warn`: `#d8a94a` dark, `#a4731a` light. It was undefined in version 5 (report 16, 0.3).
- `--progress` in light: `#2f6cc9`.
- `--float-bar`: `#111215` dark (hard-coded in FloatWindow) and `#f0f0f3` light (new).

Type is Geist 13/1.45. Icons are 16 px with a 1.4 stroke. The spacing scale is 4/8/12/16/20/24/32. The motion values are listed in report 16, section 5.

### 1.2 Home

Home is the pane grid, with no heading of its own:

- **First visit.** Home opens the **Default** preset: Chat on the left, then every window that declares a Home position, as tabs on the right in position order. The guide card (PaneTour) shows once.
- **Arranging.** The person can:
  - drag a tab within a strip, onto another strip, or onto a pane body. The drop compass offers top, left, centre (as a tab), right and bottom. Dropping outside every pane detaches the window.
  - drag a splitter (artboard 04).
  - open the add bar (+), which lists every window not yet open. A window that cannot be opened is drawn at 45 % with its reason.
  - use the pane menu: Split right, Split below, Detach, the options the window declared, Move to, Close pane, and Reset to the default layout.
  - pick or save a layout from the presets.
- **Splitters.** A splitter is a 7 px hit area with a 1 px line, `--border-3` on hover. It snaps to 50 % within 14 px of the middle, and the line turns accent. A pane is never narrower than 140 px. A double-click resets the splitter to the middle; arrow keys move it 5 %.
- **Narrow screens.** Below the grid's narrow width the panes stack, Chat first, one per screen height. On a phone, one window shows at a time over the version 5 phone bar (artboard 03 D).

### 1.3 A domain's own page (artboard 02)

Selecting a sidebar row is an ordinary Inertia visit to the page's route, for example `/notes/collections/decisions`:

- **Layout.** The breadcrumb, then the window full size, with no agent bars. This is version 5's "window as a page of its own" (`tests/look/windows/*-v5.png`, review row 28).
- **Window head.** It offers "Open on Home", which adds the window as a tab to Home's last-used pane, and "Detach", which opens it floating on Home.
- **Body.** It is the same component as in a pane. A list-and-reader page uses the version 5 kit: PageHeader 16/600 with its count, FilterBar, a 460 px list, and a Reader with a 17/600 title, 32 px inner tabs and a facts grid.
- **A page with no navigation entry** is reached from a link or a section. Its breadcrumb ends in its own title and no sidebar row is selected.

### 1.4 Sidebar navigation (artboard 03)

- **Groups.** A root item with a `group` label sits under that group's fold-head. Items of different domains that name the same group share one fold-head. Groups are ordered by their lowest item position. Home is pinned first and has no group.
- **Children.** A row may hold child rows to any depth. The link opens the page. The chevron (an 18 px button, 10 px icon) opens or closes the children without navigating.
  - Child rows are 12.5 px `--text-2`, indented 24 px per level with a 1 px `--border-2` branch line.
  - Indenting stops after level 3. Deeper levels keep that indent and the branch line turns dashed.
  - Labels end in an ellipsis. The tooltip shows the full label and its path.
- **Opening on navigation.** Visiting a page opens its ancestors. The person may close them again: a closed ancestor of the current page shows a 5 px accent dot.
- **Open state.** It is kept per tab in session storage, by item key.
- **Mini sidebar.** Children open in a flyout on hover or focus.
- **Phone.** The sidebar button opens a drawer with 44 px rows over a veil.
- **Accessibility.** Nested `ul` lists, `aria-expanded` and `aria-controls` on the chevron, and `aria-current="page"` only on the current link.

### 1.5 States (artboard 05)

Each window and section owns its state. One window's state never affects another.

| State | What shows | Behaviour |
| --- | --- | --- |
| Loading | The window's declared skeleton, in its real shape | Its deferred prop is out; the rest of the shell works |
| Empty | EmptyState: a 14/500 `--text-2` title and a 12.5 `--text-4` line | Nothing to show, and the person may see it |
| Live update | Changed rows in place; a new row is tinted for 2 s; the tab count turns accent | Scroll, selection and drafts stay; nothing remounts; nothing navigates |
| First load failed | WindowPlaceholder: the window's name, "This window failed: …" and Retry | Retry reloads only this window's prop. The error goes to the log with the window key |
| Refresh failed (new) | Rows kept and dimmed to 60 %, with a red line "Could not refresh · shown as read at 13:52" and Retry | Version 5 replaced the content; keeping it is safer and is marked as new |
| Connection lost (new band) | An UpdateBand-style strip with a `--warn` tint: "Live updates stopped. Reconnecting…" and Reload now | Reads keep working by plain requests. When the connection returns, every visible window reloads once |
| Refused action | The draft stays; the field border turns danger and the reason is written under it | Nothing is sent again by itself |
| Window removed by a deploy | The tab is struck through and the placeholder offers Remove tab | Version 5's `gone` tab |
| Page not available | A neutral EmptyState with "Go to Home" | 404 and 403 look the same; nothing tells what was there |
| Deploy restart | ServerCover over the blurred shell; Reload after a while | Inertia's asset version sends the tab through one full reload |

## 2. The Provides contract

All of the following live in the domain foundation, beside `Domain` and `ProvidesStates`. The interfaces go in `app/Domain/Contracts` (rule 17). The values go in a new kind folder, `app/Domain/Support` (`App\Domain\Support`), and enums in `app/Domain/Enums`.

`tests/Architecture/FolderLayoutTest.php:29` treats every folder under `app/Domain` as a domain root, except Contracts and Exceptions. Its reserved list must gain `Support` and `Enums`; that is a worker's one-line change. Start-up failures go in the existing `app/Domain/Exceptions`, under `DomainDeclarationError`.

```php
interface ProvidesNavigation { /** @return list<NavigationItem> */ public function navigation(): array; }
interface ProvidesPages      { /** @return list<Page> */           public function pages(): array; }
interface ProvidesSections   { /** @return list<Section> */        public function sections(): array; }

interface VisibilityCheck    { public function allows(Actor $actor): bool; }               // App\Core\Contracts\Actor
interface PageReader         { public function read(Request $request, Actor $actor): Data; } // Spatie Data
interface SectionReader      { public function read(SlotContext $context, Actor $actor): Data; }
interface CountReader        { public function count(Actor $actor): int; }                 // the number beside a sidebar row
interface ChangesWhatPeopleSee {}   // a fact implements it; Web's one listener hears it
```

| Value (`App\Domain\Support`) | Fields | Rules |
| --- | --- | --- |
| `NavigationItem` | key, label, icon, page (a page key of the same domain, or none), children (`list<NavigationItem>`, nested as values), position, group (root items only), visibility (`class-string<VisibilityCheck>` or none), count (`class-string<CountReader>` or none) | Needs a page, children, or both. Children are values, so a cycle cannot be written. Keys are unique within the domain. The page must belong to the same domain. |
| `Page` | key, title, icon, path (relative to the domain's prefix), reader (`class-string<PageReader>`), component (path under the domain's `Resources/js`), skeleton (rows, cards or reader), home position (none means not in the Default preset), float size, options (toggles and choices shown in the pane menu), slots (`list<Slot>`), actions (`list<ActionRoute>`), visibility | A page needs no navigation entry. |
| `ActionRoute` | method (POST, PATCH or DELETE), path, controller class, name | Runs behind the page's visibility check. |
| `Slot` | key, context (`SlotContext`: None, Session, Record), record name when the context is Record | A host page lists the slots it offers. |
| `Section` | key, title, slot (the full key, for example `plans.reader`), reader (`class-string<SectionReader>`), component, position, visibility | It may target the slot of any domain's page. It reads only through its own code and the exports of domains it requires (rule 9). |
| `SlotContext` (Support) | the kind plus the id the host passes (a decimal string), or nothing | A section that takes a session checks it through Core's `SessionReader`. A section that takes a record checks it through the owning domain's export. |

Each key is prefixed with the domain's name when the foundation reads it. For example, `reader` in PlansDomain becomes `plans.reader`. The registry already refuses two domains with one name (`DomainListedTwice`), so no vendor prefix is needed.

The domain name gives three more things by convention, so nothing else needs declaring (review 63, G2):

- the route prefix `/<name>`;
- the route name prefix `<name>.`;
- the Vue root `<domain folder>/Resources/js`.

**Reading the declarations.** `DomainRegistry` gains `navigation()`, `pages()` and `sections()`, which read the optional interfaces the same way `registerStatesIn` does (`app/Domain/DomainRegistry.php:84-97`). A `UiDeclarations` class in `app/Domain/Support` checks them once at start-up and keeps the result for the worker's life. It refuses:

- repeated keys;
- a navigation item that points at a missing page or at another domain's page;
- an unknown slot;
- a section whose slot context the section cannot take;
- a path or name that collides with a reserved one (`login`, `home`, `broadcasting`, `up`).

The declarations are pure values: a Domain is built with no arguments (`DomainEntry.php:48`). Readers, visibility checks and counts are resolved fresh for each request (rule 4).

**Routes (reviews 63 A1 and A3).** Web registers every declared route itself, inside its `web`, `auth` and `journal.user` group:

- each page as `GET /<domain>/<path>`, named `<domain>.<key>`, behind the middleware `journal.visible:<domain>.<key>`;
- each action the same way, under the same middleware.

The one visibility check therefore gates the sidebar row, the window, the page read, every section of that page and every action. A module cannot forget it, and cannot collide with another module's names. The reader and the controller still check each record they touch.

Every page route is served by Web's one generic `PageController`. It renders the page's component with `['page' => $reader->read($request, $actor)]`, plus that page's slots as deferred props. Today's URLs keep working: `/plans` and `/rules` are the Plans and Rules domains' prefixes, and `/` stays Web's Home.

**Data (review 63, O2).** There is one data path: Inertia props.

- **Page of its own.** The page renders with its reader's Data as the `page` prop. Each slot's sections arrive as deferred props, so they draw their skeleton until they load.
- **Windows on Home.** Each window's Data is an optional Inertia prop named by its window key, read by the same `PageReader`. The browser asks for the props of the windows it shows (active tabs and detached windows) with a partial reload. A window's filters live in Home's query, under its key, so two windows never overwrite each other's.

The worker must confirm two things against Inertia 3:

- partial reloads by these prop names;
- how a failing deferred or optional prop behaves.

I could not check either; the documentation server was not connected.

**Live updates (reviews 63 K3, K4 and O3).**

- `PageChanged` on `journal.user.{id}` stays Web's event, and AppSidebarLayout stays the one owner of the connection.
- A fact that changes what people see implements the foundation marker `ChangesWhatPeopleSee`. Web's one listener hears that interface (Laravel calls listeners of an event's interfaces), so it names no domain's fact. It replaces the eight facts listed in `BroadcastPageChange.php`.
- No `UiChanges` service is added to Core, and definitions carry no listener references. Listeners stay in each domain's `Listeners` folder.
- On a change, the shell reloads the props of what is on screen, within the 250 ms gathering and the form-safe hold already in `usePageChanges.ts`.
- One thing is unverified: whether the public contract check accepts a foundation interface on an exported fact.

**Sidebar data.** Web shares `navigation`, the visible tree with each item's resolved URL from its named route, on every response. It also shares `navigation_counts` as a deferred shared prop. Item counts come from each item's optional `CountReader`.

**Layouts.**

- The live arrangement is kept per browser and environment in local storage: pane tree, splitter ratios, tabs, detached windows with position, size and minimised state, and pane options.
- Built-in presets are declared by Web: Default, Chat only and Review.
- Saved layouts ("Save layout", Import and Share) are rows in a new Web-owned `layouts` table per user, as version 5 kept person presets on the server (`windows/layoutPresets.js:18`).
- A layout that names a window no longer installed keeps the tab as `gone` (artboard 05, state 6).

**Install and removal (review 63 O1, review 61 finding 4).** A module is a line in `bootstrap/domains.php`; adding or removing one is a deploy and a restart:

- The UI manifest, Wayfinder routes and TypeScript types are generated in the build from the same registry.
- Inertia's asset version reloads tabs that are open on the old build.
- A removed page's URL answers 404, with the neutral page.

There is no runtime install, catalogue revision or contract version.

## 3. Who declares what

Before and after the move asked about in question Q1:

| Entry | Today, while Web owns the pages | Recommended, after the move (Q1) |
| --- | --- | --- |
| Home (pinned) and slot `shell.bar` | WebDomain | WebDomain |
| Chat: navigation item, page `chat.conversation` with slot `chat.dock` (context Session), and the message action | WebDomain (it owns ChatPane, SendMessageController and the ChatData slice) | ChatDomain: ProvidesNavigation, ProvidesPages |
| Plans: navigation item with children Open, Waiting for you and Closed; page `plans.list` with slot `plans.reader` (context Record plan); section `plans.waiting` in `chat.dock` | WebDomain | PlansDomain: all three interfaces |
| Rules: navigation item, page `rules.list`, approve and deny actions | WebDomain | RulesDomain: ProvidesNavigation, ProvidesPages |
| Notes (outside, `vendor/acme/notes`, test fixture `tests/Fixtures/Modules/Notes`): navigation tree Notes › Recent, Collections › Decisions/Research › …; pages `notes.list`, `notes.collection`; sections `notes.on-plan` in `plans.reader`, `notes.draft` in `chat.dock`, `notes.drafts` in `shell.bar` | the Notes module | the Notes module |

A navigation item points only at a page of its own domain. So while Web owns the Plans page, the Plans row is Web's too. The user's own example then reads:

```php
final class ChatDomain implements Domain, ProvidesNavigation, ProvidesPages
{
    public function navigation(): array
    {
        return [NavigationItem::page('conversation', 'Chat', Icon::Chat, group: 'Work', position: 100)];
    }

    public function pages(): array
    {
        return [Page::make('conversation', 'Chat', ConversationReader::class, 'ConversationWindow.vue')
            ->onHome(position: 10)
            ->slots(Slot::make('dock', SlotContext::session()))
            ->actions(ActionRoute::post('messages', SendMessageController::class, 'send'))];
    }
}
```

An outside module looks the same. The Notes module's Domain implements all three interfaces, and its provider binds only its services.

## 4. Files and the browser build (review 63, K5)

- **Domain Vue.** A domain's Vue lives in `<domain folder>/Resources/js` (pages, sections and local parts). Its PHP readers, Data and action controllers live in its usual kind folders: `Readers`, `Data`, `Actions` or `Http`.
- **Shared kit.** The shell and the shared kit stay in `resources/js`. The kit (Btn, Segmented, FilterBar, ListReaderLayout, ListRow, Reader, InnerTabs, EmptyState, Skeleton, Badge, AgentChip, HoverTip, Icon and the window frame) is imported as `@kit/*`.
- **Imports a domain's Vue may use:** `@kit/*`, its own `@domain/<name>/*`, `@generated/types/<name>` and `@generated/routes/<name>`. A lint rule refuses any other cross-domain import.
- **Generated in the build.** An artisan command `journal:ui-manifest` runs before Wayfinder, type generation and Vite. From `DomainRegistry` it writes:
  1. `resources/js/generated/ui-manifest.ts`, with a literal lazy import for every page and section component;
  2. `tsconfig.domains.json`, the `include` entries and `@domain/<name>` paths that `tsconfig.json` extends;
  3. `resources/css/generated/domain-sources.css`, the `@source` lines that `app.css` imports;
  4. the extra Inertia page path for `config/inertia.php`, so `ensure_pages_exist` still works.
- **Types.** The TypeScript writer writes per domain under `resources/js/generated/types/<name>/`. Built-in domains are already scanned (`TypeScriptServiceProvider.php:27`); module roots are added from the registry.

## 5. Components version 6 needs

These are written anew in Vue 3 and TypeScript with Tailwind tokens. No version 5 code is copied.

| Component | From version 5 | Exists in version 6 |
| --- | --- | --- |
| AppShell (the shell's layout and its one live connection) | PaneStage, SidebarPages | AppSidebarLayout: extend |
| Sidebar, SidebarRow, SidebarTree (nested, new), MiniFlyout (new), NavDrawer (new) | shell/SidebarPages.vue, SidebarRow.vue | AppSidebar: replace its hard-coded rows |
| Breadcrumb with ancestors | shell/Breadcrumb.vue | AppTopbar: replace |
| TopButtons, AppearanceSwitch (kept from version 6) | windows/StageTopButtons.vue | AppTopbar: move into it |
| AgentBar with the `shell.bar` slot, InformationBar | shell/AgentBar.vue, InformationBar.vue | none |
| PaneGrid, Pane, PaneTabs, ResizeHandle | panes/*, kit/EditorTabs.vue | HomePanes: replace |
| DragGhost, DropCompass, SplitOffer, PaneMenu, PaneAddBar, PaneTour | panes/*, windows/* | none |
| FloatWindow, DetachedWindows | kit/FloatWindow.vue, layout/DetachedWindows.vue | none |
| LayoutPicker, PresetList | agents/LayoutPicker.vue | none |
| WindowFrame (loading, ready, empty, failed, stale, gone), WindowSkeleton, WindowPlaceholder | windows/WindowHost.vue, WindowPlaceholder.vue | none |
| PageWindow (a page of its own, with Open on Home and Detach) | windows/PageWindow.vue | Plans.vue, Rules.vue: become domain components |
| SlotSections (the host's section frame), DockCards | inspector slots, chat dock | none |
| ConnectionBand (new), ServerCover | shell/UpdateBand.vue, layout/ServerCover.vue | none |
| PhoneBar | windows/PhoneBar.vue | none |
| Kit: Btn, Segmented, FilterBar, SearchBar, FilterChip, ListReaderLayout, ListRow, PageHeader, Reader, InnerTabs, EmptyState, Skeleton, Badge, AgentChip, HoverTip, Icon, ContextMenu | src/viewer/kit, src/viewer/src/kit | Button, Icon, ListReaderLayout, PageHeader and Reader exist; the rest are new |
| Composables: useLayout (pane tree, ratios, detached windows, storage), useWindowProps (partial reloads), useNavigationOpen | windows/layoutStore.js, paneLayout.js | usePageChanges: extend to reload window props |

The agent bar and information bar need facts version 6 does not read yet: the held task, helper and process counts, model, context use and uptime. Until each has an export, the bar draws only the facts it has (question Q3).

## 6. Questions for the user

**Q1. Who owns a page: the domain, or Web?** The design goes on with option A.
- A (recommended): each domain owns its page readers, page Data, Vue and action controllers. Web owns the shell, the one generic page controller, registering every declared route, layouts and live updates. This is needed anyway for outside modules, since Web cannot require a module it does not know, and it gives one path for built-in and outside domains. It changes the approved line in `docs/web/boundary.md` (the last table: "Web: pages, controllers, requests, page and input Data, routes, live updates"). It also changes the text of `WebServiceProvider` ("the only place that does").
- B: built-in pages stay in Web, and only outside modules own theirs. This means two paths for the same thing.
- C: everything stays in Web. Outside modules then cannot bring UI.

**Q2. Where are saved layouts kept?** Recommended: on the server, in a Web table per user, as version 5 did. The live arrangement stays in the browser. The other option is the browser only, with no new table, but layouts do not follow the person.

**Q3. The bar facts version 6 has no data for.** Recommended: draw only what exists now, and add each fact with its export later. The other option is to add exports from Chat and Core sessions now, to fill the version 5 bar at once.

## 7. Round 1 findings, one by one

| Finding | What this design does |
| --- | --- |
| 61.1 A page needs a navigation key | It needs none. Without one, the breadcrumb ends in the page title and no row is selected (section 1.3). |
| 61.2 Refresh for a page with no section | No refresh metadata at all: facts mark themselves `ChangesWhatPeopleSee`, and the shell reloads what is on screen. |
| 61.3 Kind folders | Values go in `app/Domain/Support`, enums in `app/Domain/Enums`, and the folder test's reserved list gains both. |
| 61.4 Removal as a second source | Removal is a deploy and nothing else. |
| 61.5 and 63 S1 Missing states | All are drawn in artboard 05. The drawer is in artboard 03 D. |
| 63 G1 The user's Chat example, and who declares Home, Plans and Rules | Section 3, with the ChatDomain code. |
| 63 G2 Facts per owner | Derived from the domain name and folder. |
| 63 G3 A record slot | `plans.reader` with a Notes section (artboard 02). |
| 63 K1 `app/Domain/Ui` fails the layout test | Not used; see 61.3. Exceptions go in `app/Domain/Exceptions`. |
| 63 K2 Pages move out of Web | Stated plainly and asked as Q1. |
| 63 K3 Listener references | Dropped. |
| 63 K4 UiChanges in Core | Dropped; the foundation marker is used instead. |
| 63 K5 Tooling | Section 4. |
| 63 K6 Cycle check | Children are values, so there is nothing to check. |
| 63 A1 The read follows the visibility check | Web registers every route behind `journal.visible`. |
| 63 A2 Slot context | `SlotContext`, checked through SessionReader or the owner's export. |
| 63 A3 Route prefixes | Applied by Web. |
| 63 S2 Deep nesting | Five levels, capped indent and a long label (artboard 03 A). |
| 63 S3 Small screens | Version 5's phone layout plus the drawer. |
| 63 S4 Home redesigned | It is not: Home is version 5's pane grid, and Plans stays a full window with search, cards and reader. |
| 63 S5 The real shell | The version 5 shell is drawn from its components. The kept version 6 appearance switch and the new parts carry teal labels. |
| 63 O1 Install as running states | Cut. |
| 63 O2 A second data path | Cut: sections and windows are Inertia props. |
| 63 O3 Keyed invalidation | Cut. |
| 63 O4 Permission machinery | One optional visibility check, visible by default. |
| 63 O5 A stricter rule than the boundary | Dropped: a domain uses its own code freely. |
| 63 O6 Vendor namespace | The domain name is the prefix. |

## 8. Not checked

- **Rendering.** The artboards were not rendered: the browser tools are refused to a read-only helper. The light copies are made by a small script in each file. Geist is named in the font stack but not embedded, so a machine without Geist shows the system font.
- **Source agreement.** The sizes come from the version 5 source files named above. Where the source and the r14/r16 PNGs disagree, the source wins (report 16, section 0). The sidebar's fold-heads are uppercase in the code but not in `tests/look/sidebar-v5.png`; I followed the code.
- **Inertia 3.** Not confirmed: partial reloads of optional props by name, and failing deferred props.
- **Laravel and the contract check.** Not confirmed: that interface listeners fire for `ChangesWhatPeopleSee` in this app's event setup, and that the public contract check accepts that interface on exported facts.
- **Version 5 parts not read:** PresetList, ContextMenu and the phone layout beyond PhoneBar's styles.
- **Delivery.** The Claude Design connector failed to connect in this session, so there is no Claude Design URL to pin.
