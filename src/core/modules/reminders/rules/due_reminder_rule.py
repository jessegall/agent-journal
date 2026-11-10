from core.modules.tasks.queries.task_query import TaskQuery
from engine.enums.agent_role import AgentRole
from core.modules.reminders.conditions.non_helper_rows import NonHelperRows
from engine.driver.agent_hook import AgentHook
from engine.driver.block_until import BlockUntil
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from engine.module.block_conditions import BlockConditions
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.reminders.commands.record_reminder_fired.record_reminder_fired import RecordReminderFired
from core.modules.reminders.models.reminder import Reminder
from core.modules.reminders.support.reminder_nudges import REMINDER_BLOCK, REMINDER_LINE

OPEN_REMINDERS_READ = 200


OPEN_REMINDERS_REASON = "every open reminder is checked for being due, at most the 200 oldest"

class DueReminderRule(DriverRule):
    """On any hook, the server's tick included, the main agent is told each reminder that has come due, and
    held by the block of one that has a block. The open reminders are read in one query, and the tool uses
    every reminder counts are counted together; closed tasks are counted once for all intervals."""

    name = "reminders.due"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, conditions: BlockConditions, hook_calls: HookCallQuery, tasks: TaskQuery) -> None:
        self.queries, self.conditions, self.hook_calls, self.tasks = queries, conditions, hook_calls, tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        reminders = self.queries.query(Reminder).matching(IsNull("ended_at")).matching(NonHelperRows()).oldest().full_table(OPEN_REMINDERS_REASON).limited(OPEN_REMINDERS_READ)
        tool_uses = self.tool_uses(reminders, hook)
        counting = [reminder for reminder in reminders if reminder.due_at is None and reminder.interval_tasks]
        counts = self.tasks.closed_counts([reminder.interval_timestamp() for reminder in counting])
        closed_tasks = {reminder.id: count for reminder, count in zip(counting, counts)}
        due = [reminder for reminder in reminders if reminder.should_fire(hook.timestamp, tool_uses.get(reminder.id, 0), closed_tasks.get(reminder.id, 0))]
        if not due:
            return RuleAnswer.allowed()
        blocks = (BlockUntil(hook.agent_id, REMINDER_BLOCK.nudge(reminder=reminder.id), self.conditions.built(reminder.block_condition, reminder.block_subject)) for reminder in due if reminder.block_condition)
        return RuleAnswer.with_nudges(*(REMINDER_LINE.nudge(reminder=reminder.id) for reminder in due)).running(*(RecordReminderFired(reminder.id) for reminder in due), *blocks)

    def tool_uses(self, reminders: list[Reminder], hook: AgentHook) -> dict[int, int]:
        counting = [reminder for reminder in reminders if reminder.due_at is None and reminder.interval_tool_uses]
        if not counting:
            return {}
        counts = self.hook_calls.tool_use_counts(hook.agent_id, [reminder.interval_timestamp() for reminder in counting])
        return {reminder.id: count for reminder, count in zip(counting, counts)}

