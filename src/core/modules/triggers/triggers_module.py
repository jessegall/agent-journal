from core.modules.triggers.declarations.triggers_dependencies import TRIGGERS_DEPENDENCIES
from core.modules.triggers.declarations.triggers_migrations import TRIGGERS_MIGRATIONS
from core.modules.triggers.declarations.triggers_handlers import TRIGGERS_HANDLERS
from core.modules.triggers.declarations.triggers_listeners import TRIGGERS_LISTENERS
from core.modules.triggers.declarations.triggers_subcommands import TRIGGERS_SUBCOMMANDS
from core.modules.triggers.policies.phrase_trigger_policy import PhraseTriggerPolicy
from core.modules.triggers.lines.phrase_trigger_lines import PhraseTriggerLines
from core.modules.triggers.lines.scheduled_trigger_lines import ScheduledTriggerLines
from core.modules.triggers.effects.phrase_trigger_effect import PhraseTriggerEffect
from core.modules.triggers.effects.scheduled_trigger_effect import ScheduledTriggerEffect
from core.modules.triggers.states.phrase_trigger_states import PhraseTriggerStates
from core.modules.triggers.windows.triggers_windows import TRIGGERS_WINDOWS
from core.modules.triggers.models.declarations.trigger_model_declaration import TriggerModelDeclaration
from core.modules.triggers.models.declarations.trigger_action_run_model_declaration import TriggerActionRunModelDeclaration
from core.modules.triggers.guards.agent_trigger_guard import AgentTriggerGuard
from core.modules.triggers.marks.trigger_waiting_mark import TriggerWaitingMark
from core.modules.triggers.support.trigger_settings import TRIGGER_SETTINGS
from core.modules.triggers.support.trigger_agent_messages import TRIGGER_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.triggers.upgrade.triggers_move import TriggersMove
from core.modules.triggers.seeders.triggers_seeder import TriggersSeeder



class TriggersModule(Module):
    """Adds triggers: a phrase in the user's words or in a tool call, or a time, gives the agent a text or
    refuses."""

    name = "journal.core.triggers"
    states = [PhraseTriggerStates]
    effects = [PhraseTriggerEffect, ScheduledTriggerEffect]
    lines = [PhraseTriggerLines, ScheduledTriggerLines]
    policies = [PhraseTriggerPolicy]
    agent_messages = TRIGGER_AGENT_MESSAGES
    settings = TRIGGER_SETTINGS
    marks = [TriggerWaitingMark]
    guards = [AgentTriggerGuard]
    requires_engine = ">=7,<8"
    dependencies = TRIGGERS_DEPENDENCIES
    models = [TriggerModelDeclaration, TriggerActionRunModelDeclaration]
    migrations = TRIGGERS_MIGRATIONS
    handlers = TRIGGERS_HANDLERS
    listeners = TRIGGERS_LISTENERS
    subcommands = TRIGGERS_SUBCOMMANDS
    windows = TRIGGERS_WINDOWS
    seeders = [TriggersSeeder]
    moves = [TriggersMove]
