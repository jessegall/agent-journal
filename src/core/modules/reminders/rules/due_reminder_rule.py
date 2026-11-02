from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.block_until import BlockUntil
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.module.block_conditions import BlockConditions
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.reminders.commands.record_reminder_fired.record_reminder_fired import RecordReminderFired
from core.modules.reminders.models.reminder import Reminder
from core.modules.reminders.support.reminder_nudges import REMINDER_BLOCK, REMINDER_LINE


class DueReminderRule(DriverRule):
    """On any hook, the server's tick included, the main agent is told each reminder that has come due, and held by
    the block of one that has a block."""

    name = "reminders.due"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, conditions: BlockConditions) -> None:
        self.queries, self.conditions = queries, conditions

    def answer(self, hook: AgentHook) -> RuleAnswer:
        reminders = self.queries.query(Reminder).filter(environment_id=hook.environment_id).matching(IsNull("ended_at")).all_rows()
        due = [reminder for reminder in reminders if self.should_fire(reminder, hook)]
        if not due:
            return RuleAnswer.allowed()
        blocks = (BlockUntil(hook.agent_id, REMINDER_BLOCK.nudge(reminder=reminder.id, text=reminder.text), self.conditions.built(reminder.block_condition, reminder.block_subject)) for reminder in due if reminder.block_condition)
        return RuleAnswer.with_nudges(*(REMINDER_LINE.nudge(reminder=reminder.id, text=reminder.text) for reminder in due)).running(*(RecordReminderFired(reminder.id) for reminder in due), *blocks)

    def should_fire(self, reminder: Reminder, hook: AgentHook) -> bool:
        if reminder.due_at is not None:
            return reminder.due_at.value <= hook.timestamp.value
        return reminder.interval.has_passed(self.queries, hook.agent_id, reminder.last_fired_at or reminder.creation_timestamp(), hook.timestamp)
