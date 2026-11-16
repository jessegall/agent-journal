from core.modules.reminders.declarations.reminders_dependencies import REMINDERS_DEPENDENCIES
from core.modules.reminders.lines.due_reminder_lines import DueReminderLines
from core.modules.reminders.effects.due_reminder_effect import DueReminderEffect
from core.modules.reminders.states.due_reminder_states import DueReminderStates
from core.modules.reminders.models.declarations.reminder_model_declaration import ReminderModelDeclaration
from core.modules.reminders.windows.reminders_windows import REMINDERS_WINDOWS
from core.modules.reminders.migrations.m002_open_reminder_index import OpenReminderIndexMigration
from core.modules.reminders.migrations.m003_environment_reminder_index import EnvironmentReminderIndexMigration
from engine.module.module import Module
from core.modules.reminders.commands.make_reminder.make_reminder_handler import MakeReminderHandler
from core.modules.reminders.commands.make_reminder.make_reminder_subcommand import MakeReminderSubcommand
from core.modules.reminders.commands.record_reminder_fired.record_reminder_fired_handler import RecordReminderFiredHandler
from core.modules.reminders.listeners.reminder_made_mark_listener import ReminderMadeMarkListener
from core.modules.reminders.migrations.m001_reminders import RemindersTableMigration
from core.modules.reminders.support.reminder_agent_messages import REMINDER_AGENT_MESSAGES


class RemindersModule(Module):
    """Adds reminders: what an agent is told at a date and time or on an interval, once or repeating, and may be held
    to with a block, and the Reminders page."""

    name = "journal.core.reminders"
    states = [DueReminderStates]
    effects = [DueReminderEffect]
    lines = [DueReminderLines]
    seed_reason = "a reminder speaks at a time the demo does not reach"
    move_reason = "version 4's reminders move with the memories"
    requires_engine = ">=5,<6"
    dependencies = REMINDERS_DEPENDENCIES
    models = [ReminderModelDeclaration]
    migrations = [EnvironmentReminderIndexMigration, OpenReminderIndexMigration, RemindersTableMigration]
    handlers = [MakeReminderHandler, RecordReminderFiredHandler]
    subcommands = [MakeReminderSubcommand]
    listeners = [ReminderMadeMarkListener]
    agent_messages = REMINDER_AGENT_MESSAGES
    windows = REMINDERS_WINDOWS
