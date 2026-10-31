from core.base.driver.essential_allowances import EssentialAllowances
from core.base.driver.hook_history import HookHistory
from core.base.guard.change_filter import ChangeFilter
from core.base.driver.hook_route import HookRoute
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.drivers.bindings.agent_hook_route import AgentHookRoute
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.commands.deliver_agent_line import DeliverAgentLine
from core.modules.drivers.commands.allow_essential_rule_handler import AllowEssentialRuleHandler
from core.modules.drivers.commands.allow_essential_rule_subcommand import AllowEssentialRuleSubcommand
from core.modules.drivers.bindings.driver_change_filter import DriverChangeFilter
from core.modules.drivers.commands.choose_driver_handler import ChooseDriverHandler
from core.modules.drivers.commands.choose_driver_subcommand import ChooseDriverSubcommand
from core.modules.drivers.commands.driver_show_subcommand import DriverShowSubcommand
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.commands.prune_hook_calls_handler import PruneHookCallsHandler
from core.modules.drivers.commands.prune_hook_calls_subcommand import PruneHookCallsSubcommand
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.commands.record_hook_call_handler import RecordHookCallHandler
from core.modules.drivers.commands.hook_call_show_subcommand import HookCallShowSubcommand
from core.modules.drivers.guards.driver_setting_guard import DriverSettingGuard
from core.modules.drivers.migrations.m001_drivers import DriversTablesMigration
from core.modules.drivers.migrations.m002_hook_call_updated_input import HookCallUpdatedInputMigration
from core.modules.drivers.listeners.new_driver_lines_listener import NewDriverLinesListener
from core.modules.drivers.listeners.subagent_stop_listener import SubagentStopListener
from core.modules.drivers.rules.missing_process_rule import MissingProcessRule
from core.modules.drivers.rules.opening_lines_rule import OpeningLinesRule
from core.modules.drivers.rules.repeated_stop_release_rule import RepeatedStopReleaseRule
from core.modules.drivers.models.rule_history import RuleHistory
from core.modules.drivers.rules.session_end_rule import SessionEndRule
from core.modules.drivers.bindings.setting_essential_allowances import SettingEssentialAllowances
from core.modules.drivers.commands.choose_suite_handler import ChooseSuiteHandler
from core.modules.drivers.commands.choose_suite_subcommand import ChooseSuiteSubcommand
from core.modules.drivers.commands.suite_current_subcommand import SuiteCurrentSubcommand
from core.modules.drivers.commands.suite_list_subcommand import SuiteListSubcommand
from core.modules.drivers.commands.suite_show_subcommand import SuiteShowSubcommand
from core.modules.drivers.commands.suite_layout_subcommand import SuiteLayoutSubcommand
from core.modules.drivers.commands.suite_presets_subcommand import SuitePresetsSubcommand
from core.modules.drivers.bindings.table_hook_history import TableHookHistory
from core.modules.drivers.support.driver_settings import DRIVERS_SETTINGS
from core.modules.drivers.seeders.drivers_seeder import DriversSeeder


class DriversModule(Module):
    """Keeps every hook's decision, the lines waiting for agents and the rules' history, and answers hooks through
    the suites, drivers and rules of the installed modules."""

    name = "journal.core.drivers"
    move_reason = "version 4 kept hook records in its own bookkeeping tables, which stay in the backup"
    requires_core = ">=5,<6"
    settings = DRIVERS_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings"]
    models = [ModelDeclaration(HookCall, query=HookCallQuery, excluded_subcommands=["make", "edit", "delete", "show"]), ModelDeclaration(AgentLine, commands=[DeliverAgentLine]), ModelDeclaration(RuleHistory, excluded_subcommands=["make", "edit"])]
    migrations = [DriversTablesMigration, HookCallUpdatedInputMigration]
    handlers = [RecordHookCallHandler, PruneHookCallsHandler, ChooseSuiteHandler, ChooseDriverHandler, AllowEssentialRuleHandler]
    subcommands = [HookCallShowSubcommand, PruneHookCallsSubcommand, ChooseSuiteSubcommand, SuiteCurrentSubcommand, SuiteListSubcommand, SuiteShowSubcommand, SuiteLayoutSubcommand, SuitePresetsSubcommand, ChooseDriverSubcommand, DriverShowSubcommand,
                   AllowEssentialRuleSubcommand]
    guards = [DriverSettingGuard]
    listeners = [NewDriverLinesListener, SubagentStopListener]
    driver_rules = [RepeatedStopReleaseRule, SessionEndRule, OpeningLinesRule, MissingProcessRule]
    bindings = [(HookHistory, TableHookHistory), (HookRoute, AgentHookRoute), (ChangeFilter, DriverChangeFilter),
                (EssentialAllowances, SettingEssentialAllowances)]
    windows = [WindowDeclaration("drivers.hook-calls", "Activity", "hook-calls.js", WindowLoading.COMPONENT, icon=WindowIcon.RUNS, place=WindowPlace.AGENT,
                                 reads=["hook-call list", "hook-call show"], events=["hook_call.create"])]
    seeders = [DriversSeeder]
