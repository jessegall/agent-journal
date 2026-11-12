from dataclasses import replace

from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.commit_window import CommitWindow
from suites.coding.modules.workers.support.worker_steps import WorkerSteps
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
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from engine.query.queries import Queries
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames
from suites.coding.models.enums.coding_helper_role import CodingHelperRole


class PhaseTestRule(DriverRule):
    """Allows the test runs a worker starts itself between two commits, counted, and refuses them after the
    allowance is spent. After its last commit the worker waits for the merge and its runs are not counted, and
    while tests of its work have failed its runs are free until its next commit."""

    name = "workers.phase-tests"
    priority = -2
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [CodingHelperRole.WORKER]
    single_action_refusal = "Allows counted test runs between two commits and handles requests after the allowance is spent"

    def __init__(self, queries: Queries, commands: BackgroundCommands, worktrees: WorktreeQuery, window: CommitWindow, steps: WorkerSteps) -> None:
        self.queries, self.commands, self.worktrees, self.window, self.steps = queries, commands, worktrees, window, steps

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        test_part_count = sum(self.is_test_part(part, tool.shell) for part in tool.shell.parts)
        if not test_part_count:
            return RuleAnswer.allowed()
        worktree = self.worktrees.worker_worktree(hook.agent_id)
        if worktree is None or self.queries.query(Task).find(worktree.task_id).state is TaskState.TESTING or self.steps.has_open_failure(worktree):
            return RuleAnswer.allowed()
        remaining = self.window.test_runs_available(worktree)
        return self.line_answer([self.part_answer(hook.agent_id, self.window.key(worktree), remaining - position) for position in range(test_part_count)])

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
