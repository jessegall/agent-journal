from dataclasses import replace

from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_groups import WorkerGroups
from suites.coding.modules.workers.commands.record_worker_test_run.record_worker_test_run import RecordWorkerTestRun

from engine.driver.agent_hook import AgentHook
from engine.enums.command_category import CommandCategory
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.part import Part
from engine.driver.rule_answer import RuleAnswer
from engine.driver.shell_line import ShellLine
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.reader_demands import ASKING_FLAGS
from suites.coding.modules.workers.support.worker_nudges import PHASE_TEST_REFUSED, PHASE_TEST_RUN_ALLOWED
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames
from suites.coding.models.enums.coding_helper_role import CodingHelperRole


class PhaseTestRule(DriverRule):
    """Allows the test runs a worker starts itself between two commits, counted, and refuses them after the
    allowance is spent. After its last commit the worker waits for the merge and its runs are not counted."""

    name = "workers.phase-tests"
    priority = -2
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [CodingHelperRole.WORKER]
    single_action_refusal = "Allows counted test runs between two commits and handles requests after the allowance is spent"

    def __init__(self, phases: WorkerPhases, commands: BackgroundCommands, worktrees: WorktreeQuery, groups: WorkerGroups) -> None:
        self.phases, self.commands, self.worktrees, self.groups = phases, commands, worktrees, groups

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        test_part_count = sum(self.is_test_part(part, tool.shell) for part in tool.shell.parts)
        if not test_part_count:
            return RuleAnswer.allowed()
        worktree = self.worktrees.worker_worktree(hook.agent_id)
        if worktree is None or self.phases.has_delivered(hook.agent_id):
            return RuleAnswer.allowed()
        remaining = self.groups.test_runs_available(worktree)
        return self.line_answer([self.part_answer(hook.agent_id, self.groups.run_window_key(worktree), remaining - position) for position in range(test_part_count)])

    def is_test_part(self, part: Part, shell: ShellLine) -> bool:
        return (WorkerTestNames.is_worker_test(part) or self.commands.part_command(part, shell).category is CommandCategory.TEST_RUN) and not ASKING_FLAGS.intersection(part.arguments)

    @staticmethod
    def part_answer(worker_id: int, window_key: str, remaining: int) -> RuleAnswer:
        if remaining <= 0:
            return RuleAnswer.refused(PHASE_TEST_REFUSED.nudge())
        return RuleAnswer.with_nudges(PHASE_TEST_RUN_ALLOWED.nudge(remaining=remaining - 1)).running_unrefused(RecordWorkerTestRun(worker_id, window_key))

    @staticmethod
    def line_answer(answers: list[RuleAnswer]) -> RuleAnswer:
        refusals = [answer for answer in answers if answer.refusal]
        first_answer, *remaining_answers = refusals or [RuleAnswer.allowed(), *answers]
        combined = first_answer.running(*(command for answer in remaining_answers for command in answer.commands)).running_unrefused(*(command for answer in remaining_answers for command in answer.commands_unrefused))
        return combined if refusals else replace(combined, nudges=tuple(nudge for answer in answers for nudge in answer.nudges))
