from core.modules.drivers.windows.drivers_windows import DRIVERS_WINDOWS
from core.modules.drivers.models.declarations.countdown_model_declaration import CountdownModelDeclaration
from core.modules.drivers.models.declarations.hook_timeout_notice_model_declaration import HookTimeoutNoticeModelDeclaration
from core.modules.drivers.models.declarations.permission_request_model_declaration import PermissionRequestModelDeclaration
from core.modules.drivers.models.declarations.reminder_pass_model_declaration import ReminderPassModelDeclaration
from core.modules.drivers.models.declarations.refusal_skip_model_declaration import RefusalSkipModelDeclaration
from core.modules.drivers.models.declarations.context_compaction_model_declaration import ContextCompactionModelDeclaration
from core.modules.drivers.models.declarations.context_compaction_notice_model_declaration import ContextCompactionNoticeModelDeclaration
from core.modules.drivers.models.declarations.helper_job_model_declaration import HelperJobModelDeclaration
from core.modules.drivers.models.declarations.agent_block_model_declaration import AgentBlockModelDeclaration
from core.modules.drivers.models.declarations.nudge_record_model_declaration import NudgeRecordModelDeclaration
from core.modules.drivers.models.declarations.hook_call_model_declaration import HookCallModelDeclaration
from core.modules.drivers.models.declarations.agent_line_model_declaration import AgentLineModelDeclaration
from core.modules.drivers.models.declarations.rule_history_model_declaration import RuleHistoryModelDeclaration
from core.modules.drivers.models.declarations.overview_read_model_declaration import OverviewReadModelDeclaration
from engine.driver.states.open_blocks import OpenBlocks
from core.modules.drivers.support.agent_open_blocks import AgentOpenBlocks
from core.modules.drivers.commands.check_suite.check_suite_subcommand import CheckSuiteSubcommand
from core.modules.drivers.migrations.m063_resumed_time_column import ResumedTimeColumnMigration
from core.modules.drivers.migrations.m064_resume_column_repair import ResumeColumnRepairMigration
from core.modules.drivers.migrations.m062_hook_call_answer_time_index import HookCallAnswerTimeIndexMigration
from core.modules.drivers.migrations.m053_permission_request_environment_index import PermissionRequestEnvironmentIndexMigration
from core.modules.drivers.migrations.m052_hook_timeout_notice_agent_index import HookTimeoutNoticeAgentIndexMigration
from core.modules.drivers.migrations.m036_agent_block_key_index import AgentBlockKeyIndexMigration
from core.modules.drivers.migrations.m038_reminder_passes import ReminderPassesMigration
from core.modules.drivers.migrations.m039_helper_job_cost_baseline import HelperJobCostBaselineMigration
from core.modules.drivers.migrations.m050_helper_job_title import HelperJobTitleMigration
from core.modules.drivers.migrations.m051_helper_job_halted_seconds import HelperJobHaltedSecondsMigration
from core.modules.drivers.migrations.m054_helper_job_program import HelperJobProgramMigration
from core.modules.drivers.migrations.m055_helper_job_new_session import HelperJobNewSessionMigration
from core.modules.drivers.migrations.m056_context_compactions import ContextCompactionsMigration
from core.modules.drivers.migrations.m057_context_compaction_wake import ContextCompactionWakeMigration
from core.modules.drivers.migrations.m058_hook_call_environment_index import HookCallEnvironmentIndexMigration
from core.modules.drivers.migrations.m060_hook_call_tool_answer_index import HookCallToolAnswerIndexMigration
from core.modules.drivers.migrations.m061_allowed_hook_call_tool_index import AllowedHookCallToolIndexMigration
from core.modules.drivers.migrations.m059_context_compaction_notices import ContextCompactionNoticesMigration
from core.modules.drivers.commands.report_compaction_fault.report_compaction_fault_handler import ReportCompactionFaultHandler
from core.modules.drivers.commands.record_program_compaction.record_program_compaction_handler import RecordProgramCompactionHandler
from core.modules.drivers.commands.end_program_compaction.end_program_compaction_handler import EndProgramCompactionHandler
from core.modules.drivers.commands.report_compaction_faults.report_compaction_faults_handler import ReportCompactionFaultsHandler
from core.modules.drivers.listeners.compaction_notice_mark_listener import CompactionNoticeMarkListener
from core.modules.drivers.support.compaction_marks import COMPACTION_MARKS
from core.modules.drivers.ticks.compaction_faults_tick import CompactionFaultsTick
from core.modules.agents.support.context_change_requests import ContextChangeRequests
from core.modules.drivers.bindings.recorded_context_change_requests import RecordedContextChangeRequests
from core.modules.drivers.migrations.m040_held_refusal_skips import ConfirmedSkipsMigration
from core.modules.drivers.commands.answer_refusal_skip.answer_refusal_skip_handler import AnswerRefusalSkipHandler
from core.modules.drivers.commands.answer_refusal_skip.confirm_refusal_skip_subcommand import ConfirmRefusalSkipSubcommand
from core.modules.drivers.commands.answer_refusal_skip.cancel_refusal_skip_subcommand import CancelRefusalSkipSubcommand
from core.modules.drivers.commands.judge_refusal_skip.approve_refusal_skip_subcommand import ApproveRefusalSkipSubcommand
from core.modules.drivers.commands.judge_refusal_skip.decline_refusal_skip_subcommand import DeclineRefusalSkipSubcommand
from core.modules.drivers.commands.judge_refusal_skip.judge_refusal_skip_handler import JudgeRefusalSkipHandler
from core.modules.drivers.commands.record_reminder_passes.record_reminder_passes_handler import RecordReminderPassesHandler
from core.modules.drivers.commands.hook_call_stops.hook_call_stops_subcommand import HookCallStopsSubcommand
from core.modules.drivers.migrations.m026_driver_session import DriverSessionMigration
from core.modules.drivers.migrations.m023_agent_line_repeats import AgentLineRepeatsMigration
from core.modules.drivers.migrations.m022_nudge_total_index import NudgeTotalIndexMigration
from core.modules.drivers.migrations.m021_agent_line_text_index import AgentLineTextIndexMigration
from core.modules.drivers.migrations.m020_block_stop_name import BlockStopNameMigration
from core.modules.drivers.migrations.m010_subagent_dispatches import SubagentDispatchesMigration
from core.modules.drivers.migrations.m024_helper_jobs import HelperJobsMigration
from core.modules.drivers.migrations.m025_helper_job_helper_index import HelperJobHelperIndexMigration
from core.modules.drivers.support.dispatch_marks import DISPATCH_MARKS
from core.modules.agents.support.transcript_authors import TranscriptAuthors
from core.modules.drivers.support.line_transcript_authors import LineTranscriptAuthors
from core.modules.drivers.commands.skip_agent_block.skip_agent_block_subcommand import SkipAgentBlockSubcommand
from core.modules.drivers.listeners.agent_block_skip_mark_listener import AgentBlockSkipMarkListener
from core.modules.drivers.migrations.m014_block_graces import BlockGracePeriodsMigration
from core.modules.drivers.migrations.m016_agent_line_wakes import AgentLineWakesMigration
from core.modules.drivers.migrations.m017_stop_blocks import StopBlocksMigration
from core.modules.drivers.migrations.m015_agent_line_state_index import AgentLineStateIndexMigration
from core.modules.drivers.migrations.m005_nudge_debts import NudgeDebtsMigration
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.drivers.ticks.agent_ticks import AgentTicks
from core.modules.drivers.ticks.event_pruning import EventPruning
from core.modules.drivers.ticks.hook_pruning import HookPruning
from core.modules.drivers.ticks.row_pruning import RowPruning
from core.modules.drivers.migrations.m006_required_commands import RequiredCommandsMigration
from core.modules.drivers.migrations.m007_nudge_record_delivery import NudgeRecordDeliveryMigration
from core.modules.drivers.migrations.m045_hook_timeout_notices import HookTimeoutNoticesMigration
from core.modules.drivers.listeners.hook_timeout_mark_listener import HookTimeoutMarkListener
from core.modules.drivers.migrations.m008_required_command_type import RequiredCommandTypeMigration
from core.modules.drivers.support.driver_nudges import DRIVER_NUDGES
from engine.driver.essential_allowances import EssentialAllowances
from engine.driver.hook_history import HookHistory
from engine.driver.refusal_skips import RefusalSkips
from engine.driver.nudger import Nudger
from core.modules.drivers.bindings.table_refusal_skips import TableRefusalSkips
from core.modules.drivers.bindings.agent_line_nudger import AgentLineNudger
from core.modules.drivers.commands.restore_refusal_skip.restore_refusal_skip_handler import RestoreRefusalSkipHandler
from core.modules.drivers.commands.restore_refusal_skip.restore_refusal_skip_subcommand import RestoreRefusalSkipSubcommand
from core.modules.drivers.commands.skip_refusal.skip_refusal_handler import SkipRefusalHandler
from core.modules.drivers.commands.skip_refusal.skip_refusal_subcommand import SkipRefusalSubcommand
from core.modules.drivers.commands.use_refusal_skip.use_refusal_skip_handler import UseRefusalSkipHandler
from core.modules.drivers.migrations.m029_refusal_skips import SkippedRefusalsTableMigration
from core.modules.drivers.migrations.m032_helper_job_sources import HelperJobSourcesMigration
from core.modules.drivers.migrations.m033_helper_job_new_agent_reason import HelperJobNewAgentReasonMigration
from core.modules.drivers.migrations.m034_helper_job_reason_name import HelperJobReasonNameMigration
from core.modules.drivers.migrations.m035_helper_job_review_plan import HelperJobReviewPlanMigration
from core.modules.drivers.migrations.m037_agent_line_nudge import AgentLineNudgeMigration
from core.modules.drivers.migrations.m030_hook_call_partial_indexes import HookCallPartialIndexesMigration
from engine.listener.change_filter import ChangeFilter
from engine.driver.hook_route import HookRoute
from engine.module.module import Module
from core.modules.drivers.bindings.agent_hook_route import AgentHookRoute
from core.modules.drivers.commands.pause_agent.pause_agent_subcommand import PauseAgentSubcommand
from core.modules.drivers.commands.pause_agent.pause_agent_handler import PauseAgentHandler
from core.modules.drivers.commands.resume_agent.resume_agent_subcommand import ResumeAgentSubcommand
from core.modules.drivers.commands.resume_agent.resume_agent_handler import ResumeAgentHandler
from core.modules.drivers.rules.long_output_rule import LongOutputRule
from core.modules.drivers.rules.repeated_file_read_rule import RepeatedFileReadRule
from core.modules.drivers.rules.foreign_hooks_rule import ForeignHooksRule
from core.modules.drivers.listeners.manage_hooks_listener import ManageHooksListener
from engine.provider.managed_hook_history_reader import ManagedHookHistoryReader
from core.modules.drivers.queries.managed_hook_history_query import ManagedHookHistoryQuery
from core.modules.drivers.overlays.paused_overlay import PausedOverlay
from core.modules.drivers.listeners.bypass_log_listener import BypassLogListener
from core.modules.drivers.listeners.deferred_rules_listener import DeferredRulesListener
from core.modules.drivers.commands.record_bypass_line.record_bypass_line_handler import RecordBypassLineHandler
from core.modules.drivers.commands.record_hook_timeout.record_hook_timeout_handler import RecordHookTimeoutHandler
from core.modules.drivers.commands.record_missing_prompt.record_missing_prompt_handler import RecordMissingPromptHandler
from core.modules.drivers.support.bypass_marks import BYPASS_MARKS
from core.modules.drivers.listeners.hook_wait_file_listener import HookWaitFileListener
from core.modules.drivers.commands.record_agent_notice.record_agent_notice_handler import RecordAgentNoticeHandler
from core.modules.drivers.commands.record_agent_nudge.record_agent_nudge_handler import RecordAgentNudgeHandler
from core.modules.drivers.commands.send_journal_started_line.send_journal_started_line_handler import SendJournalStartedLineHandler
from core.modules.drivers.listeners.claimed_line_release_listener import ClaimedLineReleaseListener
from core.modules.drivers.listeners.journal_started_listener import JournalStartedListener
from core.modules.drivers.listeners.stop_line_typing_listener import StopLineTypingListener
from core.modules.drivers.commands.allow_essential_rule.allow_essential_rule_handler import AllowEssentialRuleHandler
from core.modules.drivers.commands.allow_essential_rule.allow_essential_rule_subcommand import AllowEssentialRuleSubcommand
from core.modules.drivers.bindings.driver_change_filter import DriverChangeFilter
from core.modules.drivers.commands.choose_driver.choose_driver_handler import ChooseDriverHandler
from core.modules.drivers.commands.choose_driver.choose_driver_subcommand import ChooseDriverSubcommand
from core.modules.drivers.commands.driver_show.driver_show_subcommand import DriverShowSubcommand
from core.modules.drivers.commands.driver_state_types.driver_state_types_subcommand import DriverStateTypesSubcommand
from core.modules.drivers.commands.driver_states.driver_states_subcommand import DriverStatesSubcommand
from core.modules.drivers.commands.prune_events.prune_events_handler import PruneEventsHandler
from core.modules.drivers.commands.prune_events.prune_events_subcommand import PruneEventsSubcommand
from core.modules.drivers.commands.record_hook_call.record_hook_call_handler import RecordHookCallHandler
from core.modules.drivers.commands.hook_call_feed.hook_call_feed_subcommand import HookCallFeedSubcommand
from core.modules.drivers.commands.hook_call_show.hook_call_show_subcommand import HookCallShowSubcommand
from core.modules.drivers.models.hook_call_row import HookCallRow
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.models.nudge_total import NudgeTotal
from core.modules.drivers.guards.driver_setting_guard import DriverSettingGuard
from core.modules.drivers.migrations.m001_drivers import DriversTablesMigration
from core.modules.drivers.migrations.m002_hook_call_updated_input import HookCallUpdatedInputMigration
from core.modules.drivers.migrations.m003_hook_call_hook_index import HookCallHookIndexMigration
from core.modules.drivers.listeners.new_driver_lines_listener import NewDriverLinesListener
from core.modules.drivers.listeners.typed_line_listener import TypedLineListener
from core.modules.drivers.migrations.m041_permission_requests import PermissionRequestsMigration
from core.modules.drivers.migrations.m042_hook_call_read_indexes import HookCallReadIndexesMigration
from core.modules.drivers.migrations.m043_foreign_run_index import ForeignRunIndexMigration
from core.modules.drivers.migrations.m044_refusal_skip_approval import SkipApprovalMigration
from core.modules.drivers.migrations.m046_overview_reads import OverviewReadsMigration
from core.modules.drivers.commands.record_overview_read.record_overview_read_handler import RecordOverviewReadHandler
from core.modules.drivers.support.table_overview_reads import TableOverviewReads
from engine.subcommand.overview_reads import OverviewReads
from core.modules.drivers.commands.ask_permission.ask_permission_handler import AskPermissionHandler
from core.modules.drivers.commands.ask_permission.ask_permission_subcommand import AskPermissionSubcommand
from core.modules.drivers.commands.allow_permission.allow_permission_handler import AllowPermissionHandler
from core.modules.drivers.commands.allow_permission.allow_permission_subcommand import AllowPermissionSubcommand
from core.modules.drivers.commands.decline_permission.decline_permission_handler import DeclinePermissionHandler
from core.modules.drivers.commands.decline_permission.decline_permission_subcommand import DeclinePermissionSubcommand
from core.modules.drivers.commands.use_permission.use_permission_handler import UsePermissionHandler
from core.modules.drivers.commands.type_waiting_lines.type_waiting_lines_handler import TypeWaitingLinesHandler
from core.modules.drivers.commands.wake_compacted_agent.wake_compacted_agent_handler import WakeCompactedAgentHandler
from core.modules.drivers.commands.wake_inactive_agent.wake_inactive_agent_handler import WakeInactiveAgentHandler
from core.modules.drivers.commands.wake_interrupted_agent.wake_interrupted_agent_handler import WakeInterruptedAgentHandler
from core.modules.drivers.ticks.interrupted_agent_wake import InterruptedAgentWake
from core.modules.drivers.commands.wake_safeguards_stopped_agent.wake_safeguards_stopped_agent_handler import WakeSafeguardsStoppedAgentHandler
from core.modules.drivers.rules.safeguards_stop_rule import SafeguardsStopRule
from core.modules.drivers.commands.end_silent_helpers.end_silent_helpers_handler import EndSilentHelpersHandler
from core.modules.drivers.support.block_conditions.all_conditions import AllConditions
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from engine.driver.conditions.ran_command import RanCommand
from engine.driver.conditions.read_file import ReadFile
from engine.driver.conditions.time_reached import TimeReached
from core.modules.drivers.support.block_conditions.agent_resumed import AgentResumed
from core.modules.drivers.support.block_conditions.tool_uses import ToolUses
from core.modules.drivers.support.hook_cost_tool import HookCostTool
from core.modules.drivers.commands.block_until.block_until_handler import BlockUntilHandler
from core.modules.drivers.migrations.m011_dispatch_subagent import DispatchSubagentMigration
from core.modules.drivers.migrations.m012_hook_call_line_changes import HookCallLineChangesMigration
from core.modules.drivers.migrations.m013_hook_call_time_indexes import HookCallTimeIndexesMigration
from core.modules.drivers.commands.prune_temp_folders.prune_temp_folders_handler import PruneTempFoldersHandler
from core.modules.drivers.commands.prune_runtime_folders.prune_runtime_folders_handler import PruneRuntimeFoldersHandler
from core.modules.drivers.commands.close_agent_block.close_agent_block_handler import CloseAgentBlockHandler
from core.modules.drivers.commands.close_agent_blocks.close_agent_blocks_handler import CloseAgentBlocksHandler
from core.modules.drivers.migrations.m009_agent_blocks import AgentBlocksMigration
from core.modules.drivers.migrations.m018_strict_blocks import StrictBlocksMigration
from core.modules.drivers.migrations.m019_hook_change_names import HookChangeNamesMigration
from core.modules.drivers.migrations.m031_helper_job_created_index import HelperJobCreatedIndexMigration
from core.modules.drivers.migrations.m027_helper_jobs_closed import HelperJobsClosedMigration
from core.modules.drivers.rules.agent_block_rule import AgentBlockRule
from core.modules.drivers.ticks.end_silent_helpers_tick import EndSilentHelpersTick
from core.modules.drivers.rules.access_rule import AccessRule
from core.modules.drivers.rules.type_commands_rule import TypeCommandsRule
from core.modules.drivers.support.agent_line_check import AgentLineCheck
from engine.cli.caller_line_check import CallerLineCheck
from core.modules.drivers.rules.native_subagent_rule import NativeSubagentRule
from core.modules.drivers.rules.private_corpus_rule import PrivateCorpusRule
from core.modules.drivers.rules.panic_file_rule import PanicFileRule
from core.modules.drivers.ticks.panic_watch import PanicWatch
from core.modules.drivers.ticks.released_session_wake import ReleasedSessionWake
from core.modules.drivers.migrations.m004_nudge_records import NudgeRecordsMigration
from core.modules.drivers.migrations.m028_read_indexes import ReadIndexesMigration
from core.modules.drivers.migrations.m047_plain_column_names import PlainColumnNamesMigration
from core.modules.drivers.migrations.m048_countdowns import CountdownsMigration
from core.modules.drivers.migrations.m049_countdown_limit_name import CountdownCapNameMigration
from core.modules.drivers.commands.nudge_list.nudge_list_subcommand import NudgeListSubcommand
from core.modules.drivers.rules.opening_lines_rule import OpeningLinesRule
from core.modules.drivers.rules.continued_session_rule import ContinuedSessionRule
from core.modules.drivers.rules.takeover_rule import TakeoverRule
from core.modules.drivers.rules.block_stop_rule import BlockStopRule
from core.modules.drivers.rules.repeated_stop_release_rule import RepeatedStopReleaseRule
from core.modules.drivers.rules.compaction_due_stop_rule import CompactionDueStopRule
from core.modules.drivers.rules.session_end_rule import SessionEndRule
from core.modules.drivers.bindings.setting_essential_allowances import SettingEssentialAllowances
from core.modules.drivers.commands.choose_suite.choose_suite_handler import ChooseSuiteHandler
from core.modules.drivers.commands.choose_suite.choose_suite_subcommand import ChooseSuiteSubcommand
from core.modules.drivers.commands.suite_current.suite_current_subcommand import SuiteCurrentSubcommand
from core.modules.drivers.commands.environment_menu.environment_menu_subcommand import EnvironmentMenuSubcommand
from core.modules.drivers.models.environment_menu_row import EnvironmentMenuRow
from core.modules.drivers.commands.suite_list.suite_list_subcommand import SuiteListSubcommand
from core.modules.drivers.commands.suite_show.suite_show_subcommand import SuiteShowSubcommand
from core.modules.drivers.commands.suite_layout.suite_layout_subcommand import SuiteLayoutSubcommand
from core.modules.drivers.commands.suite_presets.suite_presets_subcommand import SuitePresetsSubcommand
from core.modules.drivers.bindings.table_hook_history import TableHookHistory
from core.modules.drivers.bindings.board_state_openness import BoardStateOpenness
from engine.listener.commit.agent_state_openness import AgentStateOpenness
from core.modules.drivers.commands.send_exception_line.send_exception_line_handler import SendExceptionLineHandler
from core.modules.drivers.commands.record_agent_launch_failure.record_agent_launch_failure_handler import RecordAgentLaunchFailureHandler
from core.modules.drivers.listeners.instruction_imports_listener import InstructionImportsListener
from core.modules.drivers.support.driver_settings import DRIVERS_SETTINGS
from core.modules.drivers.support.reviewer_start import REVIEWER_PROFILE


class DriversModule(Module):
    """Keeps every hook's decision, the lines waiting for agents and the rules' history, and answers hooks
    through the suites, drivers and rules of the installed modules."""

    name = "journal.core.drivers"
    nudges = DRIVER_NUDGES
    profiles = [REVIEWER_PROFILE]
    move_reason = "version 4 kept hook records in its own bookkeeping tables, which stay in the backup"
    requires_engine = ">=5,<6"
    settings = DRIVERS_SETTINGS
    dependencies = ["journal.core.chat", "journal.core.developer", "journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings", "journal.core.profiles"]
    models = [CountdownModelDeclaration, HookTimeoutNoticeModelDeclaration, PermissionRequestModelDeclaration, ReminderPassModelDeclaration, RefusalSkipModelDeclaration, ContextCompactionModelDeclaration, ContextCompactionNoticeModelDeclaration, HelperJobModelDeclaration, AgentBlockModelDeclaration, NudgeRecordModelDeclaration, HookCallModelDeclaration, AgentLineModelDeclaration, RuleHistoryModelDeclaration, OverviewReadModelDeclaration]
    views = [HookCallRow, NudgeTotal, AgentActivity, EnvironmentMenuRow]
    migrations = [AllowedHookCallToolIndexMigration, HookCallToolAnswerIndexMigration, ContextCompactionNoticesMigration, HookCallEnvironmentIndexMigration, ContextCompactionWakeMigration, ContextCompactionsMigration, HelperJobNewSessionMigration, HelperJobProgramMigration, PermissionRequestEnvironmentIndexMigration, HookTimeoutNoticeAgentIndexMigration, HelperJobHaltedSecondsMigration, HelperJobTitleMigration, CountdownsMigration, CountdownCapNameMigration, PlainColumnNamesMigration, HookTimeoutNoticesMigration, SkipApprovalMigration, ForeignRunIndexMigration, HookCallReadIndexesMigration, PermissionRequestsMigration, ConfirmedSkipsMigration, HelperJobCostBaselineMigration, ReminderPassesMigration, AgentBlockKeyIndexMigration, AgentLineNudgeMigration, HelperJobReviewPlanMigration, HelperJobReasonNameMigration, HelperJobNewAgentReasonMigration, HelperJobSourcesMigration, HelperJobCreatedIndexMigration, HelperJobsClosedMigration, DriverSessionMigration, HelperJobHelperIndexMigration, HelperJobsMigration, AgentLineRepeatsMigration, NudgeTotalIndexMigration, AgentLineTextIndexMigration, BlockStopNameMigration, StrictBlocksMigration, HookChangeNamesMigration, StopBlocksMigration, DriversTablesMigration, HookCallUpdatedInputMigration, HookCallHookIndexMigration, NudgeRecordsMigration, NudgeDebtsMigration, RequiredCommandsMigration, NudgeRecordDeliveryMigration, RequiredCommandTypeMigration, AgentBlocksMigration, SubagentDispatchesMigration, DispatchSubagentMigration, HookCallLineChangesMigration, HookCallTimeIndexesMigration, BlockGracePeriodsMigration, AgentLineStateIndexMigration, AgentLineWakesMigration, ReadIndexesMigration, SkippedRefusalsTableMigration, HookCallPartialIndexesMigration, OverviewReadsMigration, HookCallAnswerTimeIndexMigration, ResumedTimeColumnMigration, ResumeColumnRepairMigration]
    handlers = [RecordProgramCompactionHandler, EndProgramCompactionHandler, ReportCompactionFaultsHandler, ReportCompactionFaultHandler, SendExceptionLineHandler, RecordAgentLaunchFailureHandler, JudgeRefusalSkipHandler, RecordHookTimeoutHandler, AskPermissionHandler, AllowPermissionHandler, DeclinePermissionHandler, UsePermissionHandler, WakeInterruptedAgentHandler, WakeCompactedAgentHandler, WakeInactiveAgentHandler, TypeWaitingLinesHandler, AnswerRefusalSkipHandler, RecordReminderPassesHandler, RecordAgentNoticeHandler, RecordAgentNudgeHandler, SkipRefusalHandler, UseRefusalSkipHandler, RestoreRefusalSkipHandler, SendJournalStartedLineHandler, PruneTempFoldersHandler, PruneRuntimeFoldersHandler, BlockUntilHandler, CloseAgentBlockHandler, CloseAgentBlocksHandler, EndSilentHelpersHandler, RecordBypassLineHandler, RecordMissingPromptHandler, PauseAgentHandler, ResumeAgentHandler, RecordHookCallHandler, PruneEventsHandler, ChooseSuiteHandler, ChooseDriverHandler, AllowEssentialRuleHandler, RecordOverviewReadHandler, WakeSafeguardsStoppedAgentHandler]
    subcommands = [CheckSuiteSubcommand, ApproveRefusalSkipSubcommand, DeclineRefusalSkipSubcommand, AskPermissionSubcommand, AllowPermissionSubcommand, DeclinePermissionSubcommand, ConfirmRefusalSkipSubcommand, CancelRefusalSkipSubcommand, HookCallStopsSubcommand, EnvironmentMenuSubcommand, SkipRefusalSubcommand, RestoreRefusalSkipSubcommand, SkipAgentBlockSubcommand,PauseAgentSubcommand, ResumeAgentSubcommand, NudgeListSubcommand, HookCallFeedSubcommand, HookCallShowSubcommand, PruneEventsSubcommand, ChooseSuiteSubcommand, SuiteCurrentSubcommand, SuiteListSubcommand, SuiteShowSubcommand, SuiteLayoutSubcommand, SuitePresetsSubcommand, ChooseDriverSubcommand, DriverShowSubcommand, DriverStatesSubcommand, DriverStateTypesSubcommand,
                   AllowEssentialRuleSubcommand]
    guards = [DriverSettingGuard]
    listeners = [CompactionNoticeMarkListener, InstructionImportsListener, HookTimeoutMarkListener, JournalStartedListener, ManageHooksListener, AgentBlockSkipMarkListener, BypassLogListener, DeferredRulesListener, HookWaitFileListener, TypedLineListener, StopLineTypingListener, ClaimedLineReleaseListener, NewDriverLinesListener]
    overlays = [PausedOverlay]
    marks = [*BYPASS_MARKS, *DISPATCH_MARKS, *COMPACTION_MARKS]
    performance_tools = [HookCostTool]
    tick_handlers = [TickHandler(TickInterval(seconds=3), InterruptedAgentWake(), "interrupted agents"), TickHandler(TickInterval(seconds=60), AgentTicks(), "agent ticks", starts_immediately=True), TickHandler(TickInterval(seconds=60), EndSilentHelpersTick(), "silent helpers"), TickHandler(TickInterval(seconds=60), CompactionFaultsTick(), "compaction faults"), TickHandler(TickInterval(seconds=2), PanicWatch(), "panic watch"), TickHandler(TickInterval(seconds=5), ReleasedSessionWake(), "held session wake"),
                     TickHandler(TickInterval(seconds=60 * 60), HookPruning(), "hook pruning"), TickHandler(TickInterval(seconds=60), RowPruning(), "row pruning"),
                     TickHandler(TickInterval(seconds=5), EventPruning(), "event pruning")]
    block_conditions = [RanCommand, ReadFile, TimeReached, AnyCondition, AllConditions, ToolUses, AgentResumed]
    driver_rules = [RepeatedFileReadRule, SafeguardsStopRule, PanicFileRule, BlockStopRule, LongOutputRule, ForeignHooksRule, CompactionDueStopRule, RepeatedStopReleaseRule, SessionEndRule, OpeningLinesRule, ContinuedSessionRule, AgentBlockRule, TakeoverRule, AccessRule, TypeCommandsRule, NativeSubagentRule, PrivateCorpusRule]
    bindings = {OpenBlocks: AgentOpenBlocks, CallerLineCheck: AgentLineCheck, ContextChangeRequests: RecordedContextChangeRequests, Nudger: AgentLineNudger, OverviewReads: TableOverviewReads, RefusalSkips: TableRefusalSkips, ManagedHookHistoryReader: ManagedHookHistoryQuery, TranscriptAuthors: LineTranscriptAuthors, HookHistory: TableHookHistory, AgentStateOpenness: BoardStateOpenness,HookRoute: AgentHookRoute, ChangeFilter: DriverChangeFilter,
                EssentialAllowances: SettingEssentialAllowances}
    windows = DRIVERS_WINDOWS
    seed_reason = "each suite chooses the drivers used by its demo"
