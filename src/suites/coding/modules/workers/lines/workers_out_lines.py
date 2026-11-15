from collections.abc import Sequence
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.driver.nudge import Nudge
from suites.coding.modules.workers.nudges.worker_task_nudge import WorkerTaskNudge
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from engine.enums.agent_role import AgentRole


class WorkersOutLines(EventLineSource):
    """A main agent's session starts with a line for each worker of its environment that still has a worktree
    out."""

    key = "workers.workers-out-at-start"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, worktrees: WorktreeQuery, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.worktrees = worktrees

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        nudges: list[Nudge] = [WorkerTaskNudge.declared().nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), task=worktree.task_id) for worktree in self.worktrees.open_worktrees()]
        return [*nudges] if nudges else []
