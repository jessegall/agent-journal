from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.reminders.commands.make_reminder.make_reminder_handler import MakeReminderHandler
from core.modules.reminders.commands.make_reminder.make_reminder_subcommand import MakeReminderSubcommand
from core.modules.reminders.commands.record_reminder_fired.record_reminder_fired_handler import RecordReminderFiredHandler
from core.modules.reminders.migrations.m001_reminders import RemindersTableMigration
from core.modules.reminders.models.reminder import Reminder
from core.modules.reminders.rules.due_reminder_rule import DueReminderRule
from core.modules.reminders.support.reminder_nudges import REMINDER_NUDGES


class RemindersModule(Module):
    """Adds reminders: what an agent is told at a date and time or on an interval, once or repeating, and may be held
    to with a block, and the Reminders page."""

    name = "journal.core.reminders"
    seed_reason = "a reminder speaks at a time the demo does not reach"
    move_reason = "version 4's reminders move with the memories"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.memories"]
    models = [ModelDeclaration(Reminder, excluded_subcommands=["make", "edit"])]
    migrations = [RemindersTableMigration]
    handlers = [MakeReminderHandler, RecordReminderFiredHandler]
    subcommands = [MakeReminderSubcommand]
    nudges = REMINDER_NUDGES
    driver_rules = [DueReminderRule]
    windows = [WindowDeclaration("reminders.reminders", "Reminders", "reminders.js", WindowLoading.COMPONENT, place=WindowPlace.PAGE, group="project", icon=WindowIcon.RULE,
                                 reads=["reminder list"], runs=["reminder make", "reminder delete"], events=["reminder.*"])]
