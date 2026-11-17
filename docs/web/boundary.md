# Web: the browser boundary

Plan 3 builds the browser interface of doc 6. This file records the decisions its tasks take; each task adds its own section.

## Who acts in a request (task 98)

Every request has one actor, kept in `App\Core\Actors\ActorContext` for that request only (a scoped binding, so an Octane worker forgets it between requests). Asking for it without one throws `ActorContextMissing`, so a read or a route binding fails before any row is read.

| Actor | Filled by | Reads |
|---|---|---|
| Agent | `AuthenticateAgent`, after the launch credential and the signed call check out | its own rows, through the agent scope |
| Person | the Access domain's middleware, after its policy lets the person in (task 117) | every agent's rows the person may inspect, through `visibleToPerson` |

A person who selects an agent stays the actor; the agent is the target. Nothing forges an agent context for a person.

- **Person reads.** `visibleToPerson` on `OwnedByOneAgent` is the only way a person lifts the agent scope, and it refuses any actor but a person. Task, Plan and Rule have no agent scope: every agent and the owner read them (rule 4, message 519).
- **Route binding.** An agent-scoped model binds through the actor's scope: a person's route through `visibleToPerson`, an agent's through its own scope; with no actor, binding fails closed. `AuthenticateAgent` runs before `SubstituteBindings`; the person middleware will be placed there too (task 117).
- **Stack changes for a person.** `App\Core\Hooks\PersonStacks::push` puts a state on a running agent's stack for a person, in the caller's stack transaction: it locks the stack through the explicit authorized query, restores it with the target agent's own role and keeps every frame. A guessed, ended or mismatched session is refused with `StackTargetRefused`; an agent actor is refused. Agents keep `AgentStacks::push`, which only reaches their own stack.

## Access: people and the owner (task 117)

`app/Domain/Access` owns the User model (with its factory beside it), the users, password reset, sessions, passkeys and two-factor migrations, the Fortify actions and wiring (`AccessServiceProvider`), and `JournalAccess`, the one policy for who may use the journal: only the person whose id is `JOURNAL_OWNER_ID` (config/access.php). Unset means nobody; the first account or a registration grants nothing. The `journal.person` middleware (`AuthenticatePerson`) runs after session authentication and before route binding: it makes the owner the person actor and refuses everyone else with 403. Locally, `php artisan db:seed` creates owner@journal.local (password `password`); set `JOURNAL_OWNER_ID` to its id.

## Web and signing in (task 99)

`app/Domain/Web` owns the browser routes (`Routes/web.php`, loaded only by `WebServiceProvider`) and the one Inertia middleware (`Http/Middleware/HandleInertiaRequests`), which shares `SharedData`: the application name and, once signed in, `ViewerData` with the person's display name and nothing else.

One route owner for signing in: Fortify keeps `views => false`, Web owns the guest `GET /login` (named `login`, rendering `LoginPage` with `LoginInput`), and the form posts to Fortify's own `POST /login`; `POST /logout` is Fortify's too. Fortify's optional features are all off: no registration, password reset, email verification, two-factor or passkeys, so no account screen exists without a page. Two-factor can come back later with its challenge page. After signing in Fortify sends the person to `/plans` (task 111 moves this to Home).

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

## Interfaces at the seams (task 122, rule 15)

- **Actor.** `App\Core\Actors\Actor` (its kind and id) is what the core talks to. The Access `User` is a person actor, the Core `Agent` model and the signed `AgentContext` are agent actors. `ActorContext::of(Actor)` builds the request's actor; both authenticating middlewares pass the actor they vouched for and never build ids by hand.
- **Access policy.** `AuthenticatePerson` asks `JournalAccessPolicy::allows(Actor)`, bound to `JournalAccess` with `#[Bind]`. Only a person actor whose id is the owner's is let in.
- **Task progress.** Plans reads progress through `App\Domain\Tasks\TaskProgressCounter`, an interface Tasks owns and binds to `TaskCounts` with `#[Bind]`; Plans names no Tasks service class.

A wider design for a public interface layer per domain is being written separately (message 685).

## Domain ownership and dependencies

Approved by the user in question 13 (rule 9):

| Domain | Owns | Requires |
|---|---|---|
| Access | User, login through Fortify, the configured owner, the person policy and middleware | nothing |
| Web | pages, controllers, requests, page and input Data, routes, live updates | Access, Plans, Chat, Rules |

No domain requires Web. Plans keeps its approved edge to Tasks. The core (`app/Core`) needs no edge and names no domain.
