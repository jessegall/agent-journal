from core.base.driver.essential_allowances import EssentialAllowances
from core.base.driver.hook_history import HookHistory
from core.base.guard.change_filter import ChangeFilter
from core.base.driver.hook_route import HookRoute
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.drivers.agent_hook_route import AgentHookRoute
from core.modules.drivers.agent_line import AgentLine
from core.modules.drivers.deliver_agent_line import DeliverAgentLine
from core.modules.drivers.allow_essential_rule_handler import AllowEssentialRuleHandler
from core.modules.drivers.allow_essential_rule_subcommand import AllowEssentialRuleSubcommand
from core.modules.drivers.driver_change_filter import DriverChangeFilter
from core.modules.drivers.choose_driver_handler import ChooseDriverHandler
from core.modules.drivers.choose_driver_subcommand import ChooseDriverSubcommand
from core.modules.drivers.driver_show_subcommand import DriverShowSubcommand
from core.modules.drivers.hook_call import HookCall
from core.modules.drivers.prune_hook_calls_handler import PruneHookCallsHandler
from core.modules.drivers.prune_hook_calls_subcommand import PruneHookCallsSubcommand
from core.modules.drivers.hook_call_query import HookCallQuery
from core.modules.drivers.record_hook_call_handler import RecordHookCallHandler
from core.modules.drivers.hook_call_show_subcommand import HookCallShowSubcommand
from core.modules.drivers.driver_setting_guard import DriverSettingGuard
from core.modules.drivers.migrations.m001_drivers import DriversTablesMigration
from core.modules.drivers.new_driver_lines_listener import NewDriverLinesListener
from core.modules.drivers.opening_lines_rule import OpeningLinesRule
from core.modules.drivers.repeated_stop_release_rule import RepeatedStopReleaseRule
from core.modules.drivers.rule_history import RuleHistory
from core.modules.drivers.session_end_rule import SessionEndRule
from core.modules.drivers.setting_essential_allowances import SettingEssentialAllowances
from core.modules.drivers.choose_suite_handler import ChooseSuiteHandler
from core.modules.drivers.choose_suite_subcommand import ChooseSuiteSubcommand
from core.modules.drivers.suite_current_subcommand import SuiteCurrentSubcommand
from core.modules.drivers.suite_show_subcommand import SuiteShowSubcommand
from core.modules.drivers.suite_layout_subcommand import SuiteLayoutSubcommand
from core.modules.drivers.table_hook_history import TableHookHistory


class DriversModule(Module):
    """Keeps every hook's decision, the lines waiting for agents and the rules' history, and answers hooks through
    the suites, drivers and rules of the installed modules."""

    name = "journal.core.drivers"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings"]
    models = [ModelDeclaration(HookCall, query=HookCallQuery, excluded_subcommands=["make", "edit", "delete", "show"]), ModelDeclaration(AgentLine, commands=[DeliverAgentLine]), ModelDeclaration(RuleHistory, excluded_subcommands=["make", "edit"])]
    migrations = [DriversTablesMigration]
    handlers = [RecordHookCallHandler, PruneHookCallsHandler, ChooseSuiteHandler, ChooseDriverHandler, AllowEssentialRuleHandler]
    subcommands = [HookCallShowSubcommand, PruneHookCallsSubcommand, ChooseSuiteSubcommand, SuiteCurrentSubcommand, SuiteShowSubcommand, SuiteLayoutSubcommand, ChooseDriverSubcommand, DriverShowSubcommand,
                   AllowEssentialRuleSubcommand]
    guards = [DriverSettingGuard]
    listeners = [NewDriverLinesListener]
    driver_rules = [RepeatedStopReleaseRule, SessionEndRule, OpeningLinesRule]
    bindings = [(HookHistory, TableHookHistory), (HookRoute, AgentHookRoute), (ChangeFilter, DriverChangeFilter),
                (EssentialAllowances, SettingEssentialAllowances)]
    windows = [WindowDeclaration("drivers.hook-calls", "Activity", "hook-calls.js", WindowLoading.COMPONENT, place=WindowPlace.AGENT,
                                 reads=["hook-call list", "hook-call show"], events=["hook_call.create"])]
