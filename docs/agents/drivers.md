# Agent drivers

How a running agent program is driven, for a reader of the code. The design is doc 40; the live evidence is in
`docs/hooks/driver-capabilities.md`.

## The parts

| Part | Where | What it does |
| --- | --- | --- |
| Driver ledger | `app/Models/Drivers/DriverRequest.php`, `app/Support/DriverRequests.php` | Every operation asked of a runtime is a request with a sequence, an attempt and a progress; nothing reaches a program any other way |
| Owner commands | `app/Agents/Commands` (`DeliverAgent`, `WakeAgent`, `ChangeAgentModel`, `ChangeAgentEffort`, `InterruptAgent`, `StopAgent`) | Append a request; the recovery commands (`RetryDriverRequest`, `CancelDriverRequest`, `ResolveDriverDelivery`, `RepairDriverSettings`, `ReleaseAgentHold`, `ResumeKeyScript`, `CancelKeyScript`, `ReassignAgentRuntime`) need the owner-only `AgentMaintenancePolicy` |
| Host routes | `routes/agents/host.php` | Claim, start grant, and reports of request progress, turns, activity, heartbeats, exit and screens |
| Host | `tools/journal-agent` | `serve` claims requests (`client/poll.go`) and hands them to the loop in `serving/loop.go` |
| Scheduler | `tools/journal-agent/host/scheduler.go` | Per runtime: control first, settings staged in front of content, a batch of deliveries or a wake as one turn, nothing while held |
| Drivers | `tools/journal-agent/drivers` | `AgentDriver` (`drivers/contracts/agent_driver.go`): Deliver, Wake, ChangeModel, ChangeEffort, Interrupt, Stop. `ProcessDriver` runs one child per turn; `TerminalDriver` types into one persistent program |
| Profiles | `tools/journal-agent/profiles` | Per program: the pinned build, its arguments, settings files, hooks and the screens it shows |
| Key scripts | `tools/journal-agent/keyscripts` | Maintenance scripts for the terminal; the host registers them per program build (`keyscripts/registry.go`, `keyscripts/scripts`) and runs no other |
| Navigation and the menu library | `app/Models/Drivers/NavigationRequest.php`, `app/Models/Drivers/MenuEntry.php`, `DriverOperation::Navigate`, the navigation and menu-entry routes in `routes/agents/host.php`, `tools/journal-agent/keyscripts/entry.go`, `path.go`, `navigation.go` | A key script that is not certain of a menu asks the journal; the main agent finds the way, and the proven way is kept as a library entry the host replays |

## How a request travels

1. An owner command appends a request; Core refuses it when the session has ended or the runtime is stopping.
2. The host's poll claims waiting requests; stops, interrupts and recordings come first, past a full batch of work.
3. The first request of a runtime takes its start grant once: the credential, the profile pin and `RuntimeStart`
   (driver type, program, build, folder, generation, model, effort). The host refuses a build its profile does not pin.
4. The loop runs each admission on the driver and reports every result with its attempt; a report of an older
   attempt is refused.
5. A turn's end reports its requests applied, or uncertain when the program failed; an interrupt ends with its turn.
6. A proven stop reports the exit, which ends the session, revokes its credential and settles every open request.

## A terminal in a container

In the contained arrangement the main agent's `TerminalDriver` types into a program that runs as the container's own
process (`tools/journal-agent/host/session_container.go`). The host creates the session's container under the name
the journal gave it (the installation and the session), with a network of the same name, starts it, and holds its
terminal through `docker --host <agent daemon socket> attach --sig-proxy=false <name>`. After a restart of the host it
finds the container that still runs under that name and attaches to it again; nothing starts anew. A proven stop
removes the container and its network; the session's volumes stay. A manifest that gives the program no terminal is
refused (`ErrSessionContainerUnattachable`).

## Watching a terminal

A terminal view lets a user watch a terminal runtime's screen in the web UI, read only. It is a lease row
(`app/Models/Drivers/TerminalView.php`), never a driver request, so it stays out of the ledger and a held runtime can
still be watched.

- `OpenTerminalView`, `RenewTerminalView` and `CloseTerminalView` need `AgentMaintenancePolicy` with `AccessType::Read`, which
  is decided again on every frame read. A process-driver runtime, a stopped runtime and more than 20 live views of
  one viewer are refused. Watching never types: no route takes keys or input for the program.
- The browser renews its view every 10 seconds, and a view lapses 30 seconds after its last renewal. Each engine pass
  (`app/Commands/Terminals/EndTerminalViews/EndTerminalViewsCommand.php`) ends lapsed views and views of stopped runtimes, and deletes views
  that ended a day ago.
- The claim answer carries `watched: [{runtime_id, interval_ms}]` and `watched_version`, a hash of that list (0 when
  nobody watches); the host sends the last version it saw, and a claim returns at once when the version differs
  (`app/Support/WatchedRuntimes.php`).
- The host's watcher (`tools/journal-agent/host/screen_watch.go`) captures each watched runtime at its interval
  (500 ms or 1 s), sends a frame only when the screen changed or 10 seconds passed, and sends nothing for a runtime
  nobody watches. A frame is the whole screen as styled runs (`tools/journal-agent/screen/frame.go`); over 256 KiB it
  is sent as plain text, and when even that is too large, as a marker.
- `POST /host/reports/screen` keeps a frame only for a watched runtime of the reporting host, at most 4 frames a
  second per runtime and 256 KiB a body; it answers `stored` or `refused` with a reason. A refused report stops the
  host's frames for that runtime until the watched list names it again. A screen the host cannot read, such as after a
  refused resize, is sent as an unreadable marker, and a runtime whose terminal the host does not hold as a no-terminal
  marker.
- Only the latest frame per runtime is kept, in the cache, for 60 seconds after it arrived
  (`app/Support/RuntimeScreen.php`); a frame is never written to the database or a log.
- The browser asks `GET /agents/{agent}/terminal?epoch=&after=` every 500 ms and gets the newer frame, or 204; a new
  epoch is a restarted host. The answer says `live`, `ended` with the last frame, or `restarted` once when the agent
  moved to a new runtime or generation.

## Unknown menus

A key script selects a menu entry only by its label, never by counting key presses. When it cannot be certain of a
menu (its label is missing or shown twice, the highlight is not on it, or the screen is not the one it expects), it
sends no key, stops at that step, resumable, and the host asks the journal what to do. The runtime is held
`navigation_needed` meanwhile, so nothing else types into the menu.

- The journal answers with the user's current library entry for that program, menu and goal, or opens a navigation
  request and assigns it to the occupant of the main desk.
- The main agent answers in rounds, each a `Navigate` driver request of the stalled runtime: press keys, choose a
  label it has seen, confirm the highlighted label, or say it is done with a proof. A menu entry is confirmed only
  through the label, never with a raw Enter.
- The host checks the proof on screen with the one lossless checker (`tools/journal-agent/screen/proof.go`) and
  refuses a proof the screen already showed when the request was raised.
- The proven path is saved once as a library entry, with a proof for each step and the builds it was proven on. Later
  runs ask the journal first and replay the entry with the same runner, every check on.
- A replay that fails after its first step marks the entry stale for that build, and the next request replaces it. A
  failure at the first step only declines the entry, since two menus can share a fingerprint.
- An entry proven on another build is reused only when every check passes; the build is then added to the entry.
- A second runtime that raises the same open menu waits and asks again; once the first request is proven, it
  replays the entry itself.
- A screen that asks for a secret never leaves the host: the run stops and nothing is exported.

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

Record its screens with `journal-agent record`, add or update its profile in `tools/journal-agent/profiles`, pin the
new build there, and run the driver and profile tests. A build that is not pinned never starts.
