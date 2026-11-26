# Agent drivers

How a running agent program is driven, for a reader of the code. The design is doc 40; the live evidence is in
`docs/hooks/driver-capabilities.md`.

## The parts

| Part | Where | What it does |
| --- | --- | --- |
| Driver ledger | `app/Models/Drivers/DriverRequest.php`, `app/Agents/DriverRequests.php` | Every operation asked of a runtime is a request with a sequence, an attempt and a progress; nothing reaches a program any other way |
| Owner commands | `app/Agents/Commands` (`DeliverAgent`, `WakeAgent`, `ChangeAgentModel`, `ChangeAgentEffort`, `InterruptAgent`, `StopAgent`) | Append a request; the recovery commands need the owner-only `AgentMaintenancePolicy` |
| Driver setups | `app/Agents/Drivers/Setup` (`DriverSetup`, `DriverProfile`, `DriverProfiles`), `app/Providers/DriversServiceProvider.php` | One setup per driver family: its arguments, probes, sign-in, layout, key scripts, skills, hook adapter, refusals, environment and plan parts. `DriverProfile::startPlan` turns a `DriverStart` into the `HostProcessPlan` the host opens |
| Driver workers | `app/Agents/Drivers/Work` (`DriverSupervisor`, `DriverWorkers`, `HeadlessStarts`, `OwnTerminalPlans`) | The journal opens and drives every process itself: the supervisor starts a worker for each live process a process driver drives, and the worker hands its driver (`app/Agents/Drivers/Processes`) each output, request and order answer as it arrives |
| Host orders | `app/Hosts/HostOrderPlacement.php`, `routes/agents/host.php` | What the journal wants a host to do (open, write, stop a process) is an order the host claims (`POST /host/orders/claim`) and answers; the host reports a process's output and state on `/host/processes/{process}` |
| Host | `programs/agent` | A fixed relay: it opens the processes and containers the plans describe, streams their output and runs no program decision of its own |
| Hook adapter | `programs/agent/hookadapter`, `app/Agents/Drivers/Hooks/HookReplies.php` | Answers a driver's native hook call by asking the journal, and from the start's sealed reply file when the journal is away |
| Key scripts and screens | `app/Terminals/KeyScripts`, `app/Terminals/Screens`, `resources/recordings/<driver>/<build>/screens` | A terminal's menus are passed by key scripts the journal runs, one frame at a time, against the screens recorded for each build |
| Navigation and the menu library | `app/Models/Drivers/NavigationRequest.php`, `app/Models/Drivers/MenuEntry.php`, `app/Navigation` | A key script that is not certain of a menu asks the main agent; the proven way is kept as a library entry and replayed |

## How a request travels

1. An owner command appends a request; Core refuses it when the session has ended or the runtime is stopping.
2. The runtime's driver worker claims its waiting requests; stops, interrupts and recordings come first.
3. A start's first process is planned by its driver profile from the `DriverStart` (`HeadlessStarts::startOf`,
   `OwnTerminalPlans::of`): argv, environment, the files of its files folder (settings, the sealed hook replies, the
   skills it was handed) and its container, if any. The host opens it from that plan as an order.
4. The worker drives each request on the process and records every result with its attempt; a result of an older
   attempt is refused.
5. A turn's end settles its requests, or marks them uncertain when the program failed; an interrupt ends with its turn.
6. A proven stop ends the session, revokes its credential and settles every open request.

## A terminal in a container

In the contained arrangement a terminal runs as the container's own process (`programs/agent/host/container.go`,
`container_terminal.go`). The plan's container manifest names the image, the mounts and the budgets; the host creates
the container on the agent daemon under the name the journal gave it, starts it and holds its terminal. After a
restart of the host it attaches to the container that still runs under that name, so nothing starts anew. A proven
stop removes the container; the session's volumes stay.

## Watching a terminal

A terminal view lets a user watch a terminal runtime's screen in the web UI, read only. It is a lease row
(`app/Models/Drivers/TerminalView.php`), never a driver request, so it stays out of the ledger and a held runtime can
still be watched.

- `OpenTerminalView`, `RenewTerminalView` and `CloseTerminalView` need `AgentMaintenancePolicy` with `AccessType::Read`,
  decided again on every frame read. A process-driver runtime, a stopped runtime and more than 20 live views of one
  viewer are refused. Watching never types: no route takes keys or input for the program.
- The browser renews its view every 10 seconds, and a view lapses 30 seconds after its last renewal. Each engine pass
  (`app/Terminals/Commands/EndTerminalViews/EndTerminalViewsCommand.php`) ends lapsed views and views of stopped
  runtimes, and deletes views that ended a day ago.
- The host streams a terminal's screen as frames in the process's output (`programs/agent/screen/frame.go`), and
  the journal keeps the newest frame of each post as the screen (`app/Terminals/HostFrameScreens.php`); a shielded
  frame is shown hidden.
- Only the latest frame per runtime is kept, in the cache, for 60 seconds after it arrived
  (`app/Terminals/RuntimeScreen.php`); a frame is never written to the database or a log.
- The browser asks `GET /agents/{agent}/terminal/frame` (`TerminalFrameController`) every 500 ms and gets the newer frame, or 204; a new
  epoch is a restarted host. The answer says `live`, `ended` with the last frame, or `restarted` once when the agent
  moved to a new runtime or generation.

## Unknown menus

A key script selects a menu entry only by its label, never by counting key presses. When it cannot be certain of a
menu (its label is missing or shown twice, the highlight is not on it, or the screen is not the one it expects), it
sends no key and stops at that step, resumable, and the journal decides what to do. The runtime is held
`navigation_needed` meanwhile, so nothing else types into the menu.

- The journal answers with the user's current library entry for that program, menu and goal, or opens a navigation
  request and assigns it to the occupant of the main desk.
- The main agent answers in rounds, each a `Navigate` driver request of the stalled runtime: press keys, choose a
  label it has seen, confirm the highlighted label, or say it is done with a proof. A menu entry is confirmed only
  through the label, never with a raw Enter.
- The journal checks the proof on the screen and refuses a proof the screen already showed when the request was
  raised.
- The proven path is saved once as a library entry, with a proof for each step and the builds it was proven on. Later
  runs ask the journal first and replay the entry with the same runner, every check on.
- A replay that fails after its first step marks the entry stale for that build, and the next request replaces it. A
  failure at the first step only declines the entry, since two menus can share a fingerprint.
- An entry proven on another build is reused only when every check passes; the build is then added to the entry.
- A second runtime that raises the same open menu waits and asks again; once the first request is proven, it
  replays the entry itself.
- A screen that asks for a secret stops the run, and nothing of it is exported.

Limit: the main agent's own terminal keeps its hold for the user and raises no request, and helpers and workers on
a process driver have no terminal to navigate.

| State | Meaning |
| --- | --- |
| open | Raised and waiting for the main agent |
| answering | The main agent is sending rounds |
| proving | The host is looking for the proof the main agent named |
| proven | The proof showed; the path is saved as a library entry and the key script goes on |
| abandoned | The main agent gave up, saying why; the runtime keeps its hold for the user |
| interrupted | The user typed, or the screen changed with no round sent |
| cancelled | The driver request was cancelled, the runtime stopped or the session ended |
| expired | Nobody answered in time |

## Status words (doc 40, section 21)

Progress: accepted, staged, applying, applied, superseded, cancelled, failed, unavailable, delivery uncertain.
Outcomes of a key script: entry_unavailable when it stopped on a menu without the entry it needs, unconfirmed when it
ran to its end but did not prove its result on screen.
Holds: interrupted, compacting, user input, permission, trust, onboarding, login, update, usage limit, unknown or
unreadable screen, navigation_needed, needs attention. A user releases only an interrupt or a call for attention.

## Adding a program build

Record its screens with `journal-agent record` into `resources/recordings/<driver>/<build>/screens`, pin the new
build in its driver's compatibility (`app/Support/Compatibility/DriverCompatibility.php`), and run the driver and
screen tests. A build that is not pinned never starts.
