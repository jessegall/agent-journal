from core.modules.drivers.declarations.drivers_effects import DRIVERS_EFFECTS
from core.modules.drivers.declarations.drivers_policies import DRIVERS_POLICIES
from core.modules.drivers.declarations.drivers_lines import DRIVERS_LINES
from core.modules.drivers.declarations.drivers_former_event_keys import DRIVERS_FORMER_EVENT_KEYS
from core.modules.drivers.declarations.drivers_dependencies import DRIVERS_DEPENDENCIES
from core.modules.drivers.declarations.drivers_models import DRIVERS_MODELS
from core.modules.drivers.declarations.drivers_migrations import DRIVERS_MIGRATIONS
from core.modules.drivers.declarations.drivers_handlers import DRIVERS_HANDLERS
from core.modules.drivers.declarations.drivers_subcommands import DRIVERS_SUBCOMMANDS
from core.modules.drivers.declarations.drivers_listeners import DRIVERS_LISTENERS
from core.modules.drivers.declarations.drivers_tick_handlers import DRIVERS_TICK_HANDLERS
from core.modules.drivers.declarations.drivers_block_conditions import DRIVERS_BLOCK_CONDITIONS
from core.modules.drivers.declarations.drivers_bindings import DRIVERS_BINDINGS
from core.modules.drivers.wake_causes.journal_started_wake import JournalStartedWake
from core.modules.drivers.wake_causes.turn_failed_wake import TurnFailedWake
from core.modules.drivers.marks.escalation_mark import EscalationMark
from core.modules.drivers.transforms.project_hook_transform import ProjectHookTransform
from core.modules.drivers.windows.drivers_windows import DRIVERS_WINDOWS
from core.modules.drivers.drivers.main.main_agent_driver import MainAgentDriver
from core.modules.drivers.drivers.helper.helper_agent_driver import HelperAgentDriver
from core.modules.drivers.marks.compaction_mark import CompactionMark
from core.modules.drivers.marks.dispatch_mark import DispatchMark
from core.modules.drivers.support.driver_agent_messages import DRIVER_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.drivers.marks.required_command_skipped_mark import RequiredCommandSkippedMark
from core.modules.drivers.marks.bypass_mark import BypassMark
from core.modules.drivers.models.hook_call_row import HookCallRow
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.models.message_total import MessageTotal
from core.modules.drivers.guards.driver_setting_guard import DriverSettingGuard
from core.modules.drivers.support.hook_cost_tool import HookCostTool
from core.modules.drivers.models.environment_menu_row import EnvironmentMenuRow
from core.modules.drivers.support.driver_settings import DRIVERS_SETTINGS
from core.modules.drivers.support.reviewer_start import REVIEWER_PROFILE


class DriversModule(Module):
    """Keeps every hook's decision, the lines waiting for agents and each line source's history, and answers
    hooks through the agent machine, with the suites, drivers and contributions of the installed modules."""

    name = "journal.core.drivers"
    transforms = [ProjectHookTransform]
    effects = DRIVERS_EFFECTS
    policies = DRIVERS_POLICIES
    lines = DRIVERS_LINES
    agent_messages = DRIVER_AGENT_MESSAGES
    profiles = [REVIEWER_PROFILE]
    move_reason = "version 4 kept hook records in its own bookkeeping tables, which stay in the backup"
    requires_engine = ">=5,<6"
    former_event_keys = DRIVERS_FORMER_EVENT_KEYS
    settings = DRIVERS_SETTINGS
    agent_drivers = [MainAgentDriver, HelperAgentDriver]
    dependencies = DRIVERS_DEPENDENCIES
    models = DRIVERS_MODELS
    views = [HookCallRow, MessageTotal, AgentActivity, EnvironmentMenuRow]
    migrations = DRIVERS_MIGRATIONS
    handlers = DRIVERS_HANDLERS
    subcommands = DRIVERS_SUBCOMMANDS
    guards = [DriverSettingGuard]
    listeners = DRIVERS_LISTENERS
    wake_causes = [JournalStartedWake, TurnFailedWake]
    marks = [RequiredCommandSkippedMark, BypassMark, DispatchMark, CompactionMark, EscalationMark]
    performance_tools = [HookCostTool]
    tick_handlers = DRIVERS_TICK_HANDLERS
    block_conditions = DRIVERS_BLOCK_CONDITIONS
    bindings = DRIVERS_BINDINGS
    windows = DRIVERS_WINDOWS
    seed_reason = "each suite chooses the drivers used by its demo"
