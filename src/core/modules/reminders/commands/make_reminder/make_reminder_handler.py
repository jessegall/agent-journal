from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.module.block_conditions import BlockConditions
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.reminders.commands.make_reminder.make_reminder import MakeReminder
from core.modules.reminders.models.reminder import Reminder


class MakeReminderHandler(Handler[MakeReminder, Reminder]):
    """Saves a reminder once it says when it comes and its block, if it has one, names a registered condition."""

    command = MakeReminder

    def __init__(self, repository: Repository, conditions: BlockConditions) -> None:
        self.repository, self.conditions = repository, conditions

    def handle(self, command: MakeReminder, context: Context) -> Reminder:
        if not (command.due_at or command.interval_seconds or command.interval_tool_uses or command.interval_tasks):
            raise Refusal("a reminder needs a time or an interval", "--at, --every-minutes, --every-tool-uses or --every-tasks")
        if command.block_condition and command.block_condition not in self.conditions.names():
            raise Refusal(f"no block condition is named {command.block_condition}", f"they are {', '.join(sorted(self.conditions.names()))}")
        return self.repository.save(Reminder(creator_id=context.actor.id, text=command.text, interval_seconds=command.interval_seconds, interval_tool_uses=command.interval_tool_uses,
                                             interval_tasks=command.interval_tasks, due_at=command.due_at, single_use=command.single_use, block_condition=command.block_condition, block_subject=command.block_subject), context)
