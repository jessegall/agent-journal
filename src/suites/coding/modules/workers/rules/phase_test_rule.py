from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.plans.models.phase import Phase
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.reader_demands import ASKING_FLAGS
from suites.coding.modules.workers.commands.ask_worker_test.ask_worker_test import AskWorkerTest
from suites.coding.modules.workers.commands.use_worker_test.use_worker_test import UseWorkerTest
from suites.coding.modules.workers.models.enums.worker_test_request_state import OPEN_REQUEST_STATES, WorkerTestRequestState
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import PHASE_TEST_REFUSED, TEST_NEEDS_NO_REQUEST, TEST_REQUEST_ALLOWED, TEST_REQUEST_NO_REASON, TEST_REQUEST_SENT, TEST_REQUEST_WAITING
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_test_flag import WorkerTestFlag
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole


class PhaseTestRule(DriverRule):
    """Answers a worker's test run by where it stands in a phase of a started plan: held back it is refused, the
    flag sends a request, and an allowed command runs once. It runs before the rules about saved commands and
    readers, so the worker hears this first."""

    name = "workers.phase-tests"
    priority = -2
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.WORKER]

    def __init__(self, phases: WorkerPhases, commands: BackgroundCommands, worktrees: WorktreeQuery, queries: Queries) -> None:
        self.phases, self.commands, self.worktrees, self.queries = phases, commands, worktrees, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        flags = [WorkerTestFlag.of(part) for part in tool.shell.parts if self.is_test_part(part, tool.shell)]
        if not flags:
            return RuleAnswer.allowed()
        phase = self.phases.held_phase(hook.agent_id)
        if phase is None:
            return RuleAnswer.refused(TEST_NEEDS_NO_REQUEST.nudge()) if any(flag.is_flagged for flag in flags) else RuleAnswer.allowed()
        if any(flag.is_flagged and not flag.reason for flag in flags):
            return RuleAnswer.refused(TEST_REQUEST_NO_REASON.nudge())
        return self.line_answer([self.part_answer(flag, hook.agent_id, phase) for flag in flags])

    def is_test_part(self, part: Part, shell: ShellLine) -> bool:
        return self.commands.part_command(part, shell).category is CommandCategory.TEST_RUN and not ASKING_FLAGS.intersection(part.arguments)

    def part_answer(self, flag: WorkerTestFlag, worker_id: int, phase: Phase) -> RuleAnswer:
        task_id = self.worktrees.worker_worktree(worker_id).task_id
        same_requests = self.queries.query(WorkerTestRequest).filter(worker_id=worker_id, task_id=task_id, command=flag.command)
        request = same_requests.matching(Among("state", OPEN_REQUEST_STATES)).first()
        is_allowed = request is not None and request.state is WorkerTestRequestState.ALLOWED
        if not flag.is_flagged:
            return RuleAnswer.allowed().running(UseWorkerTest(request.id)) if is_allowed else RuleAnswer.refused(PHASE_TEST_REFUSED.nudge(phase=phase.id, plan=phase.plan_id))
        if request is None:
            return RuleAnswer.refused(TEST_REQUEST_SENT.nudge()).running(AskWorkerTest(worker_id, task_id, flag.command, flag.reason))
        return RuleAnswer.refused((TEST_REQUEST_ALLOWED if is_allowed else TEST_REQUEST_WAITING).nudge(request=request.id))

    @staticmethod
    def line_answer(answers: list[RuleAnswer]) -> RuleAnswer:
        refusals = [answer for answer in answers if answer.refusal]
        chosen, *others = refusals or [RuleAnswer.allowed(), *answers]
        return chosen.running(*(command for answer in others for command in answer.commands))
