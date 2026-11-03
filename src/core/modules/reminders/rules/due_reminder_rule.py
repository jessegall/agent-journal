from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.block_until import BlockUntil
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.module.block_conditions import BlockConditions
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.tool_use_span import ToolUseSpan
from core.modules.reminders.commands.record_reminder_fired.record_reminder_fired import RecordReminderFired
from core.modules.reminders.models.reminder import Reminder
from core.modules.reminders.support.reminder_nudges import REMINDER_BLOCK, REMINDER_LINE

OPEN_REMINDERS_READ = 200


class DueReminderRule(DriverRule):
    """On any hook, the server's tick included, the main agent is told each reminder that has come due, and
    held by the block of one that has a block. The open reminders are read in one query, and the tool uses
    every reminder counts are counted together in another."""

    name = "reminders.due"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, conditions: BlockConditions, hook_calls: HookCallQuery) -> None:
        self.queries, self.conditions, self.hook_calls = queries, conditions, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        reminders = self.queries.query(Reminder).filter(environment_id=hook.environment_id).matching(IsNull("ended_at")).oldest().limited(OPEN_REMINDERS_READ)
        tool_uses = self.tool_uses(reminders, hook)
        due = [reminder for reminder in reminders if self.should_fire(reminder, hook, tool_uses.get(reminder.id, 0))]
        if not due:
            return RuleAnswer.allowed()
        blocks = (BlockUntil(hook.agent_id, REMINDER_BLOCK.nudge(reminder=reminder.id, text=reminder.text), self.conditions.built(reminder.block_condition, reminder.block_subject)) for reminder in due if reminder.block_condition)
        return RuleAnswer.with_nudges(*(REMINDER_LINE.nudge(reminder=reminder.id, text=reminder.text) for reminder in due)).running(*(RecordReminderFired(reminder.id) for reminder in due), *blocks)

    def tool_uses(self, reminders: list[Reminder], hook: AgentHook) -> dict[int, int]:
        counting = [reminder for reminder in reminders if reminder.due_at is None and reminder.interval_tool_uses]
        if not counting:
            return {}
        counts = self.hook_calls.tool_use_counts(hook.agent_id, [self.start(reminder) for reminder in counting])
        return {reminder.id: count for reminder, count in zip(counting, counts)}

    @staticmethod
    def start(reminder: Reminder) -> Timestamp:
        return reminder.last_fired_at or reminder.creation_timestamp()

    def should_fire(self, reminder: Reminder, hook: AgentHook, tool_uses: int) -> bool:
        if reminder.due_at is not None:
            return reminder.due_at.value <= hook.timestamp.value
        start = self.start(reminder)
        return any(tool_uses >= span.count if isinstance(span, ToolUseSpan) else span.has_passed(self.queries, hook.agent_id, start, hook.timestamp) for span in reminder.interval.spans)
