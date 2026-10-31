from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.triggers.commands.fire_trigger_handler import FireTriggerHandler
from core.modules.triggers.commands.make_trigger_handler import MakeTriggerHandler
from core.modules.triggers.commands.make_trigger_subcommand import MakeTriggerSubcommand
from core.modules.triggers.commands.schedule_trigger_handler import ScheduleTriggerHandler
from core.modules.triggers.commands.schedule_trigger_subcommand import ScheduleTriggerSubcommand
from core.modules.triggers.commands.strike_trigger_handler import StrikeTriggerHandler
from core.modules.triggers.commands.strike_trigger_subcommand import StrikeTriggerSubcommand
from core.modules.triggers.commands.trigger_list_subcommand import TriggerListSubcommand
from core.modules.triggers.migrations.m001_triggers import TriggersTableMigration
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.queries.trigger_query import TriggerQuery
from core.modules.triggers.upgrade.triggers_move import TriggersMove
from core.modules.triggers.seeders.triggers_seeder import TriggersSeeder
from core.modules.triggers.rules.phrase_trigger_rule import PhraseTriggerRule
from core.modules.triggers.rules.scheduled_trigger_rule import ScheduledTriggerRule

BUILT = ["make", "edit", "show", "list", "delete"]


class TriggersModule(Module):
    """Adds triggers: a phrase in the user's words or in a tool call, or a time, gives the agent a text or refuses."""

    name = "journal.core.triggers"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers"]
    models = [ModelDeclaration(Trigger, query=TriggerQuery, excluded_subcommands=BUILT)]
    migrations = [TriggersTableMigration]
    handlers = [MakeTriggerHandler, ScheduleTriggerHandler, StrikeTriggerHandler, FireTriggerHandler]
    subcommands = (MakeTriggerSubcommand, ScheduleTriggerSubcommand, StrikeTriggerSubcommand, TriggerListSubcommand)
    driver_rules = [PhraseTriggerRule, ScheduledTriggerRule]
    windows = [WindowDeclaration("triggers.triggers", "Triggers", "triggers.js", WindowLoading.COMPONENT, icon=WindowIcon.TRIGGER,
                                 reads=["trigger list"], events=["trigger.*"])]
    seeders = [TriggersSeeder]
    moves = [TriggersMove]
