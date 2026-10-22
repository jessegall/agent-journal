from journal.features.feature import Feature
from journal.features.workers.clock_conduct import ClockConduct
from journal.features.workers.listeners.shortfall_return import ShortfallReturn
from journal.features.workers.listeners.task_touch import TaskTouch
from journal.features.workers.listeners.worker_task_changes import WorkerTaskChanges
from journal.features.workers.commands.arrival_command import ArrivalCommand
from journal.features.workers.commands.todo_command import TodoCommand
from journal.features.workers.commands.proof_command import ProofCommand
from journal.features.workers.commands.departure_command import DepartureCommand
from journal.features.workers.workers_conduct import WorkersConduct
from journal.features.workers.support.workers_data_reader import WorkersDataReader
from journal.features.workers.support.workers_data import WorkersData
from journal.features.workers.seeds.subagents_seed import SubagentsSeed
from journal.features.workers.seeds.workers_seed import WorkersSeed
from journal.features.workers.jobs.worker_watch import WorkerWatch
from journal.engine.nudge import Nudge
from journal.support.option import AGENT, Option
from journal.support.option_scope import OptionScope
from journal.support.skill import Skill
from journal.features.workers.commands.subagent_command import SubagentCommand
from journal.features.workers.commands.worker_command import WorkerCommand
from journal.features.workers.listeners.subagent_cards import SubagentCards
from journal.features.workers.listeners.subagent_record import SubagentRecord
from journal.features.workers.listeners.subagent_message_record import SubagentMessageRecord
from journal.features.workers.listeners.subagent_turn_record import SubagentTurnRecord
from journal.features.workers.listeners.worker_brief_record import WorkerBriefRecord
from journal.features.workers.listeners.worker_note_record import WorkerNoteRecord
from journal.features.workers.listeners.worker_turn_record import WorkerTurnRecord
from journal.features.workers.listeners.worker_cards import WorkerCards
from journal.engine.support.modes import Modes
from journal.features.plans.states.plans_ready import PlansReady
from journal.features.workers.listeners.worker_moment_cards import WorkerMomentCards
from journal.features.workers.listeners.dispatch_refusal_cards import DispatchRefusalCards
from journal.features.workers.listeners.silent_worker_record import SilentWorkerRecord
from journal.features.workers.states.delegating import Delegating
from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.states.orchestrating_plan import OrchestratingPlan
from journal.features.workers.states.soloing import Soloing


class Workers(Feature[WorkersData]):
    """A worker is an agent sent to write: code in a worktree of its own, a document, a change. A subagent only reads; a worker is the one that writes."""
    TIMEOUT = Option("workers.timeout_minutes", "Time limit of a worker run", "Minutes a worker may run before it is stopped and its report says so; 0 sets no limit", 60, unit="min")
    MODE = Option("workers.mode", "Work mode", "Builder: the agent builds it itself and sends workers when a job is better done beside it. Orchestrator: it plans, hands the work to workers, then reviews and merges it. Solo: it does everything itself, with no workers", "builder", kind="choice", choices=("builder", "orchestrator", "solo"), scope=OptionScope.PERSON)
    WORKER_LIMIT = Option("workers.most_out", "Workers out at once", "The most workers out at a time; a dispatch past it is refused until one reports. 0 is no limit", 3, unit="workers")
    SUBAGENT_LIMIT = Option("workers.most_subagents", "Subagents running at once", "The most subagents running at a time; one more is held until one finishes. 0 is no limit", 5, unit="subagents")
    PROFILE_LIMIT = Option("workers.idle_kept", "Workers kept for reuse per profile", "The most workers of one profile kept out or idle for reuse; past it a dispatch of that profile is refused while one of them is idle, so the job goes to that one. Reviewers always start fresh. 0 is no limit", 8, unit="workers")
    WORKTREE_STEP = Option("workers.worktree_step", "Make worker worktrees the journal's way", "The journal makes a worker's worktree, a worktree of each inner repository it needs and its library folders; off, your own commands below make them, told where in JOURNAL_WORKTREE and on which branch in JOURNAL_BRANCH", True, kind="switch", setter=AGENT, scope=OptionScope.MACHINE)
    PREPARATION_COMMANDS = Option("workers.preparation_commands", "Commands before a worker's worktree is made", "Your own shell commands, one per line, run in the project folder just before a worker's worktree is made; each is told JOURNAL_WORKTREE, JOURNAL_BRANCH, JOURNAL_PROJECT, JOURNAL_REPOSITORIES, JOURNAL_LIBRARIES and JOURNAL_COPIES", [], kind="lines", setter=AGENT, scope=OptionScope.MACHINE)
    COMPLETION_COMMANDS = Option("workers.completion_commands", "Commands after a worker's worktree is made", "Your own shell commands, one per line, run inside a worker's worktree once it is made, such as installing its dependencies; told the same as the commands before", [], kind="lines", setter=AGENT, scope=OptionScope.MACHINE)

    name = "workers"
    title = "Workers"
    help = "Agents sent to write one bounded job; the agent waits for their reports."
    modes = Modes(MODE, {"builder": PlansReady, "orchestrator": Orchestrating, "solo": Soloing})
    options = (TIMEOUT, MODE, WORKER_LIMIT, SUBAGENT_LIMIT, PROFILE_LIMIT, WORKTREE_STEP, PREPARATION_COMMANDS, COMPLETION_COMMANDS)
    states = (Orchestrating, Soloing, OrchestratingPlan, Delegating)
    commands = (WorkerCommand, SubagentCommand, ArrivalCommand, TodoCommand, ProofCommand, DepartureCommand)
    seeds = (WorkersSeed, SubagentsSeed)
    jobs = (WorkerWatch,)
    listeners = (SubagentRecord, SubagentCards, WorkerCards, WorkerMomentCards, DispatchRefusalCards, SilentWorkerRecord, WorkerTaskChanges, ShortfallReturn, TaskTouch, WorkerBriefRecord, WorkerNoteRecord, WorkerTurnRecord, SubagentTurnRecord, SubagentMessageRecord)
    data = (WorkersDataReader,)
    conduct = (WorkersConduct,)
    worker_conduct = (ClockConduct,)

    READINESS = Nudge(name, "clock_in_first", "your writes wait until you clock in", "clock in with journal clock-in once you have read your task, journal task show <n>", repeat_interval=0)
    OUTPUT_UNFINISHED = Nudge(name, "own_output_running", "output {{n}}, a command of yours, is still running, and your run ends when you stop", "wait for it with sleep 30, then stop again: its end is told to you when it comes", repeat_interval=0)
    OUTPUT_END = Nudge(name, "own_output_ended", "output {{n}} ended with code {{status}}", "read it with journal output read {{n}} --summary", repeat_interval=0)
    USER_CLOSURE = Nudge(name, "task_closed_by_user", "the user closed your task {{task}}: your work on it ends here", "stop now; the agent that sent you takes it from here", repeat_interval=0)
    BRIEF_CHANGED = Nudge(name, "brief_changed", "the user rewrote point {{points}} of your task {{task}}'s brief", "read it again with journal task show {{task}} and prove those points again", repeat_interval=0)
    OPEN_TODOS = Nudge(name, "open_todos", "your to-do list has {{count}} open items: {{items}}", "finish them, or say why with journal clock-out", repeat_interval=0)
    WORK_READY = Nudge(name, "work_ready", "worker {{n}}, {{name}}, clocked out: task {{task}} is ready to check", "read its proofs with journal task show {{task}}, then journal worker check {{n}} <point>, or with --short \"<what is missing>\" to send it back", repeat_interval=0)
    CHECK_REMINDER = Nudge(name, "check_reminder", "worker {{n}}, {{name}}, is clocked out and task {{task}} still waits to be checked", "read its proofs with journal task show {{task}}, then journal worker check {{n}} <point>, or with --short \"<what is missing>\" to send it back", repeat_interval=180)
    RUN_UNFINISHED = Nudge(name, "run_unfinished", "worker {{n}}, {{name}}, ended its run without clocking out, and still holds its task", "send it again with journal worker send {{n}} \"<job>\", or let the task go with journal worker release {{n}}", repeat_interval=0)
    WORKER_ARRIVAL = Nudge(name, "worker_clocked_in", "worker {{n}}, {{name}}, clocked in and is at work on its task", repeat_interval=0)
    WORKER_REPORTED = Nudge(name, "worker_reported", "worker {{n}}, {{name}}, reported in the chat", repeat_interval=0)
    ORCHESTRATE = Nudge(name, "orchestrate", "{{count}} tasks are open across the plans: {{tasks}}", "check the plans and dispatch a worker on each task you can, journal worker dispatch \"<Name>\" --task <n>; keep the reviews for yourself. decide and go on without waiting for the user; stop for them only before a step that cannot be undone or reaches outside the project. a task that waits on something blocks that task alone: block it with journal task block and go on with every other open task", repeat_interval=0)
    TASK_DELEGATION = Nudge(name, "delegate_the_task", "{{name}} is in hand and you orchestrate; {{logged}}", "hand it to a worker, journal worker dispatch \"<Name>\" --task <n> with this task's number, and review its report; log what the worker is on", repeat_interval=0)
    BLOCKED_CHECK = Nudge(name, "check_blocked_tasks", "{{count}} tasks are parked or blocked: tasks {{tasks}}", "read each with journal task show <n>: resume a parked one you can go on with first, and check a blocked one is still truly blocked: unblock one whose wait has passed or that you can decide yourself, and go on with it. you are the orchestrator: decide, and report what you decided; leave blocked only what the user alone can do", repeat_interval=300)
    CREW_REMINDER = Nudge(name, "dispatch_while_busy", "{{count}} tasks are open and no worker has them: {{tasks}}", "keeping the work going is your first job, before your own piece: dispatch workers on them with journal worker dispatch, or send each to the worker that knows its files", repeat_interval=120)
    PLACE_FREE = Nudge(name, "worker_place_free", "worker {{n}}, {{name}}, is done, so a worker place is free; open: {{tasks}}", "fill it now: send {{name}} its next job with journal worker send {{n}} if it knows the ground, or dispatch another worker", repeat_interval=0)
    ORCHESTRATOR_MODE = Nudge(name, "now_orchestrating", "you now work as the orchestrator", "plan, hand every task you can to a worker with journal worker dispatch, and review and merge what comes back, running the full suite yourself once it is back, since a worker seldom should; a task in hand is one to hand over, never to do yourself. you make the decisions and keep the work moving without waiting for the user, who is asked only before a step that cannot be undone or reaches outside the project. a task that waits blocks only itself: block it and keep every other open task moving", repeat_interval=0)
    SOLO_MODE = Nudge(name, "now_solo", "you now work solo", "do every job yourself: no worker is dispatched", repeat_interval=0)
    SOLO_DISPATCH = Nudge(name, "no_workers_when_solo", "you work solo: no worker is dispatched", "do the job yourself, or ask the user to switch the work mode", repeat_interval=0)
    WORKER_STOPPED_UNREPORTED = Nudge(name, "worker_stopped_unreported", "worker {{n}}, {{name}}, stopped before it reported", repeat_interval=0)
    SUBAGENT_OVERFLOW = Nudge(name, "too_many_subagents", "{{running}} subagents are running, the most at once", "wait for one to finish, or keep the work yourself", repeat_interval=0)
    WORKER_OVERFLOW = Nudge(name, "too_many_workers", "{{out}} workers are out, the most at once", "wait for one to report with `journal worker wait`, or give the job to one that reported with `journal worker send`", repeat_interval=0)
    WORKER_FILE = Nudge(name, "file_is_the_workers", "that file is in worker {{n}}'s worktree", "{{name}} writes there: `journal worker send {{n}} \"<job>\"`, or wait for its report and merge", repeat_interval=0)
    UNREAD_WORKER_REPORTS = Nudge(name, "act_on_the_reports", "{{reports_waiting}} reported and you have not acted on it yet", "read its report, then give it its next job, stop it, or mark it done once its work is merged or used", repeat_interval=180, blocks_regardless=True)
    WORKER_KNOWS_FILES = Nudge(name, "send_it_to_the_worker_that_knows", "{{count}} idle workers already worked on files this job names:\n{{workers}}", "give the job to one of them with its send line, or add --fresh to the dispatch if it truly needs a new worker", repeat_interval=0)
    IDLE_CAP = Nudge(name, "send_it_to_an_idle_worker", "{{kept}} {{profile}} workers are kept, the most of one profile, and {{count}} of them are idle:\n{{workers}}", "give the job to one of them with its send line, or retire one with `journal worker complete <n> --why \"<reason>\"` to free a place", repeat_interval=0)
    REUSE_QUESTION = Nudge(name, "could_it_be_reused", "Are you sure worker {{n}}, {{name}}, cannot be reused?", "if it can, give it its next job with `journal worker send {{n}} \"<job>\"`; if not, repeat the command with --why \"<why it cannot>\"", repeat_interval=0)
    SILENT_WORKER = Nudge(name, "worker_quiet", "worker {{n}}, {{name}}, has been quiet for {{minutes}} minutes", "look at its transcript on its worker page, tell it something with `journal worker notify {{n}} \"<text>\"`, or stop it", repeat_interval=0)
    SUBAGENT_REUSE = Nudge(name, "send_the_job_to_the_subagent", "{{count}} idle subagents already worked on files this job names:\n{{subagents}}", "send the job to one of them with its SendMessage line, so it goes on with what it knows, or retire it with `journal subagent retire <n>` if the job needs a fresh one", repeat_interval=0)
    nudges = (READINESS, WORK_READY, RUN_UNFINISHED, USER_CLOSURE, BRIEF_CHANGED, OUTPUT_UNFINISHED, OUTPUT_END, OPEN_TODOS, WORKER_ARRIVAL, WORKER_REPORTED, WORKER_STOPPED_UNREPORTED, UNREAD_WORKER_REPORTS, SUBAGENT_OVERFLOW, WORKER_OVERFLOW, WORKER_FILE, SUBAGENT_REUSE, WORKER_KNOWS_FILES, IDLE_CAP, REUSE_QUESTION, SILENT_WORKER, ORCHESTRATE, TASK_DELEGATION, SOLO_DISPATCH, ORCHESTRATOR_MODE, SOLO_MODE, BLOCKED_CHECK, CREW_REMINDER, PLACE_FREE, CHECK_REMINDER)

    skill = Skill("workers", 'Send a worker to write a bounded job and wait for its report; load it before dispatching one', """
# Workers

A subagent only reads. A worker writes: code in a worktree of its own, a document, a change.

- `journal worker dispatch "<Name>" --task <n> --changes "<the files or document it changes>" --tests "No tests|Scoped tests|Full suite" --profile journal-senior|journal-medior ["<more to tell it>"] [--provider claude|codex] [--worktree --libraries <a,b> | --copies <a,b> | --no-libraries]`:
  name it after a distinguished figure with a twist on their trade. A worker writes: `--changes` names what it changes,
  and a job that only reads, searches, researches or reviews is always a subagent's, never a worker's. `--tests` names the
  test template that says how it tests, and its text goes into the brief: Scoped tests for most jobs, No tests when you
  run them yourself, and Full suite seldom, since the full suite is yours to run once its work is back; the project's own
  test templates are listed with `journal template list`. A worker is started only on a task: an open one with a
  brief, which is its job, or the one you hold, which it then takes over. The task is the worker's from then on, never
  offered to you as next, until its work is merged or released. The profile sets its model and what it is told:
  medior, on Sonnet, for a job whose shape is settled; senior, on Opus, only for one that needs judgement. `--model` overrides it.
  In a project that holds repositories of its own inside it, a worktree holds a worktree of each one the task's brief names
  (all of them when it names none), so name the repositories the job touches in the brief; each merges into its own.
  A worktree has no installed libraries of its own, so a worktree dispatch names them: `--libraries node_modules,.venv`
  links the main checkout's folders, `--copies vendor` gives the worker copies of its own (always copy composer's vendor:
  its autoloader loads classes from where vendor really lives, so through a link the tests would run the main checkout's
  code), and `--no-libraries` gives none, for a job that changes the libraries. Each applies in every inner repository too.
  The project's own commands around the making of a worktree are settings: `journal settings show workers.preparation_commands`,
  `workers.completion_commands` and `workers.worktree_step`, which you may set with `journal settings set`.
- The work mode is the bottom state of your stack. Builder, the default: you build it yourself and send a worker when a job
  is better done beside you. Orchestrator: you plan, hand every task you can to a worker and review what comes back;
  a stop or a long quiet with open tasks tells you to check the plans and dispatch, and a task in hand is one to hand
  over, never to do yourself. The orchestrator decides on its own and keeps the work moving; it waits for the user only
  before a step that cannot be undone or reaches outside the project. A task that waits on something blocks that task
  alone: it blocks it and goes on with every other open task. Solo: you do everything yourself and a worker's dispatch is refused. The user sets it
  with the plan bar's buttons.
- A worker works a shift on its task: it clocks in with `journal clock-in`, keeps its own list with `journal todo`,
  proves each point of the brief with `journal proof <point> "<file:line, and the test>"` or says why not with
  `--not-done`, commits its work, and clocks out with `journal clock-out "<report>"`, its one report. You are told when
  it clocks in, and once when its work is ready to check; your stops name the work still waiting.
- `journal worker wait <n> [<n>...]` waits until they have clocked out; stopping is fine while you wait.
- Check each proof: read them with `journal task show <task>`, then `journal worker check <n> <point>`, or
  `journal worker check <n> <point> --short "<what is missing>"`, which sends it back to the same worker on the same task.
  Once every point is checked, `journal worker merge <n>` takes its branch in and closes the task; nothing else lands a
  worker's work, not the end of its run, a hand merge or a commit's tasks-done line.
- A worker whose run ends without clocking out still holds its task: send it again with `journal worker send <n>`, or
  let the task go with `journal worker release <n>`. `journal worker list` shows every worker, and the subagents you
  started with their state and task.
- A worker that runs past 60 minutes is stopped and its report says so (setting workers.timeout_minutes, 0 for no limit).
- Related work goes back to the worker that knows it: `journal worker send <n> "<next job>"` gives a worker that
  reported, or was stopped, its next job in its last session, with its memory of the last job, in the same worktree.
  Never dispatch a fresh worker for work one already out has done part of.
- A worker still running takes a word in its live session: `journal worker notify <n> "<text>"`. Only a Claude
  worker has a session inbox; a Codex worker, and one that reported or was stopped, are refused with what to use instead.
- A dispatch whose brief names files an idle worker touched is refused, naming that worker and its send line; add
  `--fresh` only when the job truly needs a new worker. Once a profile has as many workers out or idle as the setting
  workers.idle_kept (8, 0 for no limit), a dispatch of that profile is refused while one of them is idle. A reviewer
  always starts fresh.
- `journal worker complete <n>` or `journal worker stop <n>` of an idle worker first asks whether it could be reused;
  repeat it with `--why "<reason>"` to retire it. A worker out silent for 20 minutes is named to you once.
- A worker lists the other workers of the agent that dispatched it with `journal worker peers` and reaches one with
  notify when it is out or send when it is idle; never itself, a retired one or another agent's workers.
- A subagent job on files an idle subagent of the same kind read is refused, naming its SendMessage line, so the
  subagent that knows the files takes it. `journal subagent retire <n>` lets a subagent go: it is no longer offered
  and no longer counts among the subagents running at once (workers.most_subagents).
""", keywords=('worker', 'workers', 'helper', 'dispatch', 'worktree', 'send', 'notify'), required_states=('awaiting',))
