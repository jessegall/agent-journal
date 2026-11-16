from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.agent_messages.unit_blocked_message import UnitBlockedMessage
from core.modules.agents.support.agent_number_messages import AgentNumberMessages

UNIT_TASKS_REASON = "the tasks left in a worker's unit are looked at for one that is not blocked"


class BlockedUnitNotice:
    """Tells the main agent, once the tests of a commit ended and passed, that every task a worker has left
    is blocked: the committed tasks wait for a merge ask nobody will make, so it can ask for them with
    --up-to or take them in early."""

    def __init__(self, tasks: TaskQuery, main_agent_line: MergerInbox, numbers: RowNumbers) -> None:
        self.tasks, self.main_agent_line, self.numbers = tasks, main_agent_line, numbers

    def send(self, worker_id: int, committed: list[Task], context: Context) -> None:
        remaining = [task for task in self.tasks.assignee_tasks(worker_id).unclosed().every_row(UNIT_TASKS_REASON) if task.state is not TaskState.TESTING]
        if not committed or not remaining or any(task.state is not TaskState.BLOCKED for task in remaining):
            return
        waits = "; ".join(f"task:{task.id} waits on {task.reason}" for task in remaining)
        committed_ids = ", ".join(f"task:{task.id}" for task in committed)
        self.main_agent_line.send_agent_message(AgentNumberMessages.message(self.numbers, UnitBlockedMessage, "worker", worker_id, committed=committed_ids, waits=waits), UnitBlockedMessage.declared().key, context)
