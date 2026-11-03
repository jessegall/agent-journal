from core.modules.drivers.commands.record_subagent_dispatch.record_subagent_dispatch_handler import RecordSubagentDispatchHandler
from core.modules.drivers.listeners.dispatch_mark_listener import DispatchMarkListener
from core.modules.drivers.migrations.m010_subagent_dispatches import SubagentDispatchesMigration
from core.modules.drivers.models.subagent_dispatch import SubagentDispatch
from core.modules.drivers.support.dispatch_marks import DISPATCH_MARKS
from core.modules.drivers.rules.dispatch_mark_rule import DispatchMarkRule
from core.modules.drivers.commands.close_required_command.close_required_command_handler import CloseRequiredCommandHandler
from core.modules.drivers.commands.skip_required_command.skip_required_command_subcommand import SkipRequiredCommandSubcommand
from core.modules.drivers.listeners.required_command_skip_mark_listener import RequiredCommandSkipMarkListener
from core.modules.drivers.migrations.m005_nudge_debts import NudgeDebtsMigration
from core.modules.drivers.migrations.m006_required_commands import RequiredCommandsMigration
from core.modules.drivers.migrations.m007_nudge_record_delivery import NudgeRecordDeliveryMigration
from core.modules.drivers.migrations.m008_required_command_type import RequiredCommandTypeMigration
from core.modules.drivers.models.required_command import RequiredCommand
from core.modules.drivers.rules.required_command_rule import RequiredCommandRule
from core.modules.drivers.support.driver_nudges import DRIVER_NUDGES
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
from core.modules.drivers.commands.pause_agent.pause_agent_subcommand import PauseAgentSubcommand
from core.modules.drivers.commands.pause_agent.pause_agent_handler import PauseAgentHandler
from core.modules.drivers.commands.resume_agent.resume_agent_subcommand import ResumeAgentSubcommand
from core.modules.drivers.commands.resume_agent.resume_agent_handler import ResumeAgentHandler
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.rules.dispatch_law_rule import DispatchLawRule
from core.modules.drivers.rules.subagent_reuse_rule import SubagentReuseRule
from core.modules.drivers.rules.long_output_rule import LongOutputRule
from core.modules.drivers.overlays.paused_overlay import PausedOverlay
from core.modules.drivers.listeners.bypass_log_listener import BypassLogListener
from core.modules.drivers.commands.record_bypass_line.record_bypass_line_handler import RecordBypassLineHandler
from core.modules.drivers.support.bypass_marks import BYPASS_MARKS
from core.modules.drivers.listeners.hook_wait_file_listener import HookWaitFileListener
from core.modules.drivers.commands.deliver_agent_line.deliver_agent_line import DeliverAgentLine
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.commands.allow_essential_rule.allow_essential_rule_handler import AllowEssentialRuleHandler
from core.modules.drivers.commands.allow_essential_rule.allow_essential_rule_subcommand import AllowEssentialRuleSubcommand
from core.modules.drivers.bindings.driver_change_filter import DriverChangeFilter
from core.modules.drivers.commands.choose_driver.choose_driver_handler import ChooseDriverHandler
from core.modules.drivers.commands.choose_driver.choose_driver_subcommand import ChooseDriverSubcommand
from core.modules.drivers.commands.driver_show.driver_show_subcommand import DriverShowSubcommand
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.commands.prune_hook_calls.prune_hook_calls_handler import PruneHookCallsHandler
from core.modules.drivers.commands.prune_hook_calls.prune_hook_calls_subcommand import PruneHookCallsSubcommand
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.commands.record_hook_call.record_hook_call_handler import RecordHookCallHandler
from core.modules.drivers.commands.hook_call_feed.hook_call_feed_subcommand import HookCallFeedSubcommand
from core.modules.drivers.commands.hook_call_show.hook_call_show_subcommand import HookCallShowSubcommand
from core.modules.drivers.models.hook_call_row import HookCallRow
from core.modules.drivers.guards.driver_setting_guard import DriverSettingGuard
from core.modules.drivers.migrations.m001_drivers import DriversTablesMigration
from core.modules.drivers.migrations.m002_hook_call_updated_input import HookCallUpdatedInputMigration
from core.modules.drivers.migrations.m003_hook_call_hook_index import HookCallHookIndexMigration
from core.modules.drivers.listeners.new_driver_lines_listener import NewDriverLinesListener
from core.modules.drivers.listeners.subagent_stop_listener import SubagentStopListener
from core.modules.drivers.listeners.typed_line_listener import TypedLineListener
from core.modules.drivers.commands.end_silent_helpers.end_silent_helpers_handler import EndSilentHelpersHandler
from core.modules.drivers.support.block_conditions.all_conditions import AllConditions
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.base.driver.conditions.ran_command import RanCommand
from core.base.driver.conditions.read_file import ReadFile
from core.base.driver.conditions.time_reached import TimeReached
from core.modules.drivers.support.block_conditions.agent_resumed import AgentResumed
from core.modules.drivers.support.block_conditions.required_command_closed import RequiredCommandClosed
from core.modules.drivers.support.block_conditions.tool_uses import ToolUses
from core.modules.drivers.support.hook_cost_tool import HookCostTool
from core.modules.drivers.commands.block_until.block_until_handler import BlockUntilHandler
from core.modules.drivers.commands.bind_subagent_dispatch.bind_subagent_dispatch_handler import BindSubagentDispatchHandler
from core.modules.drivers.migrations.m011_dispatch_subagent import DispatchSubagentMigration
from core.modules.drivers.migrations.m012_hook_call_line_changes import HookCallLineChangesMigration
from core.modules.drivers.commands.prune_temp_folders.prune_temp_folders_handler import PruneTempFoldersHandler
from core.modules.drivers.commands.close_agent_block.close_agent_block_handler import CloseAgentBlockHandler
from core.modules.drivers.migrations.m009_agent_blocks import AgentBlocksMigration
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.rules.agent_block_rule import AgentBlockRule
from core.modules.drivers.rules.missing_process_rule import MissingProcessRule
from core.modules.drivers.rules.silent_helper_rule import SilentHelperRule
from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.drivers.migrations.m004_nudge_records import NudgeRecordsMigration
from core.modules.drivers.commands.nudge_list.nudge_list_subcommand import NudgeListSubcommand
from core.modules.drivers.rules.opening_lines_rule import OpeningLinesRule
from core.modules.drivers.rules.takeover_rule import TakeoverRule
from core.modules.drivers.rules.repeated_stop_release_rule import RepeatedStopReleaseRule
from core.modules.drivers.models.rule_history import RuleHistory
from core.modules.drivers.rules.session_end_rule import SessionEndRule
from core.modules.drivers.bindings.setting_essential_allowances import SettingEssentialAllowances
from core.modules.drivers.commands.choose_suite.choose_suite_handler import ChooseSuiteHandler
from core.modules.drivers.commands.choose_suite.choose_suite_subcommand import ChooseSuiteSubcommand
from core.modules.drivers.commands.suite_current.suite_current_subcommand import SuiteCurrentSubcommand
from core.modules.drivers.commands.suite_list.suite_list_subcommand import SuiteListSubcommand
from core.modules.drivers.commands.suite_show.suite_show_subcommand import SuiteShowSubcommand
from core.modules.drivers.commands.suite_layout.suite_layout_subcommand import SuiteLayoutSubcommand
from core.modules.drivers.commands.suite_presets.suite_presets_subcommand import SuitePresetsSubcommand
from core.modules.drivers.bindings.table_hook_history import TableHookHistory
from core.modules.drivers.support.driver_settings import DRIVERS_SETTINGS
from core.modules.drivers.seeders.drivers_seeder import DriversSeeder


class DriversModule(Module):
    """Keeps every hook's decision, the lines waiting for agents and the rules' history, and answers hooks
    through the suites, drivers and rules of the installed modules."""

    name = "journal.core.drivers"
    nudges = DRIVER_NUDGES
    move_reason = "version 4 kept hook records in its own bookkeeping tables, which stay in the backup"
    requires_core = ">=5,<6"
    settings = DRIVERS_SETTINGS
    dependencies = ["journal.core.chat", "journal.core.developer", "journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings"]
    models = [ModelDeclaration(SubagentDispatch, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(RequiredCommand, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(AgentBlock, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(NudgeRecord, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(HookCall, query=HookCallQuery, excluded_subcommands=["make", "edit", "delete", "show"]), ModelDeclaration(AgentLine, commands=[DeliverAgentLine, EnterAgentLine]), ModelDeclaration(RuleHistory, excluded_subcommands=["make", "edit"])]
    views = [HookCallRow]
    migrations = [DriversTablesMigration, HookCallUpdatedInputMigration, HookCallHookIndexMigration, NudgeRecordsMigration, NudgeDebtsMigration, RequiredCommandsMigration, NudgeRecordDeliveryMigration, RequiredCommandTypeMigration, AgentBlocksMigration, SubagentDispatchesMigration, DispatchSubagentMigration, HookCallLineChangesMigration]
    handlers = [BindSubagentDispatchHandler, PruneTempFoldersHandler, RecordSubagentDispatchHandler, BlockUntilHandler, CloseAgentBlockHandler, EndSilentHelpersHandler, CloseRequiredCommandHandler, RecordBypassLineHandler, PauseAgentHandler, ResumeAgentHandler, RecordHookCallHandler, PruneHookCallsHandler, ChooseSuiteHandler, ChooseDriverHandler, AllowEssentialRuleHandler]
    subcommands = [SkipRequiredCommandSubcommand, PauseAgentSubcommand, ResumeAgentSubcommand, NudgeListSubcommand, HookCallFeedSubcommand, HookCallShowSubcommand, PruneHookCallsSubcommand, ChooseSuiteSubcommand, SuiteCurrentSubcommand, SuiteListSubcommand, SuiteShowSubcommand, SuiteLayoutSubcommand, SuitePresetsSubcommand, ChooseDriverSubcommand, DriverShowSubcommand,
                   AllowEssentialRuleSubcommand]
    guards = [DriverSettingGuard]
    listeners = [DispatchMarkListener, RequiredCommandSkipMarkListener, BypassLogListener, HookWaitFileListener, TypedLineListener, NewDriverLinesListener, SubagentStopListener]
    overlays = [PausedOverlay]
    marks = [*BYPASS_MARKS, *DISPATCH_MARKS]
    performance_tools = [HookCostTool]
    block_conditions = [RanCommand, ReadFile, TimeReached, AnyCondition, AllConditions, ToolUses, AgentResumed, RequiredCommandClosed]
    driver_rules = [DispatchMarkRule, RequiredCommandRule, DispatchLawRule, SubagentReuseRule, LongOutputRule, RepeatedStopReleaseRule, SessionEndRule, OpeningLinesRule, MissingProcessRule, SilentHelperRule, AgentBlockRule, TakeoverRule]
    bindings = [(HookHistory, TableHookHistory), (HookRoute, AgentHookRoute), (ChangeFilter, DriverChangeFilter),
                (EssentialAllowances, SettingEssentialAllowances)]
    windows = [WindowDeclaration("drivers.nudges", "Nudges", "nudges.js", WindowLoading.COMPONENT, group="project", icon=WindowIcon.RULE, reads=["nudge list", "nudge-record list"], events=["nudge_record.*"]),
               WindowDeclaration("drivers.hook-calls", "Activity", "hook-calls.js", WindowLoading.COMPONENT, icon=WindowIcon.RUNS, place=WindowPlace.AGENT,
                                 reads=["hook-call feed", "hook-call show"], events=["hook_call.create"])]
    seeders = [DriversSeeder]
