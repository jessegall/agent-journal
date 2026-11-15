from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.block_until import BlockUntil
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from engine.module.block_conditions import BlockConditions
from core.modules.reminders.commands.record_reminder_fired.record_reminder_fired import RecordReminderFired
from core.modules.reminders.support.due_reminders import DueReminders
from core.modules.reminders.nudges.reminder_block_nudge import ReminderBlockNudge
from core.modules.reminders.nudges.reminder_line_nudge import ReminderLineNudge




class DueReminderRule(DriverRule):
    """On any hook, the server's tick included, the main agent is told each reminder that has come due, and
    held by the block of one that has a block. The open reminders are read in one query, and the tool uses
    every reminder counts are counted together; closed tasks are counted once for all intervals."""

    name = "reminders.due"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, conditions: BlockConditions, reminders: DueReminders) -> None:
        self.conditions, self.reminders = conditions, reminders

    def answer(self, hook: AgentHook) -> RuleAnswer:
        due = self.reminders.due(hook.agent_id, hook.timestamp)
        if not due:
            return RuleAnswer.allowed()
        blocks = (BlockUntil(hook.agent_id, ReminderBlockNudge.declared().nudge(reminder=reminder.id), self.conditions.built(reminder.block_condition, reminder.block_subject)) for reminder in due if reminder.block_condition)
        return RuleAnswer.with_nudges(*(ReminderLineNudge.declared().nudge(reminder=reminder.id) for reminder in due)).running(*(RecordReminderFired(reminder.id) for reminder in due), *blocks)
