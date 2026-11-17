# Journal 6 domain UI in the version 5 look

From helper 62 to the main agent. This is a design and its specification. It is not a plan, and it changes no app code. The artboards sit beside this file. Each screen is drawn dark and then light; the light copy is a clone of the dark one with the light tokens.

| File | Screen |
| --- | --- |
| `01-shell-home.html` | The full shell (sidebar, breadcrumb, agent bar, information bar, pane grid), Home with three panes, a detached window and version 5's dock stack above the composer. Also the Default preset on a first visit, with no session. |
| `02-domain-page.html` | A domain's own page in a window: the outside Notes module three levels deep with the sidebar row menu, and the Plans cards with a plan open in the inspector and a Notes section in the slot `plans.inspector` |
| `03-sidebar-navigation.html` | The sidebar expanded five levels deep and scrolling, collapsed, mini (52 px), and version 5's phone layout |
| `04-windows-drag-resize.html` | A tab mid-drag, splitters, live resize of a detached window and its minimised bar, the pane menu, the add bar, presets with a refused name, the split offer, and the narrow width (stacked panes, compact tabs, tab menu, empty pane) |
| `05-states.html` | Eight window states, section and count states, connection lost, a refused action, page not available, and the restart during a deploy |
| `index.html` | Links to the five screens |

## Changelog

**Revision by helper 62, round 2** (reports 66 and 67, worked in one by one in section 8):

- **The look against the version 5 source.**
  - The dock is now version 5's single bordered stack (`src/chat/DockStack.vue`, `src/kit/ChatDock.vue`). Each card is a full-width strip, the waiting card has a 2 px amber line, and the fold button shows at the top.
  - The appearance control is version 5's icon button with a menu.
  - The top bar shows only buttons with something behind them in version 6: sidebar, colour scheme, full screen, and version 6's viewer and sign out.
  - The environment line and crumb are gone, because version 6 has no environment.
  - The pane menu, presets, thumbnails, button and icon sizes, the float window, the agent bar order, the information bar icons, the phone bar, mini sidebar spacing, sidebar scrolling and the inner tab gap all follow their files.
  - Token names are version 5's (`--tone-warn`, `--line`, `--bubble`).
  - Labels that called new parts version 5 are corrected.
- **The contract.**
  - A navigation item can carry route and query values.
  - A per-request children reader supplies record children.
  - Page readers take their own validated request class.
  - Each window or section prop carries its own ready, failed or denied result, so one failure cannot break the others.
  - Visibility is checked whenever a window, section or count prop is resolved, not only on the page's own route.
  - Prop names and the refresh set are concrete.
  - A section names the context it takes.
  - The values move to `app/Domain/Declarations`.
- **New drawings.**
  - Plans opens a plan in version 5's inspector, so Home and the page use one component.
  - The narrow stacked layout, compact tabs, the tab menu and the empty pane.
  - Access lost, file failed to load, section loading and failed, counts not in yet, page not available as a page, and the deploy cover's Reload.
- **Removed.** Search, bell, phone and activity buttons; the mini flyout; the phone drawer and its top bar; the size outline and size labels.
- **Decisions D1 to D3 stand** (section 6). Section 3 now shows the owners after D1 only.

**Revision by helper 62, round 1.** This revision replaced helper 61's design:

- The version 5 shell, with draggable and detachable windows.
- Five artboard files.
- Windows as the unit a domain declares.
- One data path through Inertia props.
- Routes registered by Web.
- Install and removal as a deploy.

## 1. What the person sees

Version 5's viewer is a set of **windows**. A module declared each window (`src/engine/viewer/window_declaration.py:28-65`). The shell put a window in one of four places (`src/viewer/src/windows/PaneStage.vue`):

- a tab of a pane on Home;
- a detached floating window;
- a page of its own opened from the sidebar;
- a part of the bar.

Version 6 keeps all four. The thing a domain declares through `ProvidesPages` is such a window. Each window has one component and one Data, wherever it is shown. A record opens in version 5's inspector panel.

### 1.1 Shell (artboard 01)

All sizes come from the version 5 source files named here:

- **Sidebar** (`shell/SidebarPages.vue`, `SidebarRow.vue`). The sidebar is 220 px wide on `--side`, with a 1 px right border.
  - Head: padding 14×18, a 20 px accent logo with a 6 px radius, and the project name (14/600). Version 5's second line held the environment; version 6 has no environment, so it is left out.
  - Fold-heads: 11 px, weight 600, letter spacing .06em, uppercase, `--text-3`, margin-top 14. A click folds the group, and a folded head shows nothing more.
  - Rows: padding 6×8, radius 7, gap 10. The icon is 13 px (14 for Home). Hovered and active rows are `--raised`, and the count sits at the right (12 px, `--text-3`).
  - The list scrolls with a hidden scrollbar.
  - Foot: "Agent journal 6.0.0", padding 10×18, with a top border. Version 5 drew a Settings row above it. A navigation item that sets `atFoot` is drawn there; version 6 has no such page yet.
  - Mini form: 52 px. Fold-heads are hidden and only root rows show, 2 px apart.
- **Breadcrumb** (`shell/Breadcrumb.vue`): minimum height 40, padding 0 16, an 8 px accent swatch, then project / page, with separators in `--text-4`. New: the navigation ancestors sit between the project and the page.
- **Top buttons** (`windows/StageTopButtons.vue`). Version 6 draws only the buttons it can act on:
  - Sidebar toggle.
  - Colour scheme: version 5's `ColorSchemePicker`, an icon button that opens a menu labelled "Color scheme" with Follow the system, Light and Dark (`windows/colorScheme.js`).
  - Full screen.
  - Version 6's viewer name and Sign out (`resources/js/components/shell/AppTopbar.vue`), which stay because version 6 has a login and version 5 has no part for it. The artboards mark them in violet.

  Search, the bell, the phone and Activity are not drawn until their feature exists. Each comes back with its own page as a top button, in version 5's order.
- **Agent bar** (`shell/AgentBar.vue`). Minimum height 54, padding 0 16, in version 5's order:
  - the 8 px state dot and the state word;
  - the held task and plan;
  - pause and its divider;
  - the bar windows (slot `web.bar`);
  - the process and helper counts.

  Under D3 it draws only what version 6 can read today: the state of the chosen session, in version 5's words. That is Working for Active, Ended for Ended, and "Status: suspected lost" or "Status: lost" for the others. With no session the bar shows version 5's placeholder: "Agent 1" and "No session yet" in `--text-4`. The chosen session is the one picked in the Chat window; on other pages it is the last one picked, kept in session storage.
- **Information bar** (`shell/InformationBar.vue`): minimum height 30, with 12 px `--text-3` facts 16 px apart. Every fact has its 12 px icon, and the presets button sits at the right. Under D3 the only fact is the lead, the agent's name with the agents icon.
- **Pane grid** (`panes/PaneGrid.vue`). Panes are placed absolutely by fractions of the grid. A pane that is not at the left or top edge has a 1 px border on that side. Moves ease over 0.26 s, except while the person drags and during the first 1.5 s.
- **Tab strip** (`kit/EditorTabs.vue`). Each pane begins with a 34 px strip on `--side`.
  - A tab is 11.5 px with .03em spacing. The open tab is `--text` with a 1 px accent underline.
  - A count turns accent on the open tab or when it is new. The close cross is 16 px.
  - At the right sit + (add a window) and ⋮ (pane menu).
  - In a tight strip the inactive tabs show only their icon. A middle click or Delete closes a tab.
  - A right click opens Close, Close others, Close to the right and Close all, then Split right, Split below and Detach.
- **Detached windows** (`kit/FloatWindow.vue`): 1 px `--border-3`, radius 10, shadow `0 18px 48px rgba(0,0,0,.5)`. The bar is 34 px and is dragged to move the window. It holds a 13 px title icon and three 16 px buttons: minimise, menu and Dock. The resize grip is 14 px in the bottom right corner, and the window resizes live.
- **The dock** (`src/chat/DockStack.vue`, `src/kit/ChatDock.vue`, `src/chat/DockWrapper.vue`). Above the composer sits one box: 1 px `--border`, radius 10, `--raised`.
  - Inside it each card is a full-width strip, divided from the one above by a 1 px `--border` top line (none on the first).
  - The head is at least 28 px high, with margin-top 5, padding 0 14 and gap 8. It holds the 14 px icon in `--text-3`, the title (13/500, line height 20), the age (64 px wide, 11.5 px `--text-3`) and the close control.
  - The foot is at least 24 px high, with padding 0 14 0 36 and margin-bottom 7. Its facts (12 px `--text-3`) sit at the left and its buttons at the right. Open is the one bordered ghost button.
  - A card that waits for the person has a 2 px `--tone-warn` line along its top.
  - With more than one card, a 28 px row at the top holds the fold-all button.
  - Cards come from sections in the slot `chat.dock`.
- **Composer**: `--raised`, 1 px `--border-2`, radius 12. The corner button reads "Dump files" while the field is empty and "Send" once text is typed. The message list is drawn from `tests/look/home-v5.png`; its version 5 source lives in the chat module and was not compared, so treat it as reference.

**Tokens.** The colours are version 5's tokens with version 5's names: dark from `src/viewer/src/tokens.css`, light from `light.css`. That includes `--line` (#22252b / #e8e9ec), `--bubble` (#1a1b1f / #f3f3f6) and `--tone-warn`, `--tone-good` and `--tone-sequence`. A waiting or blocked badge takes a `--tone-warn` border (`kit/badgeLook.css`). `--progress` stays #5b8def in light too, because `light.css` does not override it.

Version 6's `resources/css/app.css` calls the accent family `--brand` (doc 4, choice 2). Where it already holds a token under another name, the worker maps the name; no colour changes.

**Deviations from version 5.** Exactly one remains, kept on purpose. Version 5 hard-codes the float bar to #111215 with no light value, which draws dark text on a dark bar in light mode. Version 6 adds `--float-bar` (#111215 dark, #f0f0f3 light). The float shadow and the split offer's veil keep version 5's fixed values in both appearances.

**Type and icons.** Type is Geist 13/1.45; the artboards load Geist and Geist Mono from Google Fonts. Icons use version 5's `kit/Icon.vue` shapes: 16 px with a 1.4 stroke, 12 px inside a button (`kit/Btn.vue`) and 13 px as a window mark. The pause icon is drawn at stroke 2.4.

### 1.2 Home

Home is the pane grid, with no heading of its own:

- **First visit.** Home opens the **Default** preset: Chat on the left, then every window that declares a Home position, as tabs on the right in position order. The guide card (PaneTour) shows once.
- **Arranging** (artboard 04). The person can:
  - drag a tab within a strip, onto another strip, or onto a pane body. The drop compass offers top, left, centre (as a tab), right and bottom. Dropping outside every pane detaches the window.
  - drag a splitter. It is a 7 px hit area with a 1 px line, `--border-3` on hover. It snaps to 50 % within 14 px of the middle, and the line turns accent. A pane is never narrower than 140 px. A double-click resets the splitter to the middle; arrow keys move it 5 %.
  - open the add bar (+). It lists every window the person may see that is not open yet. A window that cannot open here, for example one that needs a session, is drawn at 45 % with its reason.
  - use the pane menu (`windows/PaneMenu.vue`): Split right, Split below, Detach, Limit width, the window's declared options, then Move and "Move to …", then Close and Reset layout. Items are 12 px in `--text-2` with padding 6 8. A choice option opens an inner list, and a toggle shows a ✓.
  - pick a layout from the presets (`agents/LayoutPicker.vue`, `kit/PresetList.vue`).
- **Presets.** The picker is a MenuPanel: padding 6, gap 2, radius 9, shadow `0 14px 36px rgba(0,0,0,.45)`, width 240 to 300.
  - Rows have a 46×32 thumbnail. The chat cell is accent at 55 % and the others are `--border-2`.
  - The current row is `--sel` and its thumbnail border is `--text-4`; the gap is 11.
  - A saved row shows its tools on hover: save the current layout to it, download it as a file, rename and delete. "Save layout" names the layout inline. Import reads a layout file.
  - The picker's notice line reports refusals: an empty name, a name already taken, a file that is not a layout, or a failed save.
- **Narrow screens.** Below the grid's narrow width the panes stack, Chat first, each one screen high, with scroll snapping.
- **Phone.** Version 5's phone layout: one window at a time over the phone bar. The bar lists the layout's windows with their counts and scrolls sideways, with a `--line` top border.
- **Detached windows after a resize.** A detached window left outside the screen after the browser window shrinks is pulled back until at least 48 px of its bar shows. This is new; version 5 was not checked.
- **First draw.** The grid waits for the stored layout before it draws, as version 5 does.

### 1.3 A domain's own page (artboard 02)

Selecting a sidebar row is an ordinary Inertia visit to the page's route, for example `/notes/collections/decisions`:

- **Layout.** The breadcrumb, then the window full size, with no agent bars and no extra gutter. This is version 5's "window as a page of its own" (`windows/PageWindow.vue`).
- **No head of the shell's.** The shell adds nothing to the window's own head; the window's component draws its own PageHeader and actions.
- **Row menu.** A right click on a sidebar row opens version 5's row menu: Open, Open in a new tab, Copy link and Place on Home (`SidebarPages.vue`, pagePlace).
- **Records.** A record opens in version 5's inspector: 640 px, fixed to the right edge, with `--border-2` and the shadow `-20px 0 50px` (`resource/InspectorPanel.vue`, `InspectorHead.vue`). The inspector is the record page's window, opened over the current page. Its URL is the record page's route, which also opens it as a page of its own.
- **Same component everywhere.** Plans is the same component on Home and on its page: version 5's plan cards, opening the plan in the inspector.
- **A page with no navigation entry** is reached from a link, a card or a section. Its breadcrumb ends in its own title and no sidebar row is selected.

### 1.4 Sidebar navigation (artboard 03)

- **Groups.** A root item with a `group` label sits under that group's fold-head. Items of different domains that name the same group share one fold-head. Groups are ordered by their lowest item position. Home is pinned first and has no group.
- **Children.** A row may hold child rows to any depth. The link opens the page; the chevron (an 18 px button with a 10 px arrow, turned 90° when open) opens or closes the children without navigating.
  - Child rows are 12.5 px `--text-2`, indented 24 px per level with a 1 px `--border-2` branch line.
  - Indenting stops after level 3. Deeper levels keep that indent and the line turns dashed.
  - Labels end in an ellipsis; the tooltip shows the full label and its path.
- **Opening on navigation.** Visiting a page opens its ancestors. The person may close them again: a closed ancestor of the current page shows a 5 px accent dot.
- **Open state.** It is kept per tab in session storage, by item key.
- **Mini sidebar.** Root rows only. A parent opens its page, or its first child's page when it has no page. Its label is the tooltip.
- **Phone.** Nested navigation does not appear on the phone in this first version. The phone keeps version 5's layout, and its bar lists the layout's windows.
- **Accessibility.** Nested `ul` lists, `aria-expanded` and `aria-controls` on the chevron, and `aria-current="page"` only on the current link.

### 1.5 States (artboard 05)

Each window, section and count owns its state; one never affects another (section 2, Data).

| State | What shows | Behaviour |
| --- | --- | --- |
| Loading | The window's declared skeleton, in its real shape | Its prop is out; the rest of the shell works |
| Refreshing | Nothing changes on screen | The rows stay until new ones arrive, as in version 5 |
| Empty | EmptyState: a 14/500 `--text-2` title and a 12.5 `--text-4` line | Nothing to show, and the person may see it |
| Live update | Changed rows in place; a new row is tinted for 2 s; the tab count turns accent | Scroll, selection and drafts stay; nothing remounts or navigates |
| First load failed | WindowPlaceholder: the window's name, "This window failed: …" and Retry | Retry reloads only this window's prop. The failure is logged with the window key |
| Refresh failed (new) | Rows kept and dimmed to 60 %, with a red line "Could not refresh · read at 13:52" and Retry | Only for a failure. A refusal is the next row |
| Access lost | The rows are removed; "This window is not available to you", and Remove tab | A denied result clears the window's data, never keeping it as stale |
| File failed to load | "This window's file could not be loaded: …" and Retry | On a new build, version 5's PageWindow reloads the tab once instead |
| Window removed by a deploy | The tab is struck through; the placeholder offers Remove tab | Version 5's `gone` tab |
| Section loading or failed | The host's frame stays, with skeleton rows, or with one line and Retry | Its own prop and result |
| Section empty or denied | No frame and no space | The host closes up around it |
| Dock card or bar part empty, denied or failed | Absent | A failure is logged |
| Sidebar counts not in, or failed | No number beside the row | A deferred shared prop; a failure is logged |
| Connection lost (new strip) | A strip in UpdateBand's form: "Live updates stopped. Reconnecting…" and Reload now | Reads keep working through plain requests. When the connection returns, every visible window reloads once |
| Refused action | The draft stays; the field border turns danger and the reason sits under it | Nothing is sent again by itself |
| Page not available | A page of its own: the breadcrumb and a neutral EmptyState with "Go to Home" | 404 and 403 look the same |
| Deploy restart | ServerCover over the blurred shell, while the connection is down and the health check (`/up`) fails; Reload after 20 s | The next Inertia request on the new build reloads the tab once; composer drafts live in session storage |
| Layout save refused | The picker's notice line | Section 1.2 |

## 2. The Provides contract

**Where the files go.**

- Interfaces go in `app/Domain/Contracts` (rule 17).
- Values go in a new folder named for what they are, `app/Domain/Declarations` (`App\Domain\Declarations`). Enums go in `app/Domain/Enums`.
- `UiDeclarations` sits beside `DomainRegistry` at the foundation root. It checks the declarations at start-up and composes them.
- Start-up failures go in `app/Domain/Exceptions`, under `DomainDeclarationError`.

**Two architecture tests change** (a worker's change):

- `tests/Architecture/FolderLayoutTest.php:29`: the reserved list (Contracts, Exceptions, Providers) gains `Declarations` and `Enums`.
- `tests/Architecture/DomainDeclarationTest.php`: `SHARED_PLACE_FILES` lists every new foundation file: the interfaces, the values, the enums, `UiDeclarations.php` and the new exceptions.

```php
interface ProvidesNavigation   { /** @return list<NavigationItem> */ public function navigation(): array; }
interface ProvidesPages        { /** @return list<Page> */           public function pages(): array; }
interface ProvidesSections     { /** @return list<Section> */        public function sections(): array; }

interface VisibilityCheck      { public function allows(Actor $actor): bool; }   // App\Core\Actors\Contracts\Actor
interface PageReader           { public function read(): Data; }                 // built per request: its own request class and the actor come through its constructor
interface SectionReader        { public function read(SlotContext $context): Data; }
interface CountReader          { public function count(): int; }
interface NavigationChildren   { /** @return list<NavigationItem> */ public function children(): array; } // records as items, per request
interface ChangesWhatPeopleSee {}                                                // a fact implements it; Web's one listener hears it
```

A reader is resolved from the container for each request, so its constructor receives what it needs:

- its own validated request class, with typed getters, as `HomeRequest` and `PlansRequest` do today;
- the current actor (`CurrentActor`);
- the domain's own services and the exports of domains it requires.

None is bound globally to the shared interface. Web resolves the class the declaration names.

| Value (`App\Domain\Declarations`) | Fields | Rules |
| --- | --- | --- |
| `NavigationItem` | key, label, icon, page (a page key of the same domain, or none), route values (`array<string,string>`), query values (`array<string,string>`), children (`list<NavigationItem>`, nested as values), children reader (`class-string<NavigationChildren>`, or none), position, group (root items only), at foot (root items only), visibility (`class-string<VisibilityCheck>`, or none), count (`class-string<CountReader>`, or none) | Needs a page, children, a children reader, or a mix of them. Children are values, so a cycle cannot be written. Keys are unique within the domain. The page must belong to the same domain. Route values must fill the page's route parameters exactly. |
| `Page` | key, title, icon, path (relative to the domain's prefix, with `{name}` parameters), reader (`class-string<PageReader>`), component (path under the domain's `Resources/js`), opens in (page or inspector), skeleton (rows, cards or reader), home position (none means it is not in the Default preset), float size, options (toggles and choices for the pane menu), slots (`list<Slot>`), actions (`list<ActionRoute>`), visibility | A page needs no navigation entry. |
| `ActionRoute` | method (POST, PATCH or DELETE), path, controller class, name | Runs behind its owner's visibility check. |
| `Slot` | key, takes (`SlotContextType`), and, for a record, the route parameter of the host page that names it | A host page lists the slots it offers. |
| `Section` | key, title, slot (the full key), takes (`SlotContextType`), reader (`class-string<SectionReader>`), component, position, actions (`list<ActionRoute>`), visibility | It may target the slot of any domain's page. It reads only through its own code and the exports of domains it requires (rule 9). A section with no page can still have its own actions. |
| `SlotContext` | its type, and for Session or Record the id (a decimal string) | Built by Web for each request (below). |
| `SlotContextType` (`app/Domain/Enums`) | Nothing, Session, Record | |
| `Icon` (`app/Domain/Enums`) | version 5's icon names | A closed set: a module picks from the host's icons, as version 5's `WindowIcon` did. |

**Keys and names come from the domain's name.** Every key is prefixed with the domain's name when the foundation reads it: `inspector` in PlansDomain becomes `plans.inspector`, and Web's bar slot is `web.bar`. The registry already refuses two domains with one name (`DomainListedTwice`). The domain name also gives:

- the route prefix `/<name>`;
- the route name prefix `<name>.`;
- the Vue root `<domain folder>/Resources/js`.

`UiDeclarations` reads the three interfaces the way `registerStatesIn` reads `ProvidesStates` (`app/Domain/DomainRegistry.php:84-97`). At start-up it refuses:

- repeated keys or route names;
- duplicate or unnormalised paths within an owner;
- a navigation item that points at a missing page or another domain's page;
- route values that do not fit the page;
- an unknown slot;
- a section whose `takes` differs from its slot's;
- a domain prefix that an already registered route or a folder in `public` uses (for example `login`, `logout`, `hooks`, `broadcasting`, `up`, `build` and `storage`). Checking these against what exists, rather than a written list, keeps the check correct as routes are added.

**Routes.** Web registers every declared route itself, inside its `web`, `auth` and `journal.user` group, with the owner's prefixes applied:

- each page as `GET /<domain>/<path>`, named `<domain>.<key>`, behind the middleware `journal.visible:<domain>.<key>`;
- each action the same way.

Web's one generic `PageController` serves every page route.

What changes for today's routes:

- `/plans` and `/rules` keep their paths, but their names become `plans.list` and `rules.list`.
- Sending a message moves from `POST /messages` (`messages.send`) to `POST /chat/messages` (`chat.send`).
- Starting a plan becomes `plans.start`, and approving or denying a rule becomes `rules.approve` and `rules.deny`.
- The Wayfinder imports and the tests that use the old names change with them.
- `/` stays Web's Home.

**Visibility (review 67 A1, review 66 finding 1).** The middleware gates a page's own route. Web also runs the checks every time it resolves a prop, on every full or partial request, before it calls an owner's reader:

- a window prop on Home: the page's check;
- a section prop: the host page's check, and then the section's own;
- a count: the item's check, and its page's check;
- an inspector prop: the record page's check.

A refused check gives a `denied` result and calls no reader. A refused check never keeps old rows. Web drops refused windows from the add bar and refused rows from the navigation; their counts are never computed.

Session and record ids in a slot context are checked again by the section's reader, through Core's `SessionReader` or the owning domain's export. The actor is always the signed-in user, resolved within the current request.

Acceptance tests for this:

- a forged partial request for a hidden window prop;
- a hidden section on a visible host;
- two different users in a row on one Octane worker.

**Data and prop names (review 67 C2 and C4, review 66 findings 2 and 3).** There is one data path: Inertia props. Every window, section and inspector prop is a result value, `WindowResult<T>`:

- `{state: 'ready', data: T}`;
- `{state: 'failed', message}`, where the message names no internal detail and the exception is logged with the key;
- `{state: 'denied'}`.

Web builds each result inside its own try, so one reader's exception cannot fail the response for the others. Expected framework responses still behave as they do: a redirect to login when the session expired, or a 419. The TypeScript type is generated from the PHP Data, so a component gets its exact `T`.

Prop names are flat, so no dotted key is unpacked into nested objects:

| Response | Props |
| --- | --- |
| A page of its own | `page` (the result for its own reader); `section_<slotdomain>_<slot>_<sectiondomain>_<section>` per section of its slots (deferred, each in its own deferred group); `inspector` when a record is open |
| Home | the shared props, then `window_<domain>_<key>` for each window, as an optional prop (sent only when asked for) |
| A record in the inspector | `inspector` (optional), read from `?inspect=<domain>.<key>&<parameter>=<id>` |
| Shared on every response | `navigation` (the visible tree, each item with its URL from its named route); `navigationCounts` (deferred) |

**What the browser asks for.**

- **On a first visit to Home.** The browser reads the stored layout first, then asks for `only: [window props of the active tabs and detached windows]`. This means Home makes a second request on every visit, and its windows are never rendered on the server. That is the cost of keeping the layout in the browser.
- **On a live change, 250 ms after the burst ends** (`usePageChanges.ts`, with its form-safe hold), it reloads:
  - `only: [visible window props, 'navigation', 'navigationCounts']`;
  - plus `page` and the visible section props on a page of its own;
  - plus `inspector` when it is open.
- **Retry** reloads only that one prop.

A window's filters live in Home's query under its key. Before it resolves that reader, Web builds the reader's request class from the window's own part of the query and the same user. On its own page the filters are the plain query.

**Slot context (review 67 C5).** Web builds the `SlotContext` for each section:

- **Nothing**: nothing to build.
- **Session**: the session chosen in Chat (section 1.1).
- **Record**: the value of the host page's route parameter named by the slot, for example `plan` on `/plans/{plan}` shown in the inspector.

With no session chosen, or no record open, the section is not resolved and shows nothing.

**Live updates.**

- `PageChanged` on `journal.user.{id}` stays Web's event. AppSidebarLayout stays the one owner of the connection.
- A fact that changes what people see implements `ChangesWhatPeopleSee`. Web's one listener hears that interface, as Laravel's dispatcher calls listeners of an event's interfaces. This replaces the eight facts listed in `BroadcastPageChange.php`.
- Core never imports the marker.
- The public contract check judges member types and parent classes only (`tests/Architecture/Support/PublicContracts.php:141-166`), so a marker on an exported fact passes. Review 67 read the check but did not run it.

**Layouts (D2).**

- The live arrangement is kept per browser in local storage: the pane tree, splitter ratios, tabs, detached windows with position, size and minimised state, and pane options.
- Built-in presets are declared by Web: Default, Chat only and Review.
- Saved layouts are rows of a new Web `Layout` model with these rules:
  - it lists its fillable attributes (rule 6: name, shape and user);
  - it uses the Linkable trait (rule 3);
  - it is limited to its user by a global scope (rule 4);
  - its name is unique per user.
- The first version has Save, Update, Rename, Delete, Download as file and Import from file. There are no share links: nothing yet decides who may open one, and with one owner today Download covers sharing.
- A layout that names a window no longer installed keeps the tab as `gone`.

**Install and removal.** A module is a line in `bootstrap/domains.php`; adding or removing one is a deploy and a restart. The UI manifest, Wayfinder routes and TypeScript types are generated in the build from the same registry. A removed page's URL answers 404 with the neutral page.

## 3. Who declares what (after D1)

| Domain | Declares |
| --- | --- |
| WebDomain | Home (pinned first) and the slot `web.bar`. ProvidesPages for Home only: the shell, layouts and the generic page controller are its own code, not declarations. |
| ChatDomain (the user's example) | A navigation item "Chat" in group Work. The page `chat.conversation` (home position 10, with the slot `chat.dock` that takes a Session). The action `chat.send`. |
| PlansDomain | A navigation item "Plans" with children Open, Waiting for you and Closed: one page `plans.list` with the query values `state=open`, `state=waiting` and `state=closed`. The record page `plans.plan` (`/plans/{plan}`, opens in the inspector, slot `plans.inspector` that takes a Record, parameter `plan`). The action `plans.start`. The section `plans.waiting` in `chat.dock`. |
| RulesDomain | A navigation item "Rules" in group Agents, the page `rules.list`, and the actions `rules.approve` and `rules.deny` |
| Notes (outside, `vendor/acme/notes`, test fixture `tests/Fixtures/Modules/Notes`) | A navigation tree: Notes › Recent, then Collections with a children reader that lists collections and their years and months as items of the page `notes.collection` with route values. The pages `notes.list` and `notes.collection`. The sections `notes.on-plan` in `plans.inspector`, `notes.draft` in `chat.dock` and `notes.drafts` in `web.bar`. |

**Approval Notes needs.** To check the plan it is shown, `notes.on-plan` uses Plans' export, so the Notes domain must require Plans. Under rule 9 that edge needs the user's approval. The fixture requires nothing today, so the example stands only once that is approved; without it, Notes would offer the section only for Nothing or Session slots.

```php
final class ChatDomain implements Domain, ProvidesNavigation, ProvidesPages
{
    public function navigation(): array
    {
        return [NavigationItem::page('conversation', 'Chat', Icon::Chat, group: 'Work', position: 100)];
    }

    public function pages(): array
    {
        return [Page::make('conversation', 'Chat', ChatWindowReader::class, 'ChatWindow.vue')
            ->onHome(position: 10)
            ->slots(Slot::make('dock', SlotContextType::Session))
            ->actions(ActionRoute::post('messages', SendMessageController::class, 'send'))];
    }
}
```

`ChatWindowReader` is named so that it does not clash with the `ConversationReader` interface Chat already exports.

Plans' three filter rows:

```php
NavigationItem::page('list', 'Plans', Icon::Plan, group: 'Work', position: 200)
    ->count(OpenPlansCount::class)
    ->children([
        NavigationItem::page('open', 'Open', page: 'list', query: ['state' => 'open']),
        NavigationItem::page('waiting', 'Waiting for you', page: 'list', query: ['state' => 'waiting'])->count(WaitingPlansCount::class),
        NavigationItem::page('closed', 'Closed', page: 'list', query: ['state' => 'closed']),
    ]);
```

**Which row is current.** An item is current when the request's route name and route values match it and its query values are part of the request's query. The most specific item wins.

## 4. Files and the browser build

- **Domain Vue.** A domain's Vue lives in `<domain folder>/Resources/js`. Its PHP readers, Data and action controllers live in its usual type folders.
- **Shared kit.** The shell and the shared kit stay in `resources/js`.
- **Imports.** A domain's Vue may import only:
  - `@kit/*`;
  - its own `@domain/<name>/*`;
  - `@generated/types/<name>`;
  - `@generated/routes/<name>`.

  A lint rule refuses any other cross-domain import.
- **The build command.** `php artisan journal:ui-manifest` runs before Wayfinder, type generation and Vite. From `DomainRegistry` it writes, and the existing files are wired to read:
  1. `resources/js/generated/ui-manifest.ts`: a literal lazy import per component under a unique name `<domain>/<path>`, so `plans/Index` and `notes/Index` never collide. `resources/js/app.ts` and the SSR entry resolve Inertia pages through this map instead of the automatic glob. The server's component check (`config/inertia.php`, `ensure_pages_exist`) reads the same map.
  2. `tsconfig.domains.json`: the whole `include` list and `paths` table, today's entries included. `tsconfig.json` extends it and drops its own `include` and `paths`, so nothing is shadowed.
  3. `vite.domains.ts`: the aliases `@kit`, `@domain/<name>`, `@generated/types` and `@generated/routes`. The last points at Wayfinder's normal output, `resources/js/routes/<name>`, since route names begin with the domain. It also lists module roots under `vendor` that the watcher may follow; the rest of `vendor` stays ignored. `vite.config.ts` spreads it in.
  4. `resources/css/generated/domain-sources.css`: the `@source` lines, imported by `app.css`.
- **Types.** The TypeScript writer writes per domain under `resources/js/generated/types/<name>/`, keeping hidden fields hidden. Wayfinder keeps its form variants.
- **Proof.** Two owners with a file of the same name, one of them outside `app`, must build, type-check and render.

## 5. Components version 6 needs

These are written anew in Vue 3 and TypeScript with Tailwind tokens. No version 5 code is copied.

| Component | From version 5 | In version 6 today |
| --- | --- | --- |
| AppShell (the shell's layout and its one live connection) | PaneStage, SidebarPages | AppSidebarLayout: extend |
| Sidebar, SidebarRow, SidebarTree (nested, new), RowMenu | shell/SidebarPages.vue, SidebarRow.vue | AppSidebar: replace its hard-coded rows |
| Breadcrumb with ancestors | shell/Breadcrumb.vue | AppTopbar: replace |
| TopButtons, ColorSchemePicker; viewer and sign out kept from version 6 | windows/StageTopButtons.vue, shell/ColorSchemePicker.vue | AppTopbar: move into it |
| AgentBar with the `web.bar` slot, InformationBar | shell/AgentBar.vue, InformationBar.vue | none |
| PaneGrid, Pane, EditorTabs (compact, tab menu), ResizeHandle | panes/*, kit/EditorTabs.vue | HomePanes: replace |
| DragGhost, DropCompass, SplitOffer, PaneMenu, PaneMenuInner, PaneAddBar, PaneTour | panes/*, windows/* | none |
| FloatWindow, DetachedWindows | kit/FloatWindow.vue, layout/DetachedWindows.vue | none |
| LayoutPicker, PresetList, LayoutThumb, InlineName | agents/LayoutPicker.vue, kit/PresetList.vue, LayoutThumb.vue | none |
| MenuPanel, MenuItem, MenuLabel, ContextMenu | kit/* | none |
| WindowFrame (loading, ready, empty, failed, stale, denied, gone, file failed), WindowSkeleton, WindowPlaceholder | windows/WindowHost.vue, WindowPlaceholder.vue, PageWindow.vue | none |
| PageWindow (a page of its own) | windows/PageWindow.vue | Plans.vue, Rules.vue: become domain components |
| InspectorPanel, InspectorHead, InspectorActions | resource/InspectorPanel.vue, InspectorHead.vue, kit/InspectorActions.vue | none |
| SlotSections (the host's section frame, new), DockStack and DockCard | chat/DockStack.vue, kit/ChatDock.vue, chat/DockWrapper.vue | none |
| ConnectionBand (new, in UpdateBand's form), ServerCover | shell/UpdateBand.vue, layout/ServerCover.vue | none |
| PhoneBar | windows/PhoneBar.vue | none |
| Kit: Btn, Segmented, FilterBar, SearchBar, FilterChip, ListReaderLayout, ListRow, PageHeader, Reader, InnerTabs, EmptyState, Skeleton, Badge, AgentChip, HoverTip, Icon | src/viewer/kit, src/viewer/src/kit | Button, Icon, ListReaderLayout, PageHeader and Reader exist; the rest are new |
| Composables: useLayout (pane tree, ratios, detached windows, storage, keeping windows on screen), useWindowProps (partial reloads per result), useNavigationOpen, useChosenSession | windows/layoutStore.js, paneLayout.js | usePageChanges: extend |

**Checks for the worker.** These require the app running in a browser, which this helper could not do:

- move, detach and dock a window;
- resize panes and a detached window;
- the keyboard tab operations;
- save and restore a layout;
- a light and dark comparison against version 5 running.

## 6. Decisions

Decided by the main agent with the recommended options, on the user's standing instruction to decide open choices rather than ask (messages 299, 700 and 1387).

**D1. Who owns a page: each domain.**
- Each domain owns its page readers, page Data, Vue and action controllers.
- Web owns the shell, the one generic page controller, registering every declared route, layouts and live updates.
- Outside modules need this anyway, since Web cannot require a module it does not know, and it gives one path for built-in and outside domains.
- This changes the approved line in `docs/web/boundary.md` (the last table: "Web: pages, controllers, requests, page and input Data, routes, live updates"). It also changes the text of `WebServiceProvider` ("the only place that does"). Both are updated when this is built.
- Once the pages move, Web names no page of Chat, Plans or Rules. Its `requires()` list then shrinks to Access, plus Chat only if the bar's chosen session reads through Chat's export.
- Rejected:
  - built-in pages staying in Web while only outside modules own theirs (two paths for one thing);
  - everything staying in Web (outside modules could bring no UI).

**D2. Saved layouts: on the server.** Saved layouts are kept in a Web table per user, as version 5 did; the live arrangement stays in the browser. The model's rules are in section 2, under Layouts. Rejected: the browser only, because layouts would not follow the user.

**D3. Bar facts: only what exists now.** The bar draws only facts version 6 can already read: the session state and the agent's name (section 1.1). Each further fact is added with its export later. Rejected: adding exports from Chat and Core sessions now just to fill the version 5 bar.

## 7. Open points decided in this round

- **Environment.** Left out of the sidebar head and the breadcrumb, because version 6 has none. Layouts are kept per browser.
- **Top buttons.** Only buttons with a feature behind them are drawn. Version 6's viewer and sign out stay, because version 6 has a login.
- **Appearance.** Version 5's ColorSchemePicker is used, replacing version 6's segmented control.
- **The page head.** The shell draws none. Opening a page on Home is in the row menu, as in version 5.
- **Plans.** Cards on Home and on its page, with the plan in version 5's inspector. The section slot is `plans.inspector`.
- **Mini sidebar.** No flyout; children are reached from the parent's page.
- **Phone.** Version 5's layout only; nested navigation on the phone is left for later. The drawer and its top bar are removed.
- **Float bar in light.** The one recorded deviation from version 5 (section 1.1).
- **Section empty or denied.** No frame. A section that is loading or failed keeps its frame.
- **Share links.** Left out; Download as file is used instead.
- **Off-screen detached windows.** Pulled back on screen (new).
- **Connection lost.** A strip in UpdateBand's form. ServerCover shows only while the health check fails.

## 8. Findings, one by one

### Round 2, report 67 (Christopher Alexander)

| Finding | What this revision does |
| --- | --- |
| L1 dock | Redrawn from DockStack and ChatDock (section 1.1, artboard 01) |
| L2 environment | Removed |
| L3 agent bar order and pause stroke | Version 5's order; pause at 2.4 |
| L4 agent bar words | Version 5's words and placeholder |
| L5 information bar | Icons on every fact; D3 leaves one fact |
| L6 `--line` | Added; used by the phone bar and the gauge |
| L7 token names, badge border | Version 5's names; the badge border is `--tone-warn` |
| L8 appearance control | ColorSchemePicker |
| L9 sidebar | 13 px icons; no fold count; mini spacing 2 px; `atFoot` for the Settings place |
| L10 float window | 16 px buttons, 13 px title icon; live resize; no outline or size labels |
| L11 pane menu | Version 5's items, words, sizes, inner list and ✓ |
| L12 presets | MenuPanel, 46×32 thumbnails, `--sel` current row, gap 11, 12 px icon |
| L13 button icons | 12 px |
| L14 phone | Version 5's layout; the top bar and More are removed |
| L15 page of its own | No gutter; the shell draws no head; the row menu instead |
| L16 one window, two bodies | Plans is cards everywhere, with the inspector |
| L17 stacked panes, empty pane | Drawn (artboard 04, last board) |
| L18 top buttons without a feature | Not drawn until they exist |
| L19 chat body | Marked as reference, not compared |
| L20 inner tabs | Gap 7, spacing .01em |
| C1 navigation as drawn | Route and query values, a children reader, and the example code |
| C2 raw request | Reader per request with its own request class; Web hands it the window's part of the query |
| C3 route names | Listed; reserved prefixes checked against existing routes and `public` |
| C4 one failure fails all | `WindowResult` per prop; the cost of the second request is stated |
| C5 slot context | `takes` on Section; Web builds the context; nothing selected means nothing shown |
| C6 approval and name clash | The Plans edge is named for rule 9; `ChatWindowReader` |
| C7 Support folder | `app/Domain/Declarations`; `UiDeclarations` at the root; Icon is a closed enum |
| C8 small points | `navigationCounts`; the "today" column and Q labels removed |
| A1 Home and host-page reads | Checked at prop resolution (section 2, Visibility) |
| A2 add bar and counts | Refused windows and counts are absent |
| A3 shared layouts | No share links in the first version |
| States 1 to 7 | All drawn (artboards 04 and 05) |
| Over-built 1 and 2 | Share links, flyout and phone drawer removed |
| D1 and D2 notes | Web's `requires()` shrinks; the Layout model's rules are stated |

### Round 2, report 66 (Tony Hoare)

| Finding | What this revision does |
| --- | --- |
| 1 Composition authority | Checks run before each reader when a window, section, count or inspector prop resolves. Denied results clear data. The acceptance tests are listed. |
| 2 One failing prop | A `WindowResult` per prop; failures are logged; a single prop is retried; file failures are a separate state |
| 3 Prop shape and refresh set | Flat names; Home, page, inspector and shared responses; the refresh lists include navigation and counts |
| 4 Destinations and slot context | Route and query values, a children reader, Section `takes`, how Web builds the context, `web.bar` naming, and Section actions |
| 5 Build wiring | Whole include lists, Vite aliases, the client and SSR resolver, the server check, Wayfinder aliases, the vendor watch list, unique component names, and the two-owner proof |
| 6 Visual differences | Appearance, dock, presets, phone, sidebar scrolling, button icons and `.lead` (now `.doc-lead`) are fixed. The light clone needs no appearance change now that the picker is an icon. Geist is loaded. The float bar in light is the one recorded deviation; the veil and shadow are kept. |
| 7 Behaviour and presets | Live resize; the preset tools, inline name and notice; compact tabs, middle click and Delete, and the tab menu; the browser checks for the worker are listed |
| 8 States and D3 | Refreshing, access lost, file failed, section removal (absent), deploy detection on the next Inertia request with drafts kept, the bar under D3 and the no-session state |
| 9 Spec in step with the decisions | The decisions are in section 6; the reserved list keeps Providers; `SHARED_PLACE_FILES` is named; readers are resolved per contribution |

### Round 1 (reports 61 and 63)

Settled in the previous revision and confirmed in round 2: 61.1, 61.2, 61.4, 63 G1, G2, K2 (by D1), K3, K4, K6, A3, O1, O3, O4, O5 and O6. The partly settled ones are finished above: 61.3 and K1 (C7), G3 (C5), A1 and A2 (A1), 61.5 and S1 (states), S2 (C1), S3 (L14 and L17), S5 (L1 to L20), K5 (66.5) and O2 (66.2 and 66.3). S4 no longer applies.

## 9. Not checked

- **Rendering.** The artboards were not rendered: browser tools are refused to a read-only helper, so spacing and the light copies are unseen. The fonts load from Google Fonts, so the artboards need a network connection to show Geist.
- **Inertia 3.** Not confirmed: that a flat optional prop requested with `only` arrives without disturbing the other window props, and that each deferred section prop in its own group loads independently.
- **Version 5 parts not read:** ContextMenu (the rule between menu groups is assumed), the chat module's bubbles and composer, PresetList's share flow, and where version 5 keeps a detached window when the browser window shrinks.
- **The public contract check** was read by review 67 but not run.
- **Delivery.** The Claude Design connector failed in this session, so there is no Claude Design URL to pin.
