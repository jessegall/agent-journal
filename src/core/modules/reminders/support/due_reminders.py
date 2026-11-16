from engine.database.database import Database
from engine.request.request_values import RequestValues
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.reminders.conditions.non_helper_rows import NonHelperRows
from core.modules.reminders.models.reminder import Reminder
from core.modules.tasks.queries.task_query import TaskQuery

OPEN_REMINDERS_READ = 200

# the key a due reminder's hold, lines and effect are recorded under
DUE_REMINDER_KEY = "reminders.due"

class DueReminders:
    """The reminders that have come due for a main agent now: the open reminders in one query a request, the
    tool uses every reminder counts counted together, and closed tasks counted once for all intervals."""

    def __init__(self, queries: Queries, hook_calls: HookCallQuery, tasks: TaskQuery, request_values: RequestValues, database: Database) -> None:
        self.queries, self.hook_calls, self.tasks, self.request_values, self.database = queries, hook_calls, tasks, request_values, database

    # worked out once a request for the agent, and again after a write, so its lines, effect and hold share one read
    def due(self, agent_id: int, timestamp: Timestamp) -> list[Reminder]:
        return self.request_values.read(f"reminders.due.{agent_id}", self.database.change_mark, lambda: self.found(agent_id, timestamp))

    def found(self, agent_id: int, timestamp: Timestamp) -> list[Reminder]:
        reminders = self.queries.query(Reminder).matching(IsNull("ended_at")).matching(NonHelperRows()).oldest().take(OPEN_REMINDERS_READ)
        tool_uses = self.tool_uses(reminders, agent_id)
        counting = [reminder for reminder in reminders if reminder.due_at is None and reminder.interval_tasks]
        counts = self.tasks.closed_counts([reminder.interval_timestamp() for reminder in counting])
        closed_tasks = {reminder.id: count for reminder, count in zip(counting, counts)}
        return [reminder for reminder in reminders if reminder.should_fire(timestamp, tool_uses.get(reminder.id, 0), closed_tasks.get(reminder.id, 0))]

    def tool_uses(self, reminders: list[Reminder], agent_id: int) -> dict[int, int]:
        counting = [reminder for reminder in reminders if reminder.due_at is None and reminder.interval_tool_uses]
        if not counting:
            return {}
        counts = self.hook_calls.tool_use_counts(agent_id, [reminder.interval_timestamp() for reminder in counting])
        return {reminder.id: count for reminder, count in zip(counting, counts)}
