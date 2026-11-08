from dataclasses import replace

from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.models.worker_test_run import WorkerTestRun
from suites.coding.modules.workers.commands.record_worker_test_run.record_worker_test_run import RecordWorkerTestRun
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS

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
from suites.coding.modules.workers.support.worker_test_group import WorkerTestGroup
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.reader_demands import ASKING_FLAGS
from suites.coding.modules.workers.commands.ask_worker_test.ask_worker_test import AskWorkerTest
from suites.coding.modules.workers.commands.use_worker_test.use_worker_test import UseWorkerTest
from suites.coding.modules.workers.models.enums.worker_test_request_state import OPEN_REQUEST_STATES, WorkerTestRequestState
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import PHASE_TEST_REFUSED, PHASE_TEST_RUN_ALLOWED, TEST_REQUEST_UNNEEDED, TEST_REQUEST_ALLOWED, TEST_REQUEST_REASON_MISSING, TEST_REQUEST_FORWARDED, TEST_REQUEST_WAITING
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.test_request_identity import TestRequestIdentity
from suites.coding.modules.workers.support.worker_test_flag import WorkerTestFlag
from suites.coding.support.coding_helper_kind import CodingHelperKind


class PhaseTestRule(DriverRule):
    """Allows counted tests within a phase and handles requests after the allowance is spent."""

    name = "workers.phase-tests"
    priority = -2
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [CodingHelperKind.WORKER]

    def __init__(self, phases: WorkerPhases, commands: BackgroundCommands, worktrees: WorktreeQuery, queries: Queries, saved_commands: SavedCommandRule, identity: TestRequestIdentity, settings: SettingValues) -> None:
        self.phases, self.commands, self.worktrees, self.queries, self.saved_commands, self.identity, self.settings = phases, commands, worktrees, queries, saved_commands, identity, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        test_parts = [part for part in tool.shell.parts if self.is_test_part(part, tool.shell)]
        flags = [WorkerTestFlag.parsed(part) for part in test_parts]
        if not flags:
            return RuleAnswer.allowed()
        group = self.phases.waiting_group(hook.agent_id)
        if group is None:
            return RuleAnswer.refused(TEST_REQUEST_UNNEEDED.nudge()) if any(flag.is_flagged for flag in flags) else RuleAnswer.allowed()
        if any(flag.is_flagged and not flag.reason for flag in flags):
            return RuleAnswer.refused(TEST_REQUEST_REASON_MISSING.nudge())
        task_id = self.worktrees.worker_worktree(hook.agent_id).task_id
        open_requests = self.queries.query(WorkerTestRequest).filter(worker_id=hook.agent_id, task_id=task_id).matching(Among("state", OPEN_REQUEST_STATES)).oldest().all_rows()
        used = self.queries.query(WorkerTestRun).filter(worker_id=hook.agent_id, group_key=group.key).count()
        remaining = self.settings.number(WORKER_PHASE_TEST_RUNS) - used
        answers = []
        for part, flag in zip(test_parts, flags, strict=True):
            wanted = self.identity.key(flag.command)
            request = next((row for row in open_requests if self.identity.key(row.command) == wanted), None)
            checks_saved_command = flag.is_flagged or (request is not None and request.state is WorkerTestRequestState.ALLOWED)
            saved_refusal = self.saved_commands.part_refusal(part, tool.shell, hook.role) if checks_saved_command else None
            answer = self.part_answer(flag, saved_refusal, hook.agent_id, task_id, group, request, remaining)
            answers.append(answer)
            remaining -= sum(isinstance(command, RecordWorkerTestRun) for command in answer.commands_unrefused)
        return self.line_answer(answers)

    def is_test_part(self, part: Part, shell: ShellLine) -> bool:
        return self.commands.part_command(part, shell).category is CommandCategory.TEST_RUN and not ASKING_FLAGS.intersection(part.arguments)

    def part_answer(self, flag: WorkerTestFlag, saved_refusal: Nudge | None, worker_id: int, task_id: int, group: WorkerTestGroup, request: WorkerTestRequest | None, remaining: int) -> RuleAnswer:
        is_allowed = request is not None and request.state is WorkerTestRequestState.ALLOWED
        if saved_refusal is not None and (flag.is_flagged or is_allowed):
            return RuleAnswer.refused(saved_refusal)
        if not flag.is_flagged:
            if is_allowed:
                return RuleAnswer.allowed().running_unrefused(UseWorkerTest(request.id))
            if remaining <= 0:
                return RuleAnswer.refused(PHASE_TEST_REFUSED.nudge())
            return RuleAnswer.with_nudges(PHASE_TEST_RUN_ALLOWED.nudge(remaining=remaining - 1)).running_unrefused(RecordWorkerTestRun(worker_id, group.key))
        if request is None and remaining > 0:
            return RuleAnswer.refused(TEST_REQUEST_UNNEEDED.nudge())
        if request is None:
            return RuleAnswer.refused(TEST_REQUEST_FORWARDED.nudge()).running(AskWorkerTest(worker_id, task_id, flag.command, flag.reason))
        return RuleAnswer.refused((TEST_REQUEST_ALLOWED if is_allowed else TEST_REQUEST_WAITING).nudge(request=request.id))

    @staticmethod
    def line_answer(answers: list[RuleAnswer]) -> RuleAnswer:
        refusals = [answer for answer in answers if answer.refusal]
        first_answer, *remaining_answers = refusals or [RuleAnswer.allowed(), *answers]
        combined = first_answer.running(*(command for answer in remaining_answers for command in answer.commands)).running_unrefused(*(command for answer in remaining_answers for command in answer.commands_unrefused))
        return combined if refusals else replace(combined, nudges=tuple(nudge for answer in answers for nudge in answer.nudges))
