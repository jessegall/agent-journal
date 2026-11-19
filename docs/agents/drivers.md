# Agent drivers

How a running agent program is driven, for a reader of the code. The design is doc 40; the live evidence is in
`docs/hooks/program-capabilities.md`.

## The parts

| Part | Where | What it does |
| --- | --- | --- |
| Driver ledger | `app/Agents/Models/DriverRequest.php`, `app/Agents/Support/DriverRequests.php` | Every operation asked of a runtime is a request with a sequence, an attempt and a progress; nothing reaches a program any other way |
| Owner commands | `app/Agents/Commands` (`DeliverAgent`, `WakeAgent`, `ChangeAgentModel`, `ChangeAgentEffort`, `InterruptAgent`, `StopAgent`) | Append a request; the recovery commands (`RetryDriverRequest`, `CancelDriverRequest`, `ResolveDriverDelivery`, `RepairDriverSettings`, `ReleaseAgentHold`, `ResumeKeyScript`, `CancelKeyScript`, `ReassignAgentRuntime`) need the owner-only ability `AgentAbility::Recover` |
| Host routes | `app/Agents/Routes/host.php` | Claim, launch grant, and reports of request progress, turns, activity, heartbeats and exit |
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

## Status words (doc 40, section 21)

Progress: accepted, staged, applying, applied, superseded, cancelled, failed, unavailable, delivery uncertain.
Holds: interrupted, compacting, human input, permission, trust, onboarding, login, update, usage limit, unknown or
unreadable screen, needs attention. A person releases only an interrupt or a call for attention.

## Adding a program build

Record its screens with `journal-agent record`, add or update its profile in `tools/journal-agent/profiles`, pin the
new build there, and run the driver and profile tests. A build that is not pinned never starts.
