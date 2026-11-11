from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.models.phase import Phase
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from suites.coding.modules.workers.commands.defer_phase_test.defer_phase_test import DeferPhaseTest
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.models.affected_test import AffectedTestState
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.phase_test_deferral import PATH_SEPARATOR, PhaseTestDeferral
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.checkpoint_results import CheckpointResults
from suites.coding.modules.workers.support.failed_test_paths import FailedTestPaths
from suites.coding.modules.workers.support.merger_visits import MergerVisits
from suites.coding.modules.workers.support.phase_test_deferral_rules import PhaseTestDeferralRules
from suites.coding.modules.workers.support.phase_test_deferrals import PhaseTestDeferrals
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions
from suites.coding.modules.workers.support.worker_settings import PHASE_TEST_DEFERRAL_LIMIT

LOG_LINE = "merger deferred {paths} of the test of checkpoint phase {phase} until the checkpoint of phase {due}: was {command}; now {shorter}; why: {reason}"
WORKER_LINE = ("the failing test paths {paths} of checkpoint phase {phase} wait for the checkpoint of phase {due}: there is nothing to fix,"
               ' commit again with --differences "nothing to fix: its failing test paths are deferred"')
STATUS_HINT = "journal worker status of the worker shows its task"


class DeferPhaseTestHandler(Handler[DeferPhaseTest, str]):
    """Leaves failing test paths out of the own test of the checkpoint a worker's returned task belongs to,
    until the next checkpoint of the plan, within PhaseTestDeferralRules. It saves the deferral, writes an
    important log line on the task with the old and the new command and the reason, and settles the worker's
    question as fixed: the worker commits again, and the next run of the checkpoint leaves the paths
    out. It changes no code, brief, dependency or state, and the main agent gets no message."""

    command = DeferPhaseTest
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, visits: MergerVisits, worktrees: WorktreeQuery, plans: TaskPlans, checkpoints: PlanCheckpoints, results: CheckpointResults,
                 deferrals: PhaseTestDeferrals, output: OutputFolder, settings: SettingValues, repository: Repository, bus: Bus, questions: WorkerQuestions) -> None:
        self.agents, self.visits, self.worktrees, self.plans, self.checkpoints, self.results = agents, visits, worktrees, plans, checkpoints, results
        self.deferrals, self.output, self.settings, self.repository, self.bus, self.questions = deferrals, output, settings, repository, bus, questions

    def handle(self, command: DeferPhaseTest, context: Context) -> str:
        require_merger(self.agents, context)
        self.visits.close_newest(context)
        task_id = self.worktrees.required_worker_worktree(command.worker_id).task_id
        task_phase = self.plans.find_phase(task_id)
        if task_phase is None:
            raise Refusal(f"task {task_id} is in no plan: it has no checkpoint", STATUS_HINT)
        windows = self.checkpoints.windows(task_phase.plan_id)
        checkpoint = windows.window_checkpoint(task_phase.id)
        omitted = self.deferrals.omitted(checkpoint.id)
        self.refuse_repeat(omitted, command.paths)
        limit = int(self.settings.number(PHASE_TEST_DEFERRAL_LIMIT))
        shorter = PhaseTestDeferralRules(limit).check(checkpoint, self.failed_paths(checkpoint), command.paths, len(windows.unfinished_following_ids(checkpoint)), self.deferrals.count(checkpoint.id))
        due = windows.following_checkpoint(checkpoint)
        if due is None:
            raise Refusal(f"phase {checkpoint.id} is the last checkpoint of its plan: no later one takes the paths back", STATUS_HINT)
        deferral = self.repository.save(PhaseTestDeferral(creator_id=context.actor.id, phase_id=checkpoint.id, due_phase_id=due.id, paths=PATH_SEPARATOR.join(command.paths),
                                                          worker_id=command.worker_id, reason=command.reason), context)
        self.bus.dispatch(MakeTaskLog(task_id, LOG_LINE.format(paths=deferral.paths, phase=checkpoint.id, due=due.id, command=checkpoint.test_command, shorter=shorter.text(),
                                                               reason=command.reason), important=True), context)
        self.close_question(command, WORKER_LINE.format(paths=deferral.paths, phase=checkpoint.id, due=due.id), context)
        return f"deferred {deferral.paths} until the checkpoint of phase {due.id}"

    def failed_paths(self, checkpoint: Phase) -> tuple[str, ...] | None:
        reaches = [reach for reach in self.checkpoints.reaches(checkpoint.plan_id) if reach.phase_id == checkpoint.id and reach.source.opens_phases()]
        if not reaches or reaches[-1].state is not CheckpointState.FAILED:
            return None
        return self.failed_test_paths(reaches[-1])

    def failed_test_paths(self, reach: CheckpointReach) -> tuple[str, ...] | None:
        failed = [test for test in self.results.tests(reach) if test.state is AffectedTestState.FAILED and not test.picker_command]
        if not failed:
            return None
        return tuple(path for test in failed for path in FailedTestPaths.read(self.output.all_output(test.process_id)).paths)

    @staticmethod
    def refuse_repeat(omitted: tuple[PhaseTestDeferral, ...], paths: tuple[str, ...]) -> None:
        repeated = [deferral for deferral in omitted if set(paths) & set(deferral.path_words())]
        if repeated:
            first = repeated[0]
            raise Refusal(f"{first.paths} is already deferred, by deferral {first.id} at {first.creation_timestamp().text}", "journal phase-test-deferral list shows the deferrals")

    def close_question(self, command: DeferPhaseTest, text: str, context: Context) -> None:
        lines = [self.questions.find_line(command.line_id)] if command.line_id is not None else list(self.questions.worker_lines(command.worker_id)[:1])
        if lines:
            self.questions.close(lines[0], AskOutcome.FIXED, text, context)
            return
        self.bus.dispatch(SendAgentMessage(command.worker_id, text, is_counted=True), replace(context, actor=Actor.core()))
