from collections.abc import Sequence

from core.base.driver.nudge import Nudge
from core.modules.aliases.rules.saved_command_rule import SavedCommandRule
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
from suites.coding.modules.workers.support.worker_nudges import PHASE_TEST_REFUSED, TEST_REQUEST_UNNEEDED, TEST_REQUEST_ALLOWED, TEST_REQUEST_REASON_MISSING, TEST_REQUEST_FORWARDED, TEST_REQUEST_WAITING
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.test_request_identity import TestRequestIdentity
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

    def __init__(self, phases: WorkerPhases, commands: BackgroundCommands, worktrees: WorktreeQuery, queries: Queries, saved_commands: SavedCommandRule, identity: TestRequestIdentity) -> None:
        self.phases, self.commands, self.worktrees, self.queries, self.saved_commands, self.identity = phases, commands, worktrees, queries, saved_commands, identity

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        test_parts = [part for part in tool.shell.parts if self.is_test_part(part, tool.shell)]
        flags = [WorkerTestFlag.parsed(part) for part in test_parts]
        if not flags:
            return RuleAnswer.allowed()
        phase = self.phases.waiting_phase(hook.agent_id)
        if phase is None:
            return RuleAnswer.refused(TEST_REQUEST_UNNEEDED.nudge()) if any(flag.is_flagged for flag in flags) else RuleAnswer.allowed()
        if any(flag.is_flagged and not flag.reason for flag in flags):
            return RuleAnswer.refused(TEST_REQUEST_REASON_MISSING.nudge())
        saved_refusals = [self.saved_commands.part_refusal(part, tool.shell, hook.role) for part in test_parts]
        task_id = self.worktrees.worker_worktree(hook.agent_id).task_id
        open_requests = self.queries.query(WorkerTestRequest).filter(worker_id=hook.agent_id, task_id=task_id).matching(Among("state", OPEN_REQUEST_STATES)).oldest().all_rows()
        return self.line_answer([self.part_answer(flag, saved_refusal, hook.agent_id, task_id, phase, open_requests) for flag, saved_refusal in zip(flags, saved_refusals, strict=True)])

    def is_test_part(self, part: Part, shell: ShellLine) -> bool:
        return self.commands.part_command(part, shell).category is CommandCategory.TEST_RUN and not ASKING_FLAGS.intersection(part.arguments)

    def part_answer(self, flag: WorkerTestFlag, saved_refusal: Nudge | None, worker_id: int, task_id: int, phase: Phase, open_requests: Sequence[WorkerTestRequest]) -> RuleAnswer:
        wanted = self.identity.of(flag.command)
        request = next((row for row in open_requests if self.identity.of(row.command) == wanted), None)
        is_allowed = request is not None and request.state is WorkerTestRequestState.ALLOWED
        if saved_refusal is not None and (flag.is_flagged or is_allowed):
            return RuleAnswer.refused(saved_refusal)
        if not flag.is_flagged:
            return RuleAnswer.allowed().running(UseWorkerTest(request.id)) if is_allowed else RuleAnswer.refused(PHASE_TEST_REFUSED.nudge(phase=phase.id, plan=phase.plan_id))
        if request is None:
            return RuleAnswer.refused(TEST_REQUEST_FORWARDED.nudge()).running(AskWorkerTest(worker_id, task_id, flag.command, flag.reason))
        return RuleAnswer.refused((TEST_REQUEST_ALLOWED if is_allowed else TEST_REQUEST_WAITING).nudge(request=request.id))

    @staticmethod
    def line_answer(answers: list[RuleAnswer]) -> RuleAnswer:
        refusals = [answer for answer in answers if answer.refusal]
        first_answer, *remaining_answers = refusals or [RuleAnswer.allowed(), *answers]
        return first_answer.running(*(command for answer in remaining_answers for command in answer.commands))
