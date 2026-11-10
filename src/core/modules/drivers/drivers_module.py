from core.modules.drivers.migrations.m053_permission_request_environment_index import PermissionRequestEnvironmentIndexMigration
from core.modules.drivers.migrations.m052_hook_timeout_notice_agent_index import HookTimeoutNoticeAgentIndexMigration
from core.modules.drivers.migrations.m036_agent_block_key_index import AgentBlockKeyIndexMigration
from core.modules.drivers.migrations.m038_reminder_passes import ReminderPassesMigration
from core.modules.drivers.migrations.m039_helper_job_cost_baseline import HelperJobCostBaselineMigration
from core.modules.drivers.migrations.m050_helper_job_title import HelperJobTitleMigration
from core.modules.drivers.migrations.m051_helper_job_halted_seconds import HelperJobHaltedSecondsMigration
from core.modules.drivers.migrations.m040_held_refusal_skips import ConfirmedSkipsMigration
from core.modules.drivers.commands.answer_refusal_skip.answer_refusal_skip_handler import AnswerRefusalSkipHandler
from core.modules.drivers.commands.answer_refusal_skip.confirm_refusal_skip_subcommand import ConfirmRefusalSkipSubcommand
from core.modules.drivers.commands.answer_refusal_skip.cancel_refusal_skip_subcommand import CancelRefusalSkipSubcommand
from core.modules.drivers.commands.judge_refusal_skip.approve_refusal_skip_subcommand import ApproveRefusalSkipSubcommand
from core.modules.drivers.commands.judge_refusal_skip.decline_refusal_skip_subcommand import DeclineRefusalSkipSubcommand
from core.modules.drivers.commands.judge_refusal_skip.judge_refusal_skip_handler import JudgeRefusalSkipHandler
from core.modules.drivers.commands.record_reminder_passes.record_reminder_passes_handler import RecordReminderPassesHandler
from core.modules.drivers.models.reminder_pass import ReminderPass
from core.modules.drivers.commands.hook_call_stops.hook_call_stops_subcommand import HookCallStopsSubcommand
from core.modules.drivers.migrations.m026_driver_session import DriverSessionMigration
from core.modules.drivers.migrations.m023_agent_line_repeats import AgentLineRepeatsMigration
from core.modules.drivers.migrations.m022_nudge_total_index import NudgeTotalIndexMigration
from core.modules.drivers.migrations.m021_agent_line_text_index import AgentLineTextIndexMigration
from core.modules.drivers.migrations.m020_block_stop_name import BlockStopNameMigration
from core.modules.drivers.migrations.m010_subagent_dispatches import SubagentDispatchesMigration
from core.modules.drivers.migrations.m024_helper_jobs import HelperJobsMigration
from core.modules.drivers.migrations.m025_helper_job_helper_index import HelperJobHelperIndexMigration
from core.modules.drivers.models.helper_job import HelperJob
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
from core.modules.drivers.migrations.m006_required_commands import RequiredCommandsMigration
from core.modules.drivers.migrations.m007_nudge_record_delivery import NudgeRecordDeliveryMigration
from core.modules.drivers.migrations.m045_hook_timeout_notices import HookTimeoutNoticesMigration
from core.modules.drivers.listeners.hook_timeout_mark_listener import HookTimeoutMarkListener
from core.modules.drivers.models.hook_timeout_notice import HookTimeoutNotice
from core.modules.drivers.migrations.m008_required_command_type import RequiredCommandTypeMigration
from core.modules.drivers.support.driver_nudges import DRIVER_NUDGES
from engine.driver.essential_allowances import EssentialAllowances
from engine.driver.hook_history import HookHistory
from engine.driver.refusal_skips import RefusalSkips
from core.modules.drivers.bindings.table_refusal_skips import TableRefusalSkips
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
from core.modules.drivers.models.refusal_skip import RefusalSkip
from engine.guard.change_filter import ChangeFilter
from engine.driver.hook_route import HookRoute
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.viewer.window_icon import WindowIcon
from engine.viewer.window_loading import WindowLoading
from engine.viewer.window_shows import WindowShows
from core.modules.drivers.bindings.agent_hook_route import AgentHookRoute
from core.modules.drivers.commands.pause_agent.pause_agent_subcommand import PauseAgentSubcommand
from core.modules.drivers.commands.pause_agent.pause_agent_handler import PauseAgentHandler
from core.modules.drivers.commands.resume_agent.resume_agent_subcommand import ResumeAgentSubcommand
from core.modules.drivers.commands.resume_agent.resume_agent_handler import ResumeAgentHandler
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.rules.long_output_rule import LongOutputRule
from core.modules.drivers.rules.repeated_file_read_rule import RepeatedFileReadRule
from core.modules.drivers.rules.foreign_hooks_rule import ForeignHooksRule
from core.modules.drivers.listeners.manage_hooks_listener import ManageHooksListener
from engine.provider.managed_hook_history_reader import ManagedHookHistoryReader
from core.modules.drivers.queries.managed_hook_history_query import ManagedHookHistoryQuery
from core.modules.drivers.overlays.paused_overlay import PausedOverlay
from core.modules.drivers.listeners.bypass_log_listener import BypassLogListener
from core.modules.drivers.commands.record_bypass_line.record_bypass_line_handler import RecordBypassLineHandler
from core.modules.drivers.commands.record_hook_timeout.record_hook_timeout_handler import RecordHookTimeoutHandler
from core.modules.drivers.commands.record_missing_prompt.record_missing_prompt_handler import RecordMissingPromptHandler
from core.modules.drivers.support.bypass_marks import BYPASS_MARKS
from core.modules.drivers.listeners.hook_wait_file_listener import HookWaitFileListener
from core.modules.drivers.commands.deliver_agent_line.deliver_agent_line import DeliverAgentLine
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.commands.claim_agent_line.claim_agent_line import ClaimAgentLine
from core.modules.drivers.commands.release_agent_line.release_agent_line import ReleaseAgentLine
from core.modules.drivers.commands.drop_agent_line.remove_agent_line import RemoveAgentLine
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
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.commands.prune_events.prune_events_handler import PruneEventsHandler
from core.modules.drivers.commands.prune_events.prune_events_subcommand import PruneEventsSubcommand
from core.modules.drivers.commands.prune_hook_calls.prune_hook_calls_handler import PruneHookCallsHandler
from core.modules.drivers.commands.prune_hook_calls.prune_hook_calls_subcommand import PruneHookCallsSubcommand
from core.modules.drivers.queries.hook_call_query import HookCallQuery
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
from core.modules.drivers.models.permission_request import PermissionRequest
from core.modules.drivers.migrations.m041_permission_requests import PermissionRequestsMigration
from core.modules.drivers.migrations.m042_hook_call_read_indexes import HookCallReadIndexesMigration
from core.modules.drivers.migrations.m043_foreign_run_index import ForeignRunIndexMigration
from core.modules.drivers.migrations.m044_refusal_skip_approval import SkipApprovalMigration
from core.modules.drivers.migrations.m046_overview_reads import OverviewReadsMigration
from core.modules.drivers.models.overview_read import OverviewRead
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
from core.modules.drivers.commands.close_agent_block.close_agent_block_handler import CloseAgentBlockHandler
from core.modules.drivers.migrations.m009_agent_blocks import AgentBlocksMigration
from core.modules.drivers.migrations.m018_strict_blocks import StrictBlocksMigration
from core.modules.drivers.migrations.m019_hook_change_names import HookChangeNamesMigration
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.migrations.m031_helper_job_created_index import HelperJobCreatedIndexMigration
from core.modules.drivers.migrations.m027_helper_jobs_closed import HelperJobsClosedMigration
from core.modules.drivers.rules.agent_block_rule import AgentBlockRule
from core.modules.drivers.ticks.end_silent_helpers_tick import EndSilentHelpersTick
from core.modules.drivers.rules.access_rule import AccessRule
from core.modules.drivers.rules.native_subagent_rule import NativeSubagentRule
from core.modules.drivers.rules.private_corpus_rule import PrivateCorpusRule
from core.modules.drivers.rules.panic_file_rule import PanicFileRule
from core.modules.drivers.ticks.panic_watch import PanicWatch
from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.drivers.migrations.m004_nudge_records import NudgeRecordsMigration
from core.modules.drivers.migrations.m028_read_indexes import ReadIndexesMigration
from core.modules.drivers.migrations.m047_plain_column_names import PlainColumnNamesMigration
from core.modules.drivers.migrations.m048_countdowns import CountdownsMigration
from core.modules.drivers.migrations.m049_countdown_limit_name import CountdownLimitNameMigration
from core.modules.drivers.models.countdown import Countdown
from core.modules.drivers.commands.nudge_list.nudge_list_subcommand import NudgeListSubcommand
from core.modules.drivers.rules.opening_lines_rule import OpeningLinesRule
from core.modules.drivers.rules.continued_session_rule import ContinuedSessionRule
from core.modules.drivers.rules.takeover_rule import TakeoverRule
from core.modules.drivers.rules.block_stop_rule import BlockStopRule
from core.modules.drivers.rules.repeated_stop_release_rule import RepeatedStopReleaseRule
from core.modules.drivers.models.rule_history import RuleHistory
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
from core.modules.drivers.bindings.suite_agent_policy import SuiteAgentPolicy
from core.modules.drivers.commands.send_exception_line.send_exception_line_handler import SendExceptionLineHandler
from core.modules.drivers.commands.record_agent_launch_failure.record_agent_launch_failure_handler import RecordAgentLaunchFailureHandler
from core.modules.drivers.listeners.instruction_imports_listener import InstructionImportsListener
from core.modules.agents.support.current_agent_policy import CurrentAgentPolicy
from core.modules.drivers.support.driver_settings import DRIVERS_SETTINGS
from core.modules.drivers.support.skeletons import DRIVERS_NUDGES_SKELETON, DRIVERS_HOOK_CALLS_SKELETON


class DriversModule(Module):
    """Keeps every hook's decision, the lines waiting for agents and the rules' history, and answers hooks
    through the suites, drivers and rules of the installed modules."""

    name = "journal.core.drivers"
    nudges = DRIVER_NUDGES
    move_reason = "version 4 kept hook records in its own bookkeeping tables, which stay in the backup"
    requires_core = ">=5,<6"
    settings = DRIVERS_SETTINGS
    dependencies = ["journal.core.chat", "journal.core.developer", "journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings", "journal.core.profiles"]
    models = [ModelDeclaration(Countdown, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(HookTimeoutNotice, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(PermissionRequest, excluded_subcommands=["make", "edit", "delete", "allow", "decline", "use"]), ModelDeclaration(ReminderPass, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(RefusalSkip, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(HelperJob, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(AgentBlock, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(NudgeRecord, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(HookCall, query=HookCallQuery, excluded_subcommands=["make", "edit", "delete", "show"]), ModelDeclaration(AgentLine, commands=[DeliverAgentLine, ClaimAgentLine, ReleaseAgentLine, EnterAgentLine, RemoveAgentLine]), ModelDeclaration(RuleHistory, excluded_subcommands=["make", "edit"]), ModelDeclaration(OverviewRead, excluded_subcommands=["make", "edit", "delete"])]
    views = [HookCallRow, NudgeTotal, AgentActivity, EnvironmentMenuRow]
    migrations = [PermissionRequestEnvironmentIndexMigration, HookTimeoutNoticeAgentIndexMigration, HelperJobHaltedSecondsMigration, HelperJobTitleMigration, CountdownsMigration, CountdownLimitNameMigration, PlainColumnNamesMigration, HookTimeoutNoticesMigration, SkipApprovalMigration, ForeignRunIndexMigration, HookCallReadIndexesMigration, PermissionRequestsMigration, ConfirmedSkipsMigration, HelperJobCostBaselineMigration, ReminderPassesMigration, AgentBlockKeyIndexMigration, AgentLineNudgeMigration, HelperJobReviewPlanMigration, HelperJobReasonNameMigration, HelperJobNewAgentReasonMigration, HelperJobSourcesMigration, HelperJobCreatedIndexMigration, HelperJobsClosedMigration, DriverSessionMigration, HelperJobHelperIndexMigration, HelperJobsMigration, AgentLineRepeatsMigration, NudgeTotalIndexMigration, AgentLineTextIndexMigration, BlockStopNameMigration, StrictBlocksMigration, HookChangeNamesMigration, StopBlocksMigration, DriversTablesMigration, HookCallUpdatedInputMigration, HookCallHookIndexMigration, NudgeRecordsMigration, NudgeDebtsMigration, RequiredCommandsMigration, NudgeRecordDeliveryMigration, RequiredCommandTypeMigration, AgentBlocksMigration, SubagentDispatchesMigration, DispatchSubagentMigration, HookCallLineChangesMigration, HookCallTimeIndexesMigration, BlockGracePeriodsMigration, AgentLineStateIndexMigration, AgentLineWakesMigration, ReadIndexesMigration, SkippedRefusalsTableMigration, HookCallPartialIndexesMigration, OverviewReadsMigration]
    handlers = [SendExceptionLineHandler, RecordAgentLaunchFailureHandler, JudgeRefusalSkipHandler, RecordHookTimeoutHandler, AskPermissionHandler, AllowPermissionHandler, DeclinePermissionHandler, UsePermissionHandler, WakeInterruptedAgentHandler, WakeCompactedAgentHandler, WakeInactiveAgentHandler, TypeWaitingLinesHandler, AnswerRefusalSkipHandler, RecordReminderPassesHandler, RecordAgentNoticeHandler, RecordAgentNudgeHandler, SkipRefusalHandler, UseRefusalSkipHandler, RestoreRefusalSkipHandler, SendJournalStartedLineHandler, PruneTempFoldersHandler, BlockUntilHandler, CloseAgentBlockHandler, EndSilentHelpersHandler, RecordBypassLineHandler, RecordMissingPromptHandler, PauseAgentHandler, ResumeAgentHandler, RecordHookCallHandler, PruneHookCallsHandler, PruneEventsHandler, ChooseSuiteHandler, ChooseDriverHandler, AllowEssentialRuleHandler, RecordOverviewReadHandler, WakeSafeguardsStoppedAgentHandler]
    subcommands = [ApproveRefusalSkipSubcommand, DeclineRefusalSkipSubcommand, AskPermissionSubcommand, AllowPermissionSubcommand, DeclinePermissionSubcommand, ConfirmRefusalSkipSubcommand, CancelRefusalSkipSubcommand, HookCallStopsSubcommand, EnvironmentMenuSubcommand, SkipRefusalSubcommand, RestoreRefusalSkipSubcommand, SkipAgentBlockSubcommand,PauseAgentSubcommand, ResumeAgentSubcommand, NudgeListSubcommand, HookCallFeedSubcommand, HookCallShowSubcommand, PruneHookCallsSubcommand, PruneEventsSubcommand, ChooseSuiteSubcommand, SuiteCurrentSubcommand, SuiteListSubcommand, SuiteShowSubcommand, SuiteLayoutSubcommand, SuitePresetsSubcommand, ChooseDriverSubcommand, DriverShowSubcommand,
                   AllowEssentialRuleSubcommand]
    guards = [DriverSettingGuard]
    listeners = [InstructionImportsListener, HookTimeoutMarkListener, JournalStartedListener, ManageHooksListener, AgentBlockSkipMarkListener, BypassLogListener, HookWaitFileListener, TypedLineListener, StopLineTypingListener, ClaimedLineReleaseListener, NewDriverLinesListener]
    overlays = [PausedOverlay]
    marks = [*BYPASS_MARKS, *DISPATCH_MARKS]
    performance_tools = [HookCostTool]
    tick_handlers = [TickHandler(TickInterval(seconds=3), InterruptedAgentWake(), "interrupted agents"), TickHandler(TickInterval(seconds=60), AgentTicks(), "agent ticks", starts_immediately=True), TickHandler(TickInterval(seconds=60), EndSilentHelpersTick(), "silent helpers"), TickHandler(TickInterval(seconds=2), PanicWatch(), "panic watch"),
                     TickHandler(TickInterval(seconds=24 * 60 * 60), HookPruning(), "hook pruning", starts_immediately=True),
                     TickHandler(TickInterval(seconds=60), EventPruning(), "event pruning")]
    block_conditions = [RanCommand, ReadFile, TimeReached, AnyCondition, AllConditions, ToolUses, AgentResumed]
    driver_rules = [RepeatedFileReadRule, SafeguardsStopRule, PanicFileRule, BlockStopRule, LongOutputRule, ForeignHooksRule, RepeatedStopReleaseRule, SessionEndRule, OpeningLinesRule, ContinuedSessionRule, AgentBlockRule, TakeoverRule, AccessRule, NativeSubagentRule, PrivateCorpusRule]
    bindings = {CurrentAgentPolicy: SuiteAgentPolicy, OverviewReads: TableOverviewReads, RefusalSkips: TableRefusalSkips, ManagedHookHistoryReader: ManagedHookHistoryQuery, TranscriptAuthors: LineTranscriptAuthors, HookHistory: TableHookHistory,HookRoute: AgentHookRoute, ChangeFilter: DriverChangeFilter,
                EssentialAllowances: SettingEssentialAllowances}
    windows = [WindowDeclaration("drivers.nudges", "Nudges", "nudges.js", WindowLoading.COMPONENT, skeleton=DRIVERS_NUDGES_SKELETON, group="project", icon=WindowIcon.RULE, reads=["nudge list", "nudge-record list"], events=["nudge_record.*"], keys=[WindowKey("nudges", "nudge list", events=["nudge_record.*"]) ]),
               WindowDeclaration("drivers.hook-calls", "Activity", "hook-calls.js", WindowLoading.COMPONENT, skeleton=DRIVERS_HOOK_CALLS_SKELETON, icon=WindowIcon.RUNS, shows=WindowShows.SELECTED_AGENT,
                                 reads=["hook-call feed", "hook-call show", "hook-call stops"], events=["hook_call.*"],
                                 keys=[WindowKey("calls", "hook-call feed", events=["hook_call.*"], arguments=["session-agent-id", "limit", "before-id", "after-id"], page_size=50)])]
    seed_reason = "each suite chooses the drivers used by its demo"
