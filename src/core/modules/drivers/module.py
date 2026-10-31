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
from core.modules.drivers.agent_line_delivery import AgentLineDelivery
from core.modules.drivers.driver_allow_essential_handler import DriverAllowEssentialHandler
from core.modules.drivers.driver_allow_essential_subcommand import DriverAllowEssentialSubcommand
from core.modules.drivers.driver_change_filter import DriverChangeFilter
from core.modules.drivers.driver_choose_handler import DriverChooseHandler
from core.modules.drivers.driver_choose_subcommand import DriverChooseSubcommand
from core.modules.drivers.driver_show_subcommand import DriverShowSubcommand
from core.modules.drivers.hook_call import HookCall
from core.modules.drivers.hook_call_prune_handler import HookCallPruneHandler
from core.modules.drivers.hook_call_prune_subcommand import HookCallPruneSubcommand
from core.modules.drivers.hook_call_query import HookCallQuery
from core.modules.drivers.hook_call_record_handler import HookCallRecordHandler
from core.modules.drivers.hook_call_show_subcommand import HookCallShowSubcommand
from core.modules.drivers.driver_setting_guard import DriverSettingGuard
from core.modules.drivers.migrations.m001_drivers import DriversTablesMigration
from core.modules.drivers.new_driver_lines_listener import NewDriverLinesListener
from core.modules.drivers.opening_lines_rule import OpeningLinesRule
from core.modules.drivers.repeated_stop_release_rule import RepeatedStopReleaseRule
from core.modules.drivers.rule_history import RuleHistory
from core.modules.drivers.session_end_rule import SessionEndRule
from core.modules.drivers.setting_essential_allowances import SettingEssentialAllowances
from core.modules.drivers.suite_choose_handler import SuiteChooseHandler
from core.modules.drivers.suite_choose_subcommand import SuiteChooseSubcommand
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
    models = [ModelDeclaration(HookCall, query=HookCallQuery, excluded_subcommands=["make", "edit", "delete", "show"]), ModelDeclaration(AgentLine, commands=[AgentLineDelivery]), ModelDeclaration(RuleHistory, excluded_subcommands=["make", "edit"])]
    migrations = [DriversTablesMigration]
    handlers = [HookCallRecordHandler, HookCallPruneHandler, SuiteChooseHandler, DriverChooseHandler, DriverAllowEssentialHandler]
    subcommands = [HookCallShowSubcommand, HookCallPruneSubcommand, SuiteChooseSubcommand, SuiteCurrentSubcommand, SuiteShowSubcommand, SuiteLayoutSubcommand, DriverChooseSubcommand, DriverShowSubcommand,
                   DriverAllowEssentialSubcommand]
    guards = [DriverSettingGuard]
    listeners = [NewDriverLinesListener]
    driver_rules = [RepeatedStopReleaseRule, SessionEndRule, OpeningLinesRule]
    bindings = [(HookHistory, TableHookHistory), (HookRoute, AgentHookRoute), (ChangeFilter, DriverChangeFilter),
                (EssentialAllowances, SettingEssentialAllowances)]
    windows = [WindowDeclaration("drivers.hook-calls", "Activity", "hook-calls.js", WindowLoading.COMPONENT, place=WindowPlace.AGENT,
                                 reads=["hook-call list", "hook-call show"], events=["hook_call.create"])]
