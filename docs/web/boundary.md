# Web: the browser boundary

Plan 3 builds the browser interface of doc 6. This file records the decisions its tasks take; each task adds its own section.

## Who acts in a request (task 98)

Every request has one actor, kept in `App\Core\Actors\ActorContext` for that request only (a scoped binding, so an Octane worker forgets it between requests). Asking for it without one throws `ActorContextMissing`, so a read or a route binding fails before any row is read.

| Actor | Filled by | Reads |
|---|---|---|
| Agent | `AuthenticateAgent`, after the launch credential and the signed call check out | its own rows, through the agent scope |
| User | the Access domain's middleware, after its policy lets the user in (task 117) | every agent's rows the user may inspect, through `visibleToUser` |

A user who selects an agent stays the actor; the agent is the target. Nothing forges an agent context for a user.

- **User reads.** `visibleToUser` on `OwnedByOneAgent` is the only way a user lifts the agent scope, and it refuses any actor but a user. Task, Plan and Rule have no agent scope: every agent and the owner read them (rule 4, message 519).
- **Route binding.** An agent-scoped model binds through the actor's scope: a user's route through `visibleToUser`, an agent's through its own scope; with no actor, binding fails closed. `AuthenticateAgent` runs before `SubstituteBindings`; the user middleware will be placed there too (task 117).
- **Stack changes for a user.** Core's `UserStack` contract (bound to `UserStacks`) puts a state on a running agent's stack for a user, in the caller's stack transaction: it locks the stack through the explicit authorized query, restores it with the target agent's own role and keeps every frame. A guessed, ended or mismatched session is refused with `StackTargetRefused`; an agent actor is refused. Agents keep `AgentStacks::push`, which only reaches their own stack.

## Access: users and the owner (task 117)

`app/Domain/Access` owns the User model (with its factory beside it), the users, password reset, sessions, passkeys and two-factor migrations, the Fortify actions and wiring (`AccessServiceProvider`), and `JournalAccess`, the one policy for who may use the journal: only the user whose id is `JOURNAL_OWNER_ID` (config/access.php). Unset means nobody; the first account or a registration grants nothing. The `journal.user` middleware (`AuthenticateUser`) runs after session authentication and before route binding: it makes the owner the user actor and refuses everyone else with 403. Locally, `php artisan db:seed` creates owner@journal.local (password `password`); set `JOURNAL_OWNER_ID` to its id.

## Web and signing in (task 99)

`app/Domain/Web` owns the browser routes (`Routes/web.php`, loaded only by `WebServiceProvider`) and the one Inertia middleware (`Http/Middleware/HandleInertiaRequests`), which shares `SharedData`: the application name and, once signed in, `ViewerData` with the user's display name and nothing else.

One route owner for signing in: Fortify keeps `views => false`, Web owns the guest `GET /login` (named `login`, rendering `LoginPage` with `LoginInput`), and the form posts to Fortify's own `POST /login`; `POST /logout` is Fortify's too. Fortify's optional features are all off: no registration, password reset, email verification, two-factor or passkeys, so no account screen exists without a page. Two-factor can come back later with its challenge page. After signing in Fortify sends the user to `/plans` (task 111 moves this to Home).

## Generated browser types (task 100)

`spatie/laravel-typescript-transformer` 3 turns the PHP Data the pages send into `resources/js/types/generated/index.ts` (`composer types:generate`, i.e. `php artisan typescript:transform`). The file is ignored by git; `composer setup` and `composer ci:check` generate it before the frontend is built or checked, and it is left out of linting and formatting.

- `App\Domain\Web\Types\TypeScriptServiceProvider` configures it: Laravel's extension, the enum transformer, a flat module writer.
- `App\Domain\Web\Types\HiddenAwareDataTransformer` is the one integration class. It generates only Data marked `#[TypeScript]`, and a property with Laravel Data's `#[Hidden]` leaves the type as well as the JSON, so a seed or an injected service never reaches the browser's types.
- `tests/Feature/Web/BrowserContractTest.php` proves it on a fixture page: computed hook, typed list, enum, optional value, hidden seed and hidden service, in both the generated type and the JSON.
- Pages use property hooks, so composer requires PHP 8.4 or later and CI runs PHP 8.5, as the image does.

## Plans: states, kinds and order (task 101)

- **States** follow doc 4's badge words: `PlanState` is Planned, Reviewing, Started, Paused, Cancelled and Done. The journal's draft, ready and approved stages all show as Planned; a plan whose review is still open shows Reviewing, so the card says why it cannot start. A new plan is Planned.
- **Kind** is doc 4's card icon: `PlanKind` is Build, Fix, Research or Cleanup. Doc 4 names the icon but not the kinds; these four are the agent's choice and can change.
- **Order.** Phases have a position in their plan. A task's place lives in the Plans-owned `phase_tasks` table (phase, task id, position), with a task in one phase at most, not in the unordered links table. It keeps task ids only.
- **Progress** comes from `App\Domain\Tasks\TaskCounts::progressOf($taskIds)`: done, started, blocked and total. Tasks never reads plans, and Plans calls Tasks through its approved edge. Version 6 tasks have no testing state yet, so there is no testing count.
- Plan has no agent limit; every agent and the owner read every plan. `php artisan db:seed` adds three plans with phases and tasks.

## Starting a plan (task 102)

`App\Domain\Plans\Actions\StartPlan::start(Plan)` serves the browser and the agent path alike, for the actor of the request; a selected agent is never the caller. Under the plan's row lock: a Planned plan starts; a Started plan is a no-op with no second event; Reviewing, Paused, Cancelled and Done refuse with `StartDenied`, whose message is safe to show. `PlanState::canStart()` is the one rule: the plans read offers the start through `PlanCard::$canStart` by it, and the action enforces it. `PlanStarted` (the plan and who started it) implements `ShouldDispatchAfterCommit`, so a rolled-back start raises nothing. Starting a plan starts no task.

## The plans page (task 104)

`GET /plans` (`plans.index`, behind `auth` and `journal.user`) renders `Plans` with one page object, `PlansPage`: a hidden `PlanFiltersData` seed and a hidden `PlansView` from the container, and one computed `plans` slot. The controller passes it as a closure, so a partial reload of other props never builds it. `PlansRequest` validates `q` (up to 200), `page` (from 1) and `plan` (a positive decimal string) and turns an empty search into the empty string in its `filters()` getter, not in a global middleware exemption. `PlansView` turns the Plans domain's `PlanList` into `PlanListData`: card ids as strings, absent phase, agent, selection and start left out of the JSON, the page the domain settled on as the accepted filter, and `selectionMissing` with no title when the selected plan cannot be read. The start is offered by `PlanCard::$canStart`, the domain's own rule. Web requires Plans (question 13).

## The start POST (task 106)

`POST /plans/{plan}/start` (`plans.start`) binds the plan after the user middleware, takes `StartPlanInput` from the request (so Laravel Data validates its nested `filters` with `PlanFiltersData`'s attributes; a bad filter stops the start), calls `StartPlan::start` once and answers 303 to `plans.index` with the validated filters only; any other return address in the request is ignored. `StartDenied` alone is rendered as a `start` form error (303 back), by a renderer `WebServiceProvider` registers; a 403, a 404 or an unexpected failure keeps its own response and its log.

## Building with generated contracts (task 108)

Generated files are build output and ignored by git: `resources/js/types/generated/index.ts` (PHP Data, from `php artisan typescript:transform`) and `resources/js/routes`, `actions`, `wayfinder` (Wayfinder). Lint and format skip them; TypeScript compiles them.

- **Build** (Docker image, `composer setup`, CI): `npm run build` runs `npm run types:generate` first, then `vp build`, in whose start the Wayfinder plugin generates the routes with form variants. The image has PHP and Node together, so the image build needs no database, user or websocket. A checkout with no generated files builds and type-checks (`npm run types:check`) from scratch.
- **Development**: the Vite container regenerates Wayfinder routes itself. After changing a page's PHP Data, run `npm run types:generate` (or `composer types:generate`); it is the one writer of the PHP types, so nothing races. Vite in the container polls for changes (`usePolling` when `LARAVEL_SAIL` is set), because a macOS-mounted folder sends no file events; without it the dev server and its SSR served stale code.
- **Stale uses** of a renamed property or route fail `vue-tsc` after regenerating.

## Sending a message (task 110)

`App\Domain\Chat\Actions\SendMessage::send($body, StackTarget)` is the user's way to message a running agent's session: in one stack transaction it creates the message (body kept byte for byte; a blank body is refused with `MessageBodyEmpty`), asks that session to answer it and pushes the answering state through `UserStacks`, so a guessed, ended or foreign target is refused and leaves no message. The agent path keeps `RequireMessageAnswer`. `MessageSent`, `MessageAnswered` and `MessageDismissed` (raised by `CloseMessage`) fire after the commit. `MessageRecords::conversationWith(StackTarget)` reads the conversation with a session for the user; its id is `"<agent>-<session>"`. States read their subject with the `forActor` scope: a user reads through `visibleToUser`, an agent keeps its own scope.

## Rule approval (task 112)

Rules use doc 4's states: Proposed, Active, Denied, Removed. Existing rules stayed Active (the state column is a string, so no migration was needed). A rule comes to exist proposed, with fixed text, through `App\Domain\Rules\Actions\ProposeRule` (used by tests and the seeder; the agent path will call it). `ReviewRule::approve` and `deny` take the rule, need a user actor, lock the row and act once on a Proposed rule; any other state is refused with `RuleNotProposed`, whose message is safe to show. `RemoveRule` ends a rule. `RuleApproved`, `RuleDenied` and `RuleRemoved` fire after the commit. `ActiveRules` still gives agents only Active rules; `RuleRecords::all()` lists every rule for a page.

## Home (task 111)

`GET /` (`home`) renders `Home` with `HomePage`: a hidden `HomeFiltersData` seed (the plans filters and the chosen `session` as a decimal string) and two computed slots, `chat` from `ChatView` and `plans` from the same `PlansView` and `PlanListData` the plans page uses. `HomeRequest` and `PlansRequest` share the plans query rules through the `ReadsPlanFilters` trait. `ChatView` lists the running sessions with their agent names and, for the chosen one, reads the conversation through Chat's `MessageRecords::conversationWith`; an unknown or ended session simply opens no conversation. Fortify's home after signing in is now `/`, and the sidebar lists Home first. Web requires Chat (question 13).

`POST /messages` (`messages.send`) takes `MessageInput` (a body with at least one non-space character and a session id), finds the session (a missing one is a `session` form error) and calls `SendMessage::send`; `StackTargetRefused` is rendered as a `session` form error (303 back). A sent message answers 303 to Home on that session. The `body` field is left out of `TrimStrings` in `bootstrap/app.php`, so a message keeps its leading and trailing spaces and newlines; every other field is still trimmed.

In the browser the plans slice is the shared `PlansView` component, given a `urlForFilters` function so its links stay on Home and keep the chosen session (`planUrls.ts` holds the shared query shape). The composer keeps a draft per viewer and conversation (`ViewerData` now carries the viewer id) in the tab's session storage, read after mounting so the server render matches; switching conversations keeps each draft apart, a reload keeps it, and a send captures its target and body when it starts and on success clears that draft only if it still holds the sent text. Enter sends, Shift+Enter adds a line. The dock has a slot above the composer and no cards yet; attaching and dumping files are shown as not available.

## The rules page (task 113)

`GET /rules` (`rules.index`) renders `Rules` with `RulesPage`: a hidden `RuleFiltersData` seed (`q`, `page`, the selected `rule`) and one computed `rules` slot from `RulesView`, which reads `RuleRecords::list(RuleFilters)` from Rules (a text search, 30 a page, newest first, and the selected rule or the fact that it does not exist). The list and the reader share the page; the selection lives in the query. `PATCH /rules/{rule}/approve` and `/deny` (`rules.approve`, `rules.deny`) take `RuleReviewInput` (the filters to return to, validated like the plans start), call Rules' `ReviewRule` and answer 303 to `rules.index` with those filters. `RuleNotProposed` is rendered as a `review` form error (303 back), so a rule settled in another tab shows why it was refused. Web requires Rules (question 13).

Decision: doc 6 asks that an approval address the reviewed revision. A rule's text never changes after it is proposed (task 112), so there is no newer text to hold apart, and the approval carries no revision: the text on screen is the text approved, and a rule already settled is refused by the domain. If rule text ever becomes editable, the revision belongs on the rule action's contract then.

## Reverb and the broadcast worker (task 114)

`laravel/reverb` and, in the browser, `@laravel/echo-vue`, `laravel-echo` and `pusher-js` are installed (`php artisan install:broadcasting --reverb`). `resources/js/app.ts` configures Echo for Reverb from the `VITE_REVERB_*` values; `routes/channels.php` is registered in `bootstrap/app.php`, and the channels themselves belong to task 115.

Docker runs two more services from the same image, code, environment and queue connection as the app: `reverb` (`php artisan reverb:start` on port 8080, with a port health check) and `queue` (`php artisan queue:work --tries=3 --backoff=5`; in development `queue:listen`, which loads changed code for every job). Development forwards Reverb to `127.0.0.1:54704` (`FORWARD_REVERB_PORT`). Start them with `docker compose -p agent-journal-6 up -d --build reverb queue`; `docker compose -p agent-journal-6 logs queue reverb` shows each job and connection. After changing Reverb settings, restart `reverb`; after changing a `VITE_` value, restart `vite` or rebuild.

Settings are split in `.env.example`:

- **Server side (secret):** `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`, and where the app and the worker publish: `REVERB_HOST=reverb`, `REVERB_PORT=8080`, `REVERB_SCHEME=http` (the container's own name, reachable only inside Docker). `REVERB_ALLOWED_ORIGINS` lists the hosts browsers may connect from (`localhost,127.0.0.1` in development); a client with another or no origin is refused.
- **Browser side (public, built into the JavaScript):** `VITE_REVERB_APP_KEY`, and the host the browser reaches: `VITE_REVERB_HOST=localhost`, `VITE_REVERB_PORT=54704`, `VITE_REVERB_SCHEME=http`. In production these name the public host with port 443 and `https`, behind the proxy that ends TLS. The built bundle was checked to hold the app key and never the secret.

The Redis queue now pushes a job only after the transaction it was queued in commits (`after_commit` in `config/queue.php`), so rolled-back work never broadcasts; the domain events already dispatch after commit. Checked end to end: a broadcast queued from the app ran in the `queue` container and reached a browser subscribed through the forwarded port. pusher-js reconnects by itself when the server comes back.

## Live page changes (task 115)

Each producer raises its own fact after commit and knows nothing of the browser: Plans' `PlanStarted` and the new `PlanProgressChanged`, which Plans raises (`RaisePlanProgressChanged`) when it hears `TaskStarted`, `TaskFinished`, `TaskBlocked` or `TaskCancelled` for a task in one of its phases; Chat's `MessageSent`, `MessageAnswered` and `MessageDismissed`; Rules' `RuleApproved`, `RuleDenied` and `RuleRemoved`. Tasks gains `TaskFinished`, `TaskBlocked` and `TaskCancelled`, raised by the new `ChangeTaskState` action; the model methods alone still raise nothing. Web needs no Tasks edge.

Web's `BroadcastPageChange` listener turns each of those facts into one `PageChanged`, a queued broadcast with no payload (`page.changed`), sent after commit on the private channel `journal.user.{id}` of each user Access allows (`JournalAccessPolicy::allowedUserIds()`, today the owner); with no owner nobody is told. A rolled-back change sends nothing. `WebServiceProvider` registers `POST /broadcasting/auth` behind `web`, `auth` and `journal.user`, and the `UserChannel` class: a user joins only the channel with their own id, and only while Access lets them in, so a guessed id or another account is refused. The installer's `routes/channels.php` is gone; channels live with Web.

## Live refresh in the browser (task 116)

The app shell (`AppSidebarLayout`) owns the tab's one connection through `useLiveConnection`: it opens `resources/js/echo.ts` in the browser only, for the signed-in viewer, on `private-journal.user.{id}`, and opens it again only when the viewer changes; signing out or leaving the shell leaves the channel and disconnects (checked: Reverb lists no channel afterwards). The channel sign-in goes through its own small `fetch` with the session's current XSRF cookie, so a sign-in after a reconnect is fresh; `@laravel/echo-vue` is not used.

`composables/usePageChanges.ts` holds the refresh: each mounted page (`Home`, `Plans`, `Rules`) registers `useLiveReload()`, which reloads only its `page` prop and is removed when the page unmounts, so navigation never refreshes an old page. A burst of changes within 250 ms becomes one reload (checked: three removals in a row gave one request). The start, review and message forms add `formSendingHooks()` to their submit: a change that arrives while one is sent is read after it finishes, so the form's own answer and its errors are never replaced. When a lost connection comes back the page reloads by GET once; nothing is ever sent again. Home's reload keeps the composer drafts (they live per conversation in session storage), and a rule's text never changes, so the Rules reader needs no revision marker.

## Interfaces at the seams (task 122, rule 15)

- **Actor.** `App\Core\Contracts\Actor` (its kind and id) is what the core talks to. The Access `User` is a user actor, the Core `Agent` model and the signed `AgentContext` are agent actors. `ActorContext::of(Actor)` builds the request's actor; both authenticating middlewares pass the actor they vouched for and never build ids by hand.
- **Access policy.** `AuthenticateUser` asks `JournalAccessPolicy::allows(Actor)`, bound to `JournalAccess` with `#[Bind]`. Only a user actor whose id is the owner's is let in.
- **Task progress.** Plans reads progress through `App\Domain\Tasks\Contracts\TaskProgressCounter`, an interface Tasks exports and binds to `TaskCounts` with `#[Bind]`; Plans names no Tasks service class.

Plan 5 built the public interface layer of doc 10 revision 2: each domain reaches another only through what it exports (contracts, values, facts), and the checks are listed in `docs/hooks/dependencies.md`.

## Domain ownership and dependencies

Approved by the user in question 13 (rule 9), and narrowed by plan 7:

| Domain | Owns | Requires |
|---|---|---|
| Access | User, login through Fortify, the configured owner, the user policy and middleware | nothing |
| Web | the shell, Home (its layouts and the windows the domains offer it), declared route registration, page props, navigation, the UI manifest and type generation, live updates | Access |

No domain requires Web. Chat, Plans and Rules own their pages, actions, Data and components themselves (see "Domain-owned pages" below and `docs/web/domain-pages.md`). The core (`app/Core`) needs no edge and names no domain. Each owner alone reads and writes its own tables.

## Domain-owned pages (plan 7)

Plan 7 replaced the Web-owned pages described in the sections above (tasks 104, 106, 110, 111, 113): those routes, controllers, requests and page objects are gone. What holds now:

- **Pages and routes.** Each domain declares its pages, actions, navigation and sections (`ProvidesPages`, `ProvidesNavigation`, `ProvidesSections`); Web registers every declared route in its `web`, `auth` and `journal.user` group, under the domain's prefix, named `<domain>.<key>`, behind `journal.visible:<key>`, and serves every page with one `PageController`. Home is Web's own page (`/`, `home`). Today's routes: `chat.conversation` (`/chat`), `chat.send` (`POST /chat/messages`), `plans.list` (`/plans`), `plans.plan` (`/plans/{plan}`), `plans.start` (`POST /plans/{plan}/start`), `rules.list` (`/rules`), `rules.approve` and `rules.deny` (`PATCH /rules/{rule}/approve|deny`).
- **Props.** A page of its own gets `page`, each section of its slots as a deferred `section_<slot>_<section>` prop, and `inspector` when `?inspect=<page key>` names a record page; Home gets one optional `window_<key>` prop per window. Each is a result (`ready` with the reader's Data, `failed` with a neutral message, `denied` with nothing) and runs its visibility checks before any reader, on full and partial requests alike.
- **Queries.** A window's links change only its own part of Home's query, `window[<page key>][...]` (`useWindowQuery`); on its own page the query is plain. The chosen agent session is the top-level `session`, read by sections that take a session.
- **Generated files.** `php artisan journal:ui-manifest` (first step of `npm run types:generate`) writes the component manifest, `tsconfig.domains.json`, `vite.domains.ts`, the Tailwind sources, the page prop types and checks, `domain-roots.json` and `bootstrap/cache/ui-components.php`; Wayfinder writes `resources/js/routes/<domain>`; `typescript:transform` writes each owner's types to `resources/js/generated/types/<owner>`.
- **Live updates.** Every fact that changes what users see implements `App\Domain\Contracts\ChangesWhatUsersSee`; Web's one listener turns it into `PageChanged`. The browser reloads only the props on screen, the navigation and its counts, and the inspector when open.
- **Imports.** `npm run imports:check` (part of build, check and the type check) refuses a domain component that imports another domain's code, the shell or a path it cannot prove local.
