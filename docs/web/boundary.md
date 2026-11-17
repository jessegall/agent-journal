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

## Domain ownership and dependencies

Approved by the user in question 13 (rule 9):

| Domain | Owns | Requires |
|---|---|---|
| Access | User, login through Fortify, the configured owner, the person policy and middleware | nothing |
| Web | pages, controllers, requests, page and input Data, routes, live updates | Access, Plans, Chat, Rules |

No domain requires Web. Plans keeps its approved edge to Tasks. The core (`app/Core`) needs no edge and names no domain.
