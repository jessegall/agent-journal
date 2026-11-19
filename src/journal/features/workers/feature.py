from journal.events.blocking import Blocking
from journal.support.agent_role import AgentRole
from journal.support.card_family import CardFamily
from journal.support.card_type_entry import CardTypeEntry
from journal.support.card_type_catalogue import AGENT
from journal.support.card_type import CardType
from journal.support.card_colouring import CardColouring
from journal.events.rows.worker_delivered import WorkerDelivered
from journal.features.feature import Feature
from journal.features.workers.listeners.worker_progress_record import WorkerProgressRecord
from journal.features.workers.listeners.shortfall_return import ShortfallReturn
from journal.features.workers.listeners.merged_test_run_stop import MergedTestRunStop
from journal.features.workers.listeners.merge_clash_return import MergeClashReturn
from journal.features.workers.listeners.branch_clash_check import BranchClashCheck
from journal.features.workers.listeners.test_run_record import TestRunRecord
from journal.features.workers.listeners.fitness_record import FitnessRecord
from journal.features.workers.listeners.load_record import LoadRecord
from journal.features.workers.listeners.load_tick_record import LoadTickRecord
from journal.features.workers.listeners.measure_line_record import MeasureLineRecord
from journal.features.workers.listeners.wait_record import WaitRecord
from journal.features.workers.listeners.model_fit_record import ModelFitRecord
from journal.features.workers.listeners.task_touch import TaskTouch
from journal.features.workers.listeners.worker_task_changes import WorkerTaskChanges
from journal.features.workers.listeners.test_turn_release import TestTurnRelease
from journal.features.workers.listeners.test_turn_task_release import TestTurnTaskRelease
from journal.features.workers.seeds.test_turns_resume import TestTurnsResume
from journal.features.workers.commands.tests_command import TestsCommand
from journal.features.workers.commands.arrival_command import ArrivalCommand
from journal.features.workers.commands.todo_command import TodoCommand
from journal.features.workers.commands.mode_command import ModeCommand
from journal.features.workers.commands.proof_command import ProofCommand
from journal.features.workers.commands.departure_command import DepartureCommand
from journal.features.workers.workers_conduct import WorkersConduct
from journal.features.workers.orchestrator_conduct import OrchestratorConduct
from journal.features.workers.builder_conduct import BuilderConduct
from journal.features.workers.solo_conduct import SoloConduct
from journal.features.workers.support.workers_data_reader import WorkersDataReader
from journal.features.workers.support.session_workers_reader import SessionWorkersReader
from journal.features.workers.commands.worker_peer_command import WorkerPeerCommand
from journal.features.workers.commands.worker_tests_command import WorkerTestsCommand
from journal.features.workers.commands.worker_build_command import WorkerBuildCommand
from journal.features.workers.support.workers_data import WorkersData
from journal.features.workers.seeds.subagents_seed import SubagentsSeed
from journal.features.workers.seeds.workers_seed import WorkersSeed
from journal.features.workers.jobs.worker_memory_watch import WorkerMemoryWatch
from journal.features.workers.jobs.worker_watch import WorkerWatch
from journal.features.workers.jobs.worktree_cleanup import WorktreeCleanup
from journal.support.option import USER, Option
from journal.support.option_scope import OptionScope
from journal.support.lockout_option import LOCKOUT_OPTION
from journal.support.skill import Skill
from journal.features.workers.commands.subagent_command import SubagentCommand
from journal.features.workers.commands.worker_command import WorkerCommand
from journal.features.workers.listeners.subagent_cards import SubagentCards
from journal.features.workers.listeners.subagent_record import SubagentRecord
from journal.features.workers.listeners.subagent_message_record import SubagentMessageRecord
from journal.features.workers.listeners.subagent_turn_record import SubagentTurnRecord
from journal.features.workers.listeners.worker_brief_record import WorkerBriefRecord
from journal.features.workers.listeners.worker_brief_binding import WorkerBriefBinding
from journal.features.workers.listeners.worker_note_record import WorkerNoteRecord
from journal.features.workers.listeners.worker_turn_record import WorkerTurnRecord
from journal.features.workers.listeners.worker_cards import WorkerCards
from journal.features.workers.support.subagent_process_card import SubagentProcessCard
from journal.features.workers.support.worker_process_card import WorkerProcessCard
from journal.engine.support.modes import Modes
from journal.features.plans.states.plans_ready import PlansReady
from journal.features.workers.support.orchestrator_task_assigner import OrchestratorTaskAssigner
from journal.features.workers.listeners.worker_moment_cards import WorkerMomentCards
from journal.features.workers.listeners.limit_resumes import LimitResumes
from journal.features.workers.listeners.queue_turn_resumes import QueueTurnResumes
from journal.features.workers.listeners.merged_lines_record import MergedLinesRecord
from journal.features.workers.listeners.committed_lines_record import CommittedLinesRecord
from journal.features.workers.listeners.first_report_record import FirstReportRecord
from journal.features.workers.listeners.open_work_wait_record import OpenWorkWaitRecord
from journal.features.workers.listeners.worker_merge_card import WorkerMergeCard
from journal.features.workers.listeners.worker_started_card import WorkerStartedCard
from journal.features.workers.listeners.worker_merge_refusal_card import WorkerMergeRefusalCard
from journal.features.workers.listeners.dispatch_refusal_cards import DispatchRefusalCards
from journal.features.workers.listeners.silent_worker_record import SilentWorkerRecord
from journal.features.workers.listeners.unfinished_clock_out import UnfinishedClockOut
from journal.features.workers.states.delegating import Delegating
from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.states.orchestrating_plan import OrchestratingPlan
from journal.features.workers.states.soloing import Soloing
from journal.features.workers.workers_part import WorkersPart
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.fitness_options import FitnessOptions
from journal.features.workers.support.work_mode_briefs import WorkModeBriefs
from journal.features.workers.workers_options import BUILDER_MODE, ORCHESTRATOR_MODE, SOLO_MODE, WorkersOptions
from journal.features.workers.listeners.test_run_card import TestRunCard
from journal.features.workers.support.test_run_process_card import TestRunProcessCard

from journal.features.workers.states.researching import Researching
from journal.features.workers.states.working_task import WorkingTask
from journal.features.workers.listeners.worker_assignment import WorkerAssignment
from journal.features.workers.listeners.worker_session_assignment import WorkerSessionAssignment

class Workers(Feature[WorkersData]):
    """A worker is an agent sent to write: code in a worktree of its own, a document, a change. A subagent only reads; a worker is the one that writes."""

    name = WorkersPart.name
    helper_listeners = {AgentRole.WORKER: (WorkerTurnRecord, SubagentMessageRecord, SubagentTurnRecord)}
    card_families = (CardFamily("helpers", "Workers and subagents", "agents", AGENT, CardColouring.OUTCOME), CardFamily("fitness", "Fitness", "activity", AGENT), CardFamily("worker_steps", "Workers' own steps", "agents", AGENT, CardColouring.OUTCOME),)
    card_types = (CardTypeEntry("agents", "Agents talking to each other", "helpers", covers=(CardType.SUBAGENTS, CardType.WORKERS)), CardTypeEntry(CardType.SUBAGENTS, "Subagents", "helpers"), CardTypeEntry(CardType.WORKERS, "Workers", "helpers", messages=("report",)), CardTypeEntry(CardType.FITNESS, "Drops in the fitness", "fitness"), CardTypeEntry(CardType.WORKER_STEPS, "Workers' moves: next job, queue given back, restart, rebase", "worker_steps"), CardTypeEntry(CardType.WORKER_TESTS, "Workers' test runs", "worker_steps"),)
    title = "Workers"
    help = "Agents sent to write one bounded job; the agent waits for their reports. How workers test is one of three: the agent that merges runs the tests, a worker runs the tests it wrote, or a worker tests within a budget through journal tests turn, the agent reading the machine's load and the turns with journal tests load and setting the budget with journal tests budget; its own suite is never queued."
    assigners = (OrchestratorTaskAssigner,)
    modes = Modes(WorkersOptions.MODE, {BUILDER_MODE: PlansReady, ORCHESTRATOR_MODE: Orchestrating, SOLO_MODE: Soloing})
    options = (LOCKOUT_OPTION, WorkersOptions.MEMORY_WARNING_MEGABYTES, WorkersOptions.MEMORY_LIMIT_MEGABYTES, WorkersOptions.MEMORY_TOTAL_MEGABYTES, FitnessOptions.EDIT_WAIT_MINUTES, FitnessOptions.BUILDER_ACTIVE_WORKERS, FitnessOptions.SCORE_WARMUP_MINUTES, FitnessOptions.ORCHESTRATOR_HIGH_ENTRY, FitnessOptions.ORCHESTRATOR_HIGH_EXIT, FitnessOptions.ORCHESTRATOR_LOW_ENTRY, FitnessOptions.ORCHESTRATOR_LOW_EXIT, FitnessOptions.BUILDER_HIGH_ENTRY, FitnessOptions.BUILDER_HIGH_EXIT, FitnessOptions.BUILDER_LOW_ENTRY, FitnessOptions.BUILDER_LOW_EXIT, FitnessOptions.BAND_MINUTES, FitnessOptions.EMPTY_QUEUE_MINUTES, WorkersOptions.SERIES_HOURS, WorkersOptions.COMMIT_LINE_CAP, WorkersOptions.IDLE_HOURS, FitnessOptions.WARNINGS, WorkersOptions.MERGE_WINDOW_SECONDS, WorkersOptions.MERGE_LIMIT, WorkersOptions.CARRY_MERGES, WorkersOptions.CLASH_LIMIT, WorkersOptions.ORCHESTRATOR_WRITES_PLANS, WorkersOptions.ORCHESTRATOR_APPROVES_PLANS, WorkersOptions.ORCHESTRATOR_PLAN_APPROVAL, WorkersOptions.ORCHESTRATOR_RELEASES, WorkersOptions.PLAN_STALL_MINUTES, WorkersOptions.WORKLOAD_WINDOW_MINUTES, WorkersOptions.WORKLOAD_SMOOTHING_MINUTES, WorkersOptions.WORKLOAD_WARNING_RATIO, WorkersOptions.BUILDER_CEILING, WorkersOptions.REVIEWER_LIMIT, WorkersOptions.VERIFIER_LIMIT, WorkersOptions.BUILDER_DISPATCH_ALLOWED, WorkersOptions.BUILDER_QUEUE_ALLOWED, WorkersOptions.BUILDER_SUBAGENTS_ALLOWED, WorkersOptions.SOLO_SUBAGENTS_ALLOWED, WorkersOptions.WORKLOAD_CRITICAL_RATIO, WorkersOptions.PLACE_OPENING_RATIO, WorkersOptions.PLACE_CLOSING_RATIO, WorkersOptions.PLACE_OPENING_MINUTES, WorkersOptions.PLACE_CLOSING_MINUTES, WorkersOptions.MIN_PLACES, WorkersOptions.MAX_PLACES, WorkersOptions.WEIGHT_USER_MESSAGE, WorkersOptions.RESEND_WEIGHT, WorkersOptions.STALLED_BLOCK_MINUTES, WorkersOptions.BLOCKED_SHARE, WorkersOptions.UNORDERED_PLAN_TASKS, WorkersOptions.PRIORITIES_MINUTES, WorkersOptions.MODEL_FIT_SAMPLE, WorkersOptions.COSTLY_SHAPED_WORK, WorkersOptions.TIMEOUT, WorkersOptions.MODE, WorkersOptions.TEST_RUNS, WorkersOptions.TEST_WAITING, WorkersOptions.TEST_ID_LIMIT, WorkersOptions.TEST_RUN_MINUTES, WorkersOptions.FAILING_RUNS, WorkersOptions.TEST_COMMAND, WorkersOptions.AFFECTED_TESTS_COMMAND, WorkersOptions.TEST_COMMAND_PROOF, WorkersOptions.TEST_RUN_LINES, WorkersOptions.WORKER_LIMIT, WorkersOptions.SUBAGENT_LIMIT, WorkersOptions.PROFILE_LIMIT, WorkersOptions.WORKTREE_STEP, WorkersOptions.PREPARATION_COMMANDS, WorkersOptions.COMPLETION_COMMANDS, WorkersOptions.BUILT_PATHS, WorkersOptions.BUILD_COMMAND, WorkersOptions.COMMAND_KINDS, WorkersOptions.ALLOWED_MODELS)
    states = (Orchestrating, Soloing, OrchestratingPlan, Delegating, WorkingTask, Researching)
    commands = (WorkerCommand, SubagentCommand, TestsCommand, ModeCommand)
    seeds = (WorkersSeed, SubagentsSeed, TestTurnsResume)
    jobs = (WorkerWatch, WorkerMemoryWatch, WorktreeCleanup)
    process_cards = (WorkerProcessCard, SubagentProcessCard, TestRunProcessCard)
    answer_listeners = ((SilentWorkerRecord, Blocking.ANSWER), (WorkerAssignment, Blocking.NEXT_DECISION), (WorkerSessionAssignment, Blocking.NEXT_DECISION), (WorkerTaskChanges, Blocking.NEXT_DECISION))
    listeners = (WorkerProgressRecord, MergedTestRunStop, SubagentRecord, SubagentCards, WorkerCards, TestRunCard, WorkerMomentCards, WorkerMergeCard, WorkerStartedCard, LimitResumes, QueueTurnResumes, MergedLinesRecord, CommittedLinesRecord, FirstReportRecord, OpenWorkWaitRecord, WorkerMergeRefusalCard, DispatchRefusalCards, UnfinishedClockOut, ShortfallReturn, MergeClashReturn, BranchClashCheck, TaskTouch, WorkerBriefRecord, WorkerBriefBinding, WorkerNoteRecord, WorkerTurnRecord, SubagentTurnRecord, SubagentMessageRecord, TestRunRecord, TestTurnRelease, TestTurnTaskRelease, LoadRecord, LoadTickRecord, ModelFitRecord, WaitRecord, FitnessRecord, MeasureLineRecord)
    data = (WorkersDataReader,)
    helper_data = {AgentRole.WORKER: (SessionWorkersReader,)}
    helper_commands = {AgentRole.WORKER: (WorkerPeerCommand, ArrivalCommand, DepartureCommand, ProofCommand, TodoCommand, WorkerTestsCommand, WorkerBuildCommand)}
    conduct = (WorkersConduct,)
    mode_conduct = ((Orchestrating, OrchestratorConduct), (PlansReady, BuilderConduct), (Soloing, SoloConduct))

    nudges = (WorkersNudges.BUILDER_CODE_SHARE_LINE, WorkersNudges.BUILDER_QUEUE_LINE, WorkersNudges.BUILDER_WORKER_LINE, WorkersNudges.OPEN_WORK_WAIT_LINE, WorkersNudges.ORCHESTRATOR_QUEUE_LINE, WorkersNudges.ORCHESTRATOR_WAIT_LINE, WorkersNudges.ORCHESTRATOR_HANDOUT_LINE, WorkersNudges.ORCHESTRATOR_REPORT_LINE, WorkersNudges.ORCHESTRATOR_DISPATCH_LINE, WorkersNudges.WAIT_MISSING, WorkersNudges.WAIT_TEXT, WorkersNudges.UNMOVED_TASKS, WorkersNudges.UNLINKED_TASKS, WorkersNudges.PRIORITIES, WorkersNudges.UNBLOCKER_QUEUED, WorkersNudges.QUEUE_RELATED, WorkersNudges.MODEL_OVERPOWERED, WorkersNudges.MODEL_UNDERPOWERED, WorkersNudges.TEST_RUN_FAILED, WorkersNudges.WORKER_KEEPS_FAILING, WorkersNudges.MODE_REFUSAL, WorkersNudges.PLACE_OPENED, WorkersNudges.PLACE_CLOSED, WorkersNudges.WORKER_GIT_REFUSAL, WorkersNudges.TEST_QUEUE, WorkersNudges.BUILD_QUEUE, WorkersNudges.COMMAND_KIND_REFUSAL, WorkersNudges.SUBAGENT_COMMAND_REFUSAL, WorkersNudges.EDIT_LOCK, WorkersNudges.WORK_READY, WorkersNudges.RUN_UNFINISHED, WorkersNudges.WORKER_PARKED, WorkersNudges.BRANCH_KEEPS_CLASHING, WorkersNudges.USER_CLOSURE, WorkersNudges.OUTPUT_UNFINISHED, WorkersNudges.OUTPUT_END, WorkersNudges.CLOCK_OUT_DUE, WorkersNudges.OPEN_TODOS, WorkersNudges.WORKER_REPORTED, WorkersNudges.WORKER_STOPPED_UNREPORTED, WorkersNudges.UNREAD_WORKER_REPORTS, WorkersNudges.SUBAGENT_OVERFLOW, WorkersNudges.PLACES_FULL, WorkersNudges.WORKER_OVERFLOW, WorkersNudges.WORKER_FILE, WorkersNudges.SUBAGENT_REUSE, WorkersNudges.WORKER_KNOWS_FILES, WorkersNudges.IDLE_CAP, WorkersNudges.REUSE_QUESTION, WorkersNudges.SILENT_WORKER, WorkersNudges.WORKER_LOG_DUE, WorkersNudges.PROOF_REJECTED, WorkersNudges.PROOF_REJECTED_REPEAT, WorkersNudges.PROOF_REJECTED_OFTEN, WorkersNudges.COSTLY_SHAPED_WORK, WorkersNudges.ORCHESTRATE, WorkersNudges.STARTED_PLANS, WorkersNudges.PLAN_STALLED, WorkersNudges.SUITE_BROKEN, WorkersNudges.WORKER_LIMITED, WorkersNudges.MEMORY_WARNING, WorkersNudges.DELIVERED_WAITING, WorkersNudges.ACTIVE_WORKERS, WorkersNudges.TASK_DELEGATION, WorkersNudges.SOLO_DISPATCH, WorkersNudges.ORCHESTRATOR_MODE, WorkersNudges.SOLO_MODE, WorkersNudges.BLOCKED_CHECK, WorkersNudges.IDLE_WORKER, WorkersNudges.RELEASE_REFUSED)

    companion_skills = (Skill("work-modes", 'Work as the builder, the orchestrator or solo, as its fitness measures tell it; load it when the work mode or its fitness comes up', """
# Work modes

- The work mode is the bottom state of your stack. """ + WorkModeBriefs.teaching() + """ The user sets it
  with the plan bar's buttons. The builder and the orchestrator are told by their measures, each line naming
  one action: the builder to write the task itself while its own share of the code is low, to take in the oldest worker
  while the worker queue stands high and to merge a worker before handing out more while too many are active; the
  orchestrator to clear the oldest worker while the queue stands high, to check a worker that waited too long, to hand
  out the next task while too little is handed out or a place stands idle, and to queue a worker more tasks while its
  workers report too often.
  The orchestrator is asked at each phase start of a started plan, and every workers.priorities_minutes after its last
  answer, which open task unblocks the most others or itself, and whether the queues are in that order; it answers with
  `journal plan priorities '<the order and why>'`, kept on the plan. A task that says it unblocks the orchestrator (a
  permission, access, a credential) is named at once when it is queued behind others.
- Your fitness is worked out from the measures of your work mode, minute by minute, on the work and the load, never on
  tool counts: the builder by its own share of the code, the worker queue held high and its workers active at once; the
  orchestrator by the worker queue held high, the wait of its oldest worker, its own share of the landed code, the minutes
  a place stood free and its first reports per merged task; every mode by how long your oldest message waits. Each
  measure fails past one level and passes again only back at another, and a failing one says its one line naming one
  action, only in the pressure bands (low, normal, high on the worker queue) where it may speak. A worker queue failing
  past workers.write_block_minutes makes your writes wait until you clear the oldest worker. With the fitness warnings
  switch off the measures are still worked out and shown, and nothing of them reaches you. The status bar's fitness
  opens every measure with its range and state.
""", keywords=('orchestrator', 'builder', 'solo', 'fitness'), required_states=('orchestrating', 'soloing')),)

    skill = Skill("workers", 'Send a worker to write a bounded job and wait for its report; load it before dispatching one', """
# Workers

A subagent only reads. A worker writes: code in a worktree of its own, a document, a change.

- Queue first: in builder and orchestrator mode give several related tasks to one worker that reports once, at the end of its queue.
- A worker reports, and its tests run, only once no task of its queue is left, so a queue interrupts you once.
- Dispatch or send it the first task, then queue it the rest with `journal worker queue <n> <task> [<task>...]`.
- A queued task is delegated to that worker at once, never offered to you or blocked; releasing the worker opens it again.
- When a worker's work is merged you are given the next task in its queue with the line that sends it.
- A dispatch or a send of a single task while other tasks of its plan wait is told once to queue them.
- Prefer one worker for a whole approved plan, or one phase of it: `--plan <n>` or `--plan <n> --phase <k>` in place of `--task`
  queues its open tasks in order, delegates the plan, and the worker tests as the plan's testing template says
  and reports once, at the plan's or phase's end or where it cannot go on.
- Dispatch with `journal worker dispatch "<Name>" --task <n> --changes "<what it changes>" --profile journal-senior|journal-medior
  ["<more to tell it>"] [--provider claude|codex] [--worktree --libraries <a,b> | --copies <a,b> | --no-libraries]`:
  `journal worker dispatch "Lady Lovelace" --task 12 --changes "src/footer.py, tests/test_footer.py" --profile journal-medior --worktree --libraries .venv`.
- Name a worker after a distinguished figure with a twist on their trade.
- A worker writes, and `--changes` names what; a job that only reads, searches, researches or reviews is a subagent's.
- A worker is started only on a task, an open one with a brief or the one you own, and the task is its own until merged or released.
- The profile sets its model and instructions: medior, on Sonnet, for a job whose shape is defined; senior, on Opus, for judgement. `--model` overrides it.
- How a worker tests is the setting How workers test. With The journal runs them, the default, it names its tests at
  clock-out with `--tests "<arguments>"` and the journal runs them in its worktree, a card in your chat showing the run;
  only a passing run lets the clock-out stand, and a failing one goes straight back to the worker.
- No worker is sent until the test command is set: `journal tests command "<command>" --proof "<the arguments of one passing test>"`.
- With Hand the tests over it runs none and its proofs name them for you; with Run the tests it wrote, `--tests` names the
  test template (`journal template list`), Scoped tests when not named and Full suite seldom: the full suite is yours.
- In a project with repositories of its own, a worktree holds one for each repository the brief names, all when it names none; each merges into its own.
- A worktree has no installed libraries: `--libraries node_modules,.venv` links the main checkout's, `--copies vendor` copies them, `--no-libraries` gives none.
- Always copy composer's vendor: through a link its autoloader would run the main checkout's code.
- The settings workers.preparation_commands, workers.completion_commands and workers.worktree_step hold the project's commands around a worktree's creation.
- A worker clocks in, keeps its own `journal todo` list, proves each point of the brief with `journal proof <point>
  "<file:line, and the test>"` (or `--not-done` and why) and clocks out with one report.
- At clock-out the journal commits a worker's work, asks the plugins, rebases it and runs its tests; a hold or a failing test goes back to the worker.
- You are told when a worker clocks in and once when its work is ready to check; your stops name what waits.
- A worker, a reviewer, a verifier and a subagent each run only the journal verbs their helper file in src/journal/helpers/
  names, and hear only what it allows; any other verb is refused, naming the file.
- `journal worker wait <n> [<n>...]` waits until they have clocked out; stopping is fine while you wait.
- Check each proof: read them with `journal task show <task>`, then `journal worker check <n> <point>`.
- Send a short proof back with `journal worker check <n> <point> --short "<what is missing>"`, to the same worker on the same task.
- Take the work in with `journal worker merge <n>` once every point is checked; nothing else adds a worker's work.
- A merge runs in the background with its card, step 1/5 to 5/5, while the plugins judge it; wait on its output as on any command.
- A worker whose run ends without clocking out still owns its task: send it again with `journal worker send <n>`.
- `journal worker release <n>` releases its task, refused while tasks it completed wait for the merge unless `--drop`.
- A worker that runs past 60 minutes is stopped and its report says so (setting workers.timeout_minutes, 0 for no limit).
- Send related work to the worker that knows it: `journal worker send <n> "<next job>"` keeps its session, memory and worktree.
- Never dispatch a new worker for work one already out has done part of.
- `--model <model>` or `--profile <profile>` on a send moves it to another model: stronger after three send-backs, cheaper for a settled shape.
- `journal worker list` shows every worker and the subagents you started: state, task, model, spend and send-backs.
- A worker with a task still queued clocks out of each task, which waits for the merge, and goes straight on to the
  next in its queue in the same session, with no test run and telling you nothing.
- Proving the last point of a task hands a queued worker the next.
- A queued worker reports, and its tests run, once no task is left; a blocked task next in its queue or a point proved
  not done ends the queue there.
- Check a finished task's points with `journal worker check <n> <point> --task <task>`; one merge takes every completed task in,
  refused while any point is unchecked.
- A worker still running takes a word with `journal worker notify <n> "<text>"`.
- Only a running Claude worker has a session inbox; notify to any other is refused with what to use instead.
- A dispatch whose brief names files an idle worker touched is refused, naming its send line; `--fresh` only when the job needs a new worker.
- Once a profile has workers.idle_kept workers out or idle (8, 0 for no limit), its dispatch is refused while one is idle.
- A reviewer always starts new.
- `journal worker complete <n>` or `journal worker stop <n>` of an idle worker first asks whether it could be reused; `--why "<reason>"` retires it.
- A worker out silent for 20 minutes is named to you once.
- A worker lists its dispatcher's other workers with `journal worker peers` and reaches one with notify or send; never
  itself, a retired one or another agent's workers.
- A subagent job on files an idle subagent of the same kind read is refused, naming its SendMessage line.
- `journal subagent retire <n>` releases a subagent from the count of those running at once (workers.most_subagents).
""", keywords=('worker', 'workers', 'helper', 'dispatch', 'worktree'), required_states=('awaiting',), commands=('worker', 'subagent'), events=(WorkerDelivered,))
