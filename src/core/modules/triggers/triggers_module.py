from core.modules.triggers.commands.try_trigger.try_trigger_subcommand import TryTriggerSubcommand
from core.modules.triggers.migrations.m005_trigger_skill import TriggerSkillMigration
from core.modules.triggers.migrations.m006_trigger_approval_index import TriggerApprovalIndexMigration
from core.modules.triggers.commands.enable_trigger.enable_trigger_handler import EnableTriggerHandler
from core.modules.triggers.commands.enable_trigger.enable_trigger_subcommand import EnableTriggerSubcommand
from core.modules.triggers.guards.agent_trigger_guard import AgentTriggerGuard
from core.modules.triggers.listeners.trigger_waiting_mark_listener import TriggerWaitingMarkListener
from core.modules.triggers.listeners.trigger_approval_listener import TriggerApprovalListener
from core.modules.triggers.migrations.m003_trigger_enabling import TriggerEnablingMigration
from core.modules.triggers.support.trigger_marks import TRIGGER_MARKS
from core.modules.triggers.support.trigger_settings import TRIGGER_SETTINGS
from core.modules.triggers.support.trigger_nudges import TRIGGER_NUDGES
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.triggers.commands.fire_trigger.fire_trigger_handler import FireTriggerHandler
from core.modules.triggers.commands.make_trigger.make_trigger_handler import MakeTriggerHandler
from core.modules.triggers.commands.make_trigger.make_trigger_subcommand import MakeTriggerSubcommand
from core.modules.triggers.commands.schedule_trigger.schedule_trigger_handler import ScheduleTriggerHandler
from core.modules.triggers.commands.schedule_trigger.schedule_trigger_subcommand import ScheduleTriggerSubcommand
from core.modules.triggers.commands.pause_trigger.pause_trigger_handler import PauseTriggerHandler
from core.modules.triggers.commands.pause_trigger.pause_trigger_subcommand import PauseTriggerSubcommand
from core.modules.triggers.commands.strike_trigger.strike_trigger_handler import StrikeTriggerHandler
from core.modules.triggers.listeners.trigger_actions_listener import TriggerActionsListener
from core.modules.triggers.migrations.m002_trigger_details import TriggerDetailsMigration
from core.modules.triggers.commands.strike_trigger.strike_trigger_subcommand import StrikeTriggerSubcommand
from core.modules.triggers.commands.trigger_list.trigger_list_subcommand import TriggerListSubcommand
from core.modules.triggers.migrations.m001_triggers import TriggersTableMigration
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.queries.trigger_query import TriggerQuery
from core.modules.triggers.upgrade.triggers_move import TriggersMove
from core.modules.triggers.seeders.triggers_seeder import TriggersSeeder
from core.modules.triggers.rules.phrase_trigger_rule import PhraseTriggerRule
from core.modules.triggers.rules.scheduled_trigger_rule import ScheduledTriggerRule
from core.modules.triggers.support.skeletons import TRIGGERS_TRIGGERS_SKELETON
from core.modules.triggers.models.trigger_action_run import TriggerActionRun
from core.modules.triggers.migrations.m004_trigger_action_runs import TriggerActionRunsMigration
from core.modules.triggers.commands.start_trigger_action.start_trigger_action_handler import StartTriggerActionHandler
from core.modules.triggers.commands.deliver_trigger_output.deliver_trigger_output_handler import DeliverTriggerOutputHandler
from core.modules.triggers.listeners.trigger_output_listener import TriggerOutputListener
from core.modules.triggers.listeners.trigger_process_removal_listener import TriggerProcessRemovalListener

BUILT = ["make", "list", "delete"]


class TriggersModule(Module):
    """Adds triggers: a phrase in the user's words or in a tool call, or a time, gives the agent a text or
    refuses."""

    name = "journal.core.triggers"
    nudges = TRIGGER_NUDGES
    settings = TRIGGER_SETTINGS
    marks = TRIGGER_MARKS
    guards = [AgentTriggerGuard]
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.chat", "journal.core.drivers", "journal.core.settings", "journal.core.processes", "journal.core.skills"]
    models = [ModelDeclaration(Trigger, query=TriggerQuery, excluded_subcommands=BUILT), ModelDeclaration(TriggerActionRun, excluded_subcommands=["make", "edit", "list", "show", "delete"])]
    migrations = [TriggersTableMigration, TriggerDetailsMigration, TriggerEnablingMigration, TriggerActionRunsMigration, TriggerSkillMigration, TriggerApprovalIndexMigration]
    handlers = [EnableTriggerHandler, MakeTriggerHandler, ScheduleTriggerHandler, StrikeTriggerHandler, FireTriggerHandler, PauseTriggerHandler, StartTriggerActionHandler, DeliverTriggerOutputHandler]
    listeners = [TriggerActionsListener, TriggerWaitingMarkListener, TriggerOutputListener, TriggerProcessRemovalListener, TriggerApprovalListener]
    subcommands = [TryTriggerSubcommand, EnableTriggerSubcommand, MakeTriggerSubcommand, ScheduleTriggerSubcommand, StrikeTriggerSubcommand, PauseTriggerSubcommand, TriggerListSubcommand]
    driver_rules = [PhraseTriggerRule, ScheduledTriggerRule]
    windows = [WindowDeclaration("triggers.triggers", "Triggers", "triggers.js", WindowLoading.COMPONENT, skeleton=TRIGGERS_TRIGGERS_SKELETON, icon=WindowIcon.TRIGGER,
                                 reads=["trigger list"], runs=["trigger make", "trigger schedule", "trigger edit", "trigger strike", "trigger pause", "trigger enable"], events=["trigger.*"], keys=[WindowKey("triggers", "trigger list", events=["trigger.*"])])]
    seeders = [TriggersSeeder]
    moves = [TriggersMove]
