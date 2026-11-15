from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.driver.part import Part
from engine.driver.shell_line import ShellLine
from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from engine.request.request_values import RequestValues
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.reader_demands import ASKING_FLAGS
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.record_worker_test_run.record_worker_test_run import RecordWorkerTestRun
from suites.coding.modules.workers.agent_messages.phase_test_refusal_message import PhaseTestRefusalMessage
from suites.coding.modules.workers.agent_messages.phase_test_run_allowed_message import PhaseTestRunAllowedMessage
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.commit_window import CommitWindow
from suites.coding.modules.workers.support.worker_steps import WorkerSteps
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames

PHASE_TESTS_KEY = "workers.phase-tests"


@dataclass(frozen=True)
class PhaseTestAnswer:
    """What a worker's test runs get between two commits: the refusal once the allowance is spent, or a line for each
    run with the runs left and the commands that count them."""

    refusal: AgentMessage | None = None
    agent_messages: tuple[AgentMessage, ...] = ()
    records: tuple[Command[object], ...] = ()


class PhaseTestRuns:
    """Allows the test runs a worker starts itself between two commits, counted, and refuses them after the allowance
    is spent. After its last commit the worker waits for the merge and its runs are not counted, and while tests of its
    work have failed its runs are free until its next commit. Read once a hook, so the refusal, the lines and the count
    agree."""

    def __init__(self, queries: Queries, commands: BackgroundCommands, worktrees: WorktreeQuery, window: CommitWindow, steps: WorkerSteps, request_values: RequestValues) -> None:
        self.queries, self.commands, self.worktrees, self.window, self.steps, self.request_values = queries, commands, worktrees, window, steps, request_values

    def answer(self, event: HookEvent, agent_id: int) -> PhaseTestAnswer:
        # read once a hook whatever changes meanwhile: the runs it counts are what the next read finds spent
        return self.request_values.read(f"workers.phase-tests:{agent_id}:{event.firing}", lambda: event.firing, lambda: self.counted(event, agent_id))

    def counted(self, event: HookEvent, agent_id: int) -> PhaseTestAnswer:
        tool = event.tool
        if tool is None or tool.shell is None:
            return PhaseTestAnswer()
        test_part_count = sum(self.is_test_part(part, tool.shell) for part in tool.shell.parts)
        if not test_part_count:
            return PhaseTestAnswer()
        worktree = self.worktrees.worker_worktree(agent_id)
        if worktree is None or self.queries.query(Task).find(worktree.task_id).state is TaskState.TESTING or self.steps.has_open_failure(worktree):
            return PhaseTestAnswer()
        remaining = self.window.test_runs_available(worktree)
        if remaining - test_part_count < 0:
            return PhaseTestAnswer(PhaseTestRefusalMessage.declared().agent_message())
        key = self.window.key(worktree)
        lefts = [remaining - position for position in range(test_part_count)]
        return PhaseTestAnswer(None, tuple(PhaseTestRunAllowedMessage.declared().agent_message(remaining=left - 1) for left in lefts), tuple(RecordWorkerTestRun(agent_id, key) for _ in lefts))

    def is_test_part(self, part: Part, shell: ShellLine) -> bool:
        return (WorkerTestNames.is_worker_test(part) or self.commands.part_command(part, shell).category is CommandCategory.TEST_RUN) and not ASKING_FLAGS.intersection(part.arguments)
