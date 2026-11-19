# Agent drivers

How a running agent program is driven, for a reader of the code. The design is doc 40; the live evidence is in
`docs/hooks/program-capabilities.md`.

## The parts

| Part | Where | What it does |
| --- | --- | --- |
| Driver ledger | `app/Agents/Models/DriverRequest.php`, `app/Agents/Support/DriverRequests.php` | Every operation asked of a runtime is a request with a sequence, an attempt and a progress; nothing reaches a program any other way |
| Owner commands | `app/Agents/Commands` (`DeliverAgent`, `WakeAgent`, `ChangeAgentModel`, `ChangeAgentEffort`, `InterruptAgent`, `StopAgent`) | Append a request; the recovery commands (`RetryDriverRequest`, `CancelDriverRequest`, `ResolveDriverDelivery`, `RepairDriverSettings`, `ReleaseAgentHold`, `ResumeKeyScript`, `CancelKeyScript`, `ReassignAgentRuntime`) need the owner-only ability `AgentAbility::Recover` |
| Host routes | `app/Agents/Routes/host.php` | Claim, launch grant, and reports of request progress, turns, activity, heartbeats, exit and screens |
| Host | `tools/journal-agent` | `serve` claims requests (`client/poll.go`) and hands them to the loop in `serving/loop.go` |
| Scheduler | `tools/journal-agent/host/scheduler.go` | Per runtime: control first, settings staged in front of content, a batch of deliveries or a wake as one turn, nothing while held |
| Drivers | `tools/journal-agent/drivers` | `AgentDriver` (`drivers/contracts/agent_driver.go`): Deliver, Wake, ChangeModel, ChangeEffort, Interrupt, Stop. `ProcessDriver` runs one child per turn; `TerminalDriver` types into one persistent program |
| Profiles | `tools/journal-agent/profiles` | Per program: the pinned build, its arguments, settings files, hooks and the screens it shows |
| Key scripts | `tools/journal-agent/keyscripts` | Registered maintenance scripts for the terminal; `config/agents.php` lists what an operator may run |

## How a request travels

1. An owner command appends a request; Core refuses it when the session has ended or the runtime is stopping.
2. The host's poll claims waiting requests; stops, interrupts and recordings come first, past a full batch of work.
3. The first request of a runtime takes its launch grant once: the credential, the profile pin and `RuntimeLaunch`
   (driver type, program, build, folder, generation, model, effort). The host refuses a build its profile does not pin.
4. The loop runs each admission on the driver and reports every result with its attempt; a report of an older
   attempt is refused.
5. A turn's end reports its requests applied, or uncertain when the program failed; an interrupt ends with its turn.
6. A proven stop reports the exit, which ends the session, revokes its credential and settles every open request.

## Watching a terminal

A terminal view lets a person watch a terminal runtime's screen in the web UI, read only. It is a lease row
(`app/Agents/Models/TerminalView.php`), never a driver request, so it stays out of the ledger and a held runtime can
still be watched.

- `OpenTerminalView`, `RenewTerminalView` and `CloseTerminalView` need `AgentAbility::Inspect` on the agent, which
  is decided again on every frame read. A process-driver runtime, a stopped runtime and more than 20 live views of
  one viewer are refused. Watching never types: no route takes keys or input for the program.
- The browser renews its view every 10 seconds, and a view lapses 30 seconds after its last renewal. Each engine pass
  (`app/Engine/Commands/EndTerminalViews.php`) ends lapsed views and views of stopped runtimes, and deletes views
  that ended a day ago.
- The claim answer carries `watched: [{runtime_id, interval_ms}]` and `watched_version`, a hash of that list (0 when
  nobody watches); the host sends the last version it saw, and a claim returns at once when the version differs
  (`app/Agents/Support/WatchedRuntimes.php`).
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
  (`app/Agents/Support/RuntimeScreen.php`); a frame is never written to the database or a log.
- The browser asks `GET /agents/{agent}/terminal?epoch=&after=` every 500 ms and gets the newer frame, or 204; a new
  epoch is a restarted host. The answer says `live`, `ended` with the last frame, or `restarted` once when the agent
  moved to a new runtime or generation.

## Status words (doc 40, section 21)

Progress: accepted, staged, applying, applied, superseded, cancelled, failed, unavailable, delivery uncertain.
Holds: interrupted, compacting, human input, permission, trust, onboarding, login, update, usage limit, unknown or
unreadable screen, needs attention. A person releases only an interrupt or a call for attention.

## Adding a program build

Record its screens with `journal-agent record`, add or update its profile in `tools/journal-agent/profiles`, pin the
new build there, and run the driver and profile tests. A build that is not pinned never starts.
