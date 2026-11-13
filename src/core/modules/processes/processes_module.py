from core.modules.processes.migrations.m076_reading_phase_terms import ReadingPhaseTermsMigration
from core.modules.processes.migrations.m077_dropped_process_shell import DroppedProcessShellMigration
from core.modules.processes.migrations.m079_execution_columns import ExecutionColumnsMigration
from core.modules.processes.migrations.m080_execution_classes import ExecutionClassesMigration
from core.modules.processes.migrations.m081_long_lane_capacity import LongLaneCapacityMigration
from core.modules.processes.models.execution_class_row import ExecutionClassRow
from core.modules.processes.support.stored_execution_classes import StoredExecutionClasses
from engine.execution.person_classes import PersonClasses
from core.modules.processes.migrations.m078_process_execution_priority import ProcessExecutionPriorityMigration
from core.modules.processes.migrations.m075_process_run_names import ProcessRunNamesMigration
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.migrations.m074_open_reader_request_index import OpenReaderRequestIndexMigration
from core.modules.processes.migrations.m072_process_hook_call_index import ProcessHookCallIndexMigration
from core.modules.processes.migrations.m067_request_runs import RequestRunsMigration
from engine.process.door.run_placement import RunPlacement
from engine.process.door.run_pauses import RunPauses
from engine.process.door.request_records import RequestRecords
from core.modules.processes.support.process_row_wrapper import ProcessRowWrapper
from core.modules.processes.commands.record_request_run.record_request_run_handler import RecordRequestRunHandler
from core.modules.processes.commands.record_request_runs.record_request_runs_handler import RecordRequestRunsHandler
from core.modules.processes.bindings.process_run_placement import ProcessRunPlacement
from core.modules.processes.support.agent_run_pauses import AgentRunPauses
from core.modules.processes.migrations.m065_environment_index import ReadersEnvironmentIndexMigration
from core.modules.processes.migrations.m066_process_kind import ProcessTypeColumnMigration
from core.modules.processes.migrations.m069_stock_digest import StockDigestMigration
from core.modules.processes.migrations.m062_watch_agent_index import WatchAgentIndexMigration
from core.modules.processes.listeners.ended_run_line_listener import EndedRunLineListener
from engine.driver.run_owners import RunOwners
from core.modules.processes.support.process_run_owners import ProcessRunOwners
from core.modules.processes.support.process_wait_targets import ProcessWaitTargets
from core.modules.waits.support.wait_targets import WaitTargets
from core.modules.processes.listeners.full_output_read_listener import FullOutputReadListener
from core.modules.processes.migrations.m057_output_full_read import OutputFullReadMigration
from core.modules.processes.migrations.m058_process_plugin import ProcessPluginMigration
from core.modules.processes.migrations.m059_watch_confirm import WatchConfirmMigration
from core.modules.processes.migrations.m056_output_creator_index import OutputCreatorIndexMigration
from core.modules.processes.migrations.m050_process_session import ProcessSessionMigration
from core.modules.processes.migrations.m041_reader_use_indexes import ReaderUseIndexesMigration
from core.modules.processes.migrations.m043_reader_sample_index import ReaderSampleIndexMigration
from core.modules.processes.migrations.m047_go_selected_test_counts import GoSelectedTestCountsMigration
from core.modules.processes.migrations.m049_pytest_listing_counts import PytestListingCountsMigration
from core.modules.processes.migrations.m039_watch_read_index import WatchReadIndexMigration
from core.modules.processes.listeners.stock_readers_publish_listener import StockReadersPublishListener
from core.modules.processes.commands.record_sandbox.record_sandbox_handler import RecordSandboxHandler
from core.modules.processes.commands.record_sandbox.record_sandbox_subcommand import RecordSandboxSubcommand
from core.modules.processes.migrations.m048_process_sandbox import ProcessSandboxMigration
from core.modules.processes.commands.update_stock_readers.update_stock_readers_handler import UpdateStockReadersHandler
from core.modules.processes.commands.send_readers_notice.send_readers_notice_handler import SendReadersNoticeHandler
from core.modules.processes.listeners.start_readers_listener import StartReadersListener
from core.modules.processes.commands.make_reader_draft.make_reader_draft_handler import MakeReaderDraftHandler
from core.modules.processes.commands.make_reader_draft.make_reader_draft_subcommand import MakeReaderDraftSubcommand
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.commands.send_reader_request_notice.send_reader_request_notice_handler import SendReaderRequestNoticeHandler
from core.modules.processes.commands.skip_reader_request.skip_reader_request_handler import SkipReaderRequestHandler
from core.modules.processes.commands.skip_reader_request.skip_reader_request_subcommand import SkipReaderRequestSubcommand
from core.modules.processes.rules.reader_request_rule import ReaderRequestRule
from core.modules.processes.rules.retry_loop_rule import RetryLoopRule
from core.modules.processes.migrations.m027_reader_request_chat_history import ReaderRequestChatHistoryMigration
from core.modules.processes.migrations.m029_stock_test_titles import StockTestTitlesMigration
from core.modules.processes.migrations.m031_stock_reader_defaults import StockReaderDefaultsMigration
from core.modules.processes.listeners.reader_failure_listener import ReaderFailureListener
from core.modules.processes.listeners.end_decision_listener import EndDecisionListener
from core.modules.processes.commands.send_reading_notices.send_reading_notices_handler import SendReadingNoticesHandler
from core.modules.processes.commands.store_end_decisions.store_end_decisions_handler import StoreEndDecisionsHandler
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.migrations.m022_reader_requests import ReaderRequestsMigration
from core.modules.processes.support.block_conditions.reader_request_completed import ReaderRequestCompleted
from core.modules.processes.listeners.reader_block_listener import ReaderBlockListener
from core.modules.processes.listeners.reader_run_count_reset_listener import ReaderRunCountResetListener
from core.modules.processes.listeners.unreadable_mark_run_count_reset_listener import UnreadableMarkRunCountResetListener
from core.modules.processes.listeners.reader_request_complete_listener import ReaderRequestCompleteListener
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.processes.ticks.output_reading import OutputReading
from core.modules.processes.ticks.run_slot_grant import RUN_SLOT_GRANT_SECONDS, RunSlotGrant
from core.modules.processes.ticks.run_end_recovery import RunEndRecovery
from core.modules.processes.listeners.booted_runs_listener import BootedRunsListener
from core.modules.processes.ticks.process_pruning import ProcessPruning
from core.modules.processes.ticks.request_log_import import RequestLogImport
from core.modules.processes.commands.grant_run_slots.grant_run_slots_handler import GrantRunSlotsHandler
from core.modules.processes.commands.halt_run_queue.halt_run_queue_handler import HaltRunQueueHandler
from core.modules.processes.commands.halt_run_queue.halt_run_queue_subcommand import HaltRunQueueSubcommand
from core.modules.processes.commands.resume_run_queue.resume_run_queue_handler import ResumeRunQueueHandler
from core.modules.processes.commands.resume_run_queue.resume_run_queue_subcommand import ResumeRunQueueSubcommand
from core.modules.processes.rules.run_queue_halted_rule import RunQueueHaltedRule
from core.modules.processes.listeners.waiting_message_run_listener import WaitingMessageRunListener
from engine.skill.skill_declaration import SkillDeclaration
from core.modules.processes.support.process_nudges import PROCESS_NUDGES
from engine.driver.watched_runs import WatchedRuns
from core.modules.processes.support.monitored_runs import MonitoredRuns
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.enums.auto_scroll import AutoScroll
from engine.viewer.window_search import WindowSearch
from core.modules.processes.support.process_searcher import ProcessSearcher
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_extension import WindowExtension
from engine.viewer.window_key import WindowKey
from engine.viewer.window_tab import WindowTab
from engine.enums.key_loading import KeyLoading
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from core.modules.processes.upgrade.processes_move import ProcessesMove
from core.modules.processes.commands.end_process.end_process_handler import EndProcessHandler
from core.modules.processes.commands.end_process_part.end_process_part_handler import EndProcessPartHandler
from core.modules.processes.commands.end_process_part.end_process_part_subcommand import EndProcessPartSubcommand
from core.modules.processes.commands.start_process_part.start_process_part_handler import StartProcessPartHandler
from core.modules.processes.commands.start_process_part.start_process_part_subcommand import StartProcessPartSubcommand
from core.modules.processes.commands.end_process.end_process_subcommand import EndProcessSubcommand
from core.modules.processes.commands.page_output.page_output_subcommand import PageOutputSubcommand
from core.modules.processes.commands.page_output.hook_output_page_subcommand import HookOutputPageSubcommand
from core.modules.processes.commands.peek_output.peek_output_subcommand import PeekOutputSubcommand
from core.modules.processes.commands.read_output.read_output_handler import ReadOutputHandler
from core.modules.processes.commands.read_output.read_output_subcommand import ReadOutputSubcommand
from core.modules.processes.commands.show_output_status.show_output_status_subcommand import ShowOutputStatusSubcommand
from core.modules.processes.commands.record_given_percent.record_given_percent_handler import RecordGivenPercentHandler
from core.modules.processes.commands.request_reader.request_reader_handler import RequestReaderHandler
from core.modules.processes.commands.request_count_reader.request_count_reader_handler import RequestCountReaderHandler
from core.modules.processes.commands.request_reader.request_reader_subcommand import RequestReaderSubcommand
from core.modules.processes.commands.unwatch_output.unwatch_output_handler import UnwatchOutputHandler
from core.modules.processes.commands.unwatch_output.unwatch_output_subcommand import UnwatchOutputSubcommand
from core.modules.processes.commands.watch_output.watch_output_handler import WatchOutputHandler
from core.modules.processes.commands.watch_output.watch_output_subcommand import WatchOutputSubcommand
from core.modules.processes.listeners.background_run_watch_listener import BackgroundRunWatchListener
from core.modules.processes.listeners.ended_process_watch_listener import EndedProcessWatchListener
from core.modules.processes.listeners.reader_proof_listener import ReaderProofListener
from core.modules.processes.rules.watch_lines_rule import WatchLinesRule
from core.modules.processes.commands.prune_processes.prune_processes_handler import PruneProcessesHandler
from core.modules.processes.listeners.process_prune_listener import ProcessPruneListener
from core.modules.processes.listeners.process_removal_listener import ProcessRemovalListener
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.rules.leftover_run_rule import LeftoverRunRule
from core.modules.processes.rules.orphan_process_rule import OrphanProcessRule
from core.modules.processes.listeners.process_folder_removal_listener import ProcessFolderRemovalListener
from core.modules.processes.listeners.run_slot_listener import RunSlotListener
from core.modules.processes.rules.alias_suggestion_rule import AliasSuggestionRule
from core.modules.processes.rules.read_advice_rule import ReadAdviceRule
from core.modules.processes.rules.reading_rule import ReadingRule
from core.modules.processes.rules.run_title_rule import RunTitleRule
from core.modules.processes.listeners.process_end_mark_listener import ProcessEndMarkListener
from core.modules.processes.listeners.process_part_start_mark_listener import ProcessPartStartMarkListener
from core.modules.processes.listeners.process_move_mark_listener import ProcessMoveMarkListener
from core.modules.processes.commands.process_list.process_list_subcommand import ProcessListSubcommand
from core.modules.processes.listeners.process_output_mark_listener import ProcessOutputMarkListener
from core.modules.processes.support.process_marks import PROCESS_DOCKS, PROCESS_MARKS
from core.modules.processes.commands.read_new_output.read_new_output_handler import ReadNewOutputHandler
from core.modules.processes.listeners.ended_agent_runs_listener import EndedAgentRunsListener
from core.modules.processes.migrations.m010_runs_of_ended_agents import EndedAgentRunsMigration
from core.modules.processes.migrations.m012_vitest_reader_commands import VitestReaderCommandsMigration
from core.modules.processes.listeners.orphaned_process_kill_listener import OrphanedProcessKillListener
from core.modules.processes.listeners.stopped_process_output_listener import StoppedProcessOutputListener
from core.modules.processes.migrations.m004_output_readers import OutputReadersMigration
from core.modules.processes.migrations.m005_reader_plugins import ReaderPluginsMigration
from core.modules.processes.migrations.m008_reader_steps_and_titles import ReaderStepsAndTitlesMigration
from core.modules.processes.commands.process_card.process_card_subcommand import ProcessCardSubcommand
from core.modules.processes.commands.process_feed.process_feed_subcommand import ProcessFeedSubcommand
from core.modules.processes.models.process_row import ProcessRow
from core.modules.processes.commands.title_output.title_output_handler import TitleOutputHandler
from core.modules.processes.commands.title_output.title_output_subcommand import TitleOutputSubcommand
from core.modules.processes.rules.journal_chain_rule import JournalChainRule
from core.modules.processes.rules.journal_pipe_rule import JournalPipeRule
from core.modules.processes.rules.read_command_output_rule import ReadCommandOutputRule
from core.modules.processes.rules.silent_run_block_rule import SilentRunBlockRule
from core.modules.processes.rules.long_run_dock_rule import LongRunDockRule
from core.modules.processes.listeners.active_tests_marker_listener import ActiveTestsMarkerListener
from core.modules.processes.listeners.process_output_listener import ProcessOutputListener
from core.modules.processes.rules.output_status_monitor_rule import OutputStatusMonitorRule
from core.modules.processes.guards.ended_process_dock_guard import EndedProcessDockGuard
from core.modules.processes.guards.run_owner_parts_guard import RunOwnerPartsGuard
from core.modules.processes.guards.run_owner_reports_guard import RunOwnerReportsGuard
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.start_process.start_process_handler import StartProcessHandler
from core.modules.processes.commands.stop_process.stop_process_handler import StopProcessHandler
from core.modules.processes.commands.stop_process.stop_process_subcommand import StopProcessSubcommand
from core.modules.processes.rules.ended_output_line_rule import EndedOutputLineRule
from core.modules.processes.rules.folder_change_rule import FolderChangeRule
from core.modules.processes.rules.runner_rewrite_rule import RunnerRewriteRule
from core.modules.processes.rules.hand_made_monitor_rule import HandMadeMonitorRule
from core.modules.processes.rules.sleep_poll_rule import SleepPollRule
from core.modules.processes.commands.add_reader.add_reader_handler import AddReaderHandler
from core.modules.processes.commands.add_reader.add_reader_subcommand import AddReaderSubcommand
from core.modules.processes.commands.choose_default_reader.choose_default_reader_handler import ChooseDefaultReaderHandler
from core.modules.processes.commands.choose_default_reader.choose_default_reader_subcommand import ChooseDefaultReaderSubcommand
from core.modules.processes.commands.mark_unreadable.mark_unreadable_handler import MarkUnreadableHandler
from core.modules.processes.commands.release_block.release_block_handler import ReleaseBlockHandler
from core.modules.processes.commands.release_block.release_block_subcommand import ReleaseBlockSubcommand
from core.modules.processes.commands.list_blocks.list_blocks_subcommand import ListBlocksSubcommand
from core.modules.processes.commands.mark_run_unreadable.mark_run_unreadable_handler import MarkRunUnreadableHandler
from core.modules.processes.commands.mark_run_unreadable.mark_run_unreadable_subcommand import MarkRunUnreadableSubcommand
from core.modules.processes.commands.lift_run_unreadable.lift_run_unreadable_handler import LiftRunUnreadableHandler
from core.modules.processes.commands.lift_run_unreadable.lift_run_unreadable_subcommand import LiftRunUnreadableSubcommand
from core.modules.processes.commands.mark_unreadable.mark_unreadable_subcommand import MarkUnreadableSubcommand
from core.modules.processes.commands.lift_unreadable.lift_unreadable_handler import LiftUnreadableHandler
from core.modules.processes.commands.lift_unreadable.lift_unreadable_subcommand import LiftUnreadableSubcommand
from core.modules.processes.commands.remove_reader.remove_reader_handler import RemoveReaderHandler
from core.modules.processes.commands.remove_reader.remove_reader_subcommand import RemoveReaderSubcommand
from core.modules.processes.guards.reader_owner_guard import ReaderOwnerGuard
from core.modules.processes.migrations.m002_readers import ReadersTableMigration
from core.modules.processes.migrations.m003_stock_readers import StockReadersMigration
from core.modules.processes.migrations.m006_watch_percent import WatchPercentMigration
from core.modules.processes.migrations.m007_process_state_index import ProcessStateIndexMigration
from core.modules.processes.migrations.m009_process_part_category import ProcessPartCategoryMigration
from core.modules.processes.migrations.m011_process_full_test_run import ProcessFullTestRunMigration
from core.modules.processes.migrations.m013_process_queue import ProcessQueueMigration
from core.modules.processes.migrations.m014_output_reader_position import OutputReaderPositionMigration
from core.modules.processes.migrations.m015_process_part_text_index import ProcessPartTextIndexMigration
from core.modules.processes.migrations.m016_hot_query_indexes import ProcessHotQueryIndexesMigration
from core.modules.processes.migrations.m018_process_part_command import ProcessPartCommandMigration
from core.modules.processes.migrations.m019_reader_test_counts import ReaderTestCountsMigration
from core.modules.processes.migrations.m020_output_test_count import OutputTestCountMigration
from core.modules.processes.migrations.m021_stock_reader_test_counts import StockReaderTestCountsMigration
from core.modules.processes.migrations.m052_test_reader_progress import TestReaderProgressMigration
from core.modules.processes.migrations.m053_output_seen_offset import OutputReadPositionMigration
from core.modules.processes.migrations.m054_vitest_listing_counts import VitestListingCountsMigration
from core.modules.processes.migrations.m055_vitest_summary_counts import VitestSummaryCountsMigration
from core.modules.processes.migrations.m046_selected_test_counts import SelectedTestCountsMigration
from core.modules.processes.migrations.m017_queue_membership import QueueMembershipMigration
from core.modules.processes.commands.list_run_queue.list_run_queue_subcommand import ListRunQueueSubcommand
from core.modules.processes.commands.inspect_run_queue.inspect_run_queue_subcommand import InspectRunQueueSubcommand
from core.modules.processes.models.process_queue_row import ProcessQueueRow
from core.modules.processes.migrations.m035_process_queued_at import ProcessQueueTimestampMigration
from core.modules.processes.migrations.m036_process_timeouts import ProcessTimeoutMigration
from core.modules.processes.commands.set_output_timeout.set_output_timeout_handler import SetOutputTimeoutHandler
from core.modules.processes.commands.set_output_timeout.set_output_timeout_subcommand import SetOutputTimeoutSubcommand
from core.modules.processes.commands.stop_timed_process.stop_timed_process_handler import StopTimedProcessHandler
from core.modules.processes.ticks.run_timeouts import RunTimeouts
from core.modules.processes.ticks.hang_watch import HangWatch
from core.modules.processes.ticks.cadence_watch import CadenceWatch
from core.modules.processes.commands.warn_cadence.warn_cadence_handler import WarnCadenceHandler
from core.modules.processes.commands.request_output_check.request_output_check_handler import RequestOutputCheckHandler
from core.modules.processes.commands.stop_hung_process.stop_hung_process_handler import StopHungProcessHandler
from core.modules.processes.ticks.output_checks import OutputChecks
from core.modules.processes.commands.check_output.check_output_handler import CheckOutputHandler
from core.modules.processes.commands.confirm_output.confirm_output_handler import ConfirmOutputHandler
from core.modules.processes.commands.confirm_output.confirm_output_subcommand import ConfirmOutputSubcommand
from core.modules.processes.migrations.m023_process_admission import ProcessAdmissionMigration
from core.modules.processes.migrations.m024_process_work import ProcessWorkMigration
from core.modules.processes.migrations.m025_stock_reader_summaries import StockReaderSummariesMigration
from core.modules.processes.migrations.m030_stock_reader_catalog import StockReaderCatalogMigration
from core.modules.processes.migrations.m026_process_queue_indexes import ProcessQueueIndexesMigration
from core.modules.processes.migrations.m028_process_part_visibility import ProcessPartVisibilityMigration
from core.modules.processes.migrations.m032_process_owner import ProcessOwnerMigration
from core.modules.processes.migrations.m033_process_end_index import ProcessEndIndexMigration
from core.modules.processes.migrations.m034_more_stock_readers import MoreStockReadersMigration
from core.modules.processes.migrations.m040_reader_request_owner import ReaderRequestOwnerMigration
from core.modules.processes.migrations.m038_output_end_name import OutputEndNameMigration
from core.modules.processes.migrations.m042_process_queue_visibility import ProcessQueueVisibilityMigration
from core.modules.processes.migrations.m037_more_tool_stock_readers import MoreToolStockReadersMigration
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.migrations.m001_processes import ProcessesTablesMigration
from core.modules.processes.migrations.m051_reader_request_environment_index import ReaderRequestEnvironmentIndexMigration
from core.modules.processes.migrations.m060_plain_column_names import PlainColumnNamesMigration
from core.modules.processes.migrations.m061_process_session_state_index import ProcessSessionStateIndexMigration
from core.modules.processes.migrations.m063_reading_decisions import ReadingDecisionsMigration
from core.modules.processes.migrations.m064_unreadable_marks import UnreadableMarkTableMigration
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from core.modules.processes.models.command_run_count import CommandRunCount
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.queries.unreadable_mark_query import UnreadableMarkQuery
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.watch import Watch
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.request_run_query import RequestRunQuery
from core.modules.processes.migrations.m068_request_run_age_index import RequestRunAgeIndexMigration
from core.modules.processes.migrations.m070_request_run_end_index import RequestRunEndIndexMigration
from core.modules.processes.migrations.m071_process_priority import ProcessPriorityMigration
from core.modules.processes.migrations.m073_command_run_counts import CommandRunCountsMigration
from core.modules.processes.queries.watch_query import WatchQuery
from core.modules.processes.models.enums.process_setting import PROCESS_SETTINGS
from core.modules.processes.seeders.processes_seeder import ProcessesSeeder
from core.modules.processes.support.block_conditions.output_ended import OutputEnded
from core.modules.processes.support.block_conditions.output_monitored import OutputMonitored
from core.modules.processes.support.block_conditions.output_read import OutputRead
from core.modules.processes.support.skeletons import PROCESSES_OUTPUTS_SKELETON, PROCESSES_OUTPUT_SKELETON

WINDOW_READS = ["process card", "process show", "process feed", "output peek", "output page", "unreadable-mark list"]
WINDOW_RUNS = ["output stop", "output watch", "output ask-reader", "output unreadable", "output readable"]
WINDOW_EVENTS = ["process.*", "output.*"]


from core.modules.processes.support.queue_inspector import QUEUE_INSPECTOR
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart


class ProcessesModule(Module):
    """Adds processes: every shell line an agent runs is kept as a numbered process with its parts and its
    output."""

    name = "journal.core.processes"
    nudges = PROCESS_NUDGES
    tick_handlers = [TickHandler(TickInterval(seconds=1), OutputReading(), "read running outputs"), TickHandler(TickInterval(seconds=RUN_SLOT_GRANT_SECONDS), RunSlotGrant(), "run slots"),
                     TickHandler(TickInterval(seconds=1), RunTimeouts(), "run timeouts"), TickHandler(TickInterval(seconds=15), HangWatch(), "hang watch"), TickHandler(TickInterval(seconds=10), CadenceWatch(), "cadence watch"), TickHandler(TickInterval(seconds=15), OutputChecks(), "output checks"),
                     TickHandler(TickInterval(seconds=15), RunEndRecovery(), "run end recovery", starts_immediately=True),
                     TickHandler(TickInterval(seconds=15 * 60), ProcessPruning(), "process pruning"), TickHandler(TickInterval(seconds=5), RequestLogImport(), "request log import")]
    skills = [SkillDeclaration("journal-shell", "Run shell commands through the journal and read what they printed; read it before reading an output, or writing a reader or an alias",
                               keywords=("output", "reader", "alias"))]
    requires_core = ">=5,<6"
    block_conditions = [ReaderRequestCompleted, OutputEnded, OutputRead, OutputMonitored]
    settings = PROCESS_SETTINGS
    moves = [ProcessesMove]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.waits", "journal.core.messages", "journal.core.chat", "journal.core.docking", "journal.core.tasks", "journal.core.settings", "journal.core.developer", "journal.core.assignments"]
    models = [ModelDeclaration(RequestRun, query=RequestRunQuery, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(ReaderRequest, query=ReaderRequestQuery, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(Process, query=ProcessQuery, commands=(MoveProcess, OrphanProcess), excluded_subcommands=["make", "finish", "fail", "stop"]), ModelDeclaration(ProcessPart, query=ProcessPartQuery, excluded_subcommands=["make", "edit"]), ModelDeclaration(Output, query=OutputQuery, excluded_subcommands=["make", "edit", "delete", "prune"]), ModelDeclaration(Watch, query=WatchQuery), ModelDeclaration(Reader, query=ReaderQuery, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(ReadingDecisionRow, query=ReadingDecisionQuery, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(CommandRunCount, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(UnreadableMark, query=UnreadableMarkQuery, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(ExecutionClassRow, excluded_subcommands=["make", "edit", "delete"])]
    views = [ProcessRow, ProcessQueueRow]
    migrations = [CommandRunCountsMigration, OpenReaderRequestIndexMigration, ProcessHookCallIndexMigration, RequestRunAgeIndexMigration, RequestRunEndIndexMigration, ProcessPriorityMigration, RequestRunsMigration, ReadingDecisionsMigration, WatchAgentIndexMigration, ProcessSessionStateIndexMigration, PlainColumnNamesMigration, WatchConfirmMigration, ProcessPluginMigration, OutputFullReadMigration, OutputCreatorIndexMigration, VitestSummaryCountsMigration, VitestListingCountsMigration, OutputReadPositionMigration, TestReaderProgressMigration, ProcessSessionMigration, PytestListingCountsMigration, GoSelectedTestCountsMigration, SelectedTestCountsMigration, ProcessSandboxMigration, ReaderUseIndexesMigration, ReaderSampleIndexMigration, WatchReadIndexMigration, ReaderRequestOwnerMigration, ProcessQueueVisibilityMigration, OutputEndNameMigration, MoreToolStockReadersMigration, ProcessTimeoutMigration, ProcessQueueTimestampMigration, MoreStockReadersMigration, ProcessEndIndexMigration, ProcessOwnerMigration, StockReaderDefaultsMigration, StockReaderCatalogMigration, StockTestTitlesMigration, ProcessPartVisibilityMigration, ReaderRequestChatHistoryMigration, ProcessQueueIndexesMigration, StockReaderSummariesMigration, ProcessWorkMigration, ProcessAdmissionMigration, ReaderRequestsMigration, ReaderTestCountsMigration, OutputTestCountMigration, StockReaderTestCountsMigration, ProcessPartCommandMigration, QueueMembershipMigration, ProcessHotQueryIndexesMigration, ProcessPartTextIndexMigration, OutputReaderPositionMigration, ProcessQueueMigration, VitestReaderCommandsMigration, ProcessFullTestRunMigration, EndedAgentRunsMigration, ReaderStepsAndTitlesMigration, ProcessesTablesMigration, ReadersTableMigration, StockReadersMigration, OutputReadersMigration, ReaderPluginsMigration, WatchPercentMigration, ProcessStateIndexMigration, ProcessPartCategoryMigration, ReaderRequestEnvironmentIndexMigration, ReadersEnvironmentIndexMigration, ProcessTypeColumnMigration, StockDigestMigration, UnreadableMarkTableMigration, ProcessRunNamesMigration, ReadingPhaseTermsMigration, DroppedProcessShellMigration, ProcessExecutionPriorityMigration, ExecutionColumnsMigration, ExecutionClassesMigration, LongLaneCapacityMigration]
    handlers = [WarnCadenceHandler, StoreEndDecisionsHandler, RequestReaderHandler, CheckOutputHandler, ConfirmOutputHandler, RecordSandboxHandler, UpdateStockReadersHandler, SetOutputTimeoutHandler, StopTimedProcessHandler, RequestOutputCheckHandler, StopHungProcessHandler, PruneProcessesHandler, SendReadersNoticeHandler, MakeReaderDraftHandler, SendReaderRequestNoticeHandler, SkipReaderRequestHandler, TitleOutputHandler, StartProcessHandler, StartProcessPartHandler, EndProcessPartHandler, EndProcessHandler, StopProcessHandler, AddReaderHandler, RemoveReaderHandler, ChooseDefaultReaderHandler, ReadOutputHandler, WatchOutputHandler, UnwatchOutputHandler, RecordGivenPercentHandler, ReadNewOutputHandler, GrantRunSlotsHandler, HaltRunQueueHandler, ResumeRunQueueHandler, RecordRequestRunHandler, RecordRequestRunsHandler, ReleaseBlockHandler, MarkRunUnreadableHandler, LiftRunUnreadableHandler, MarkUnreadableHandler, LiftUnreadableHandler, SendReadingNoticesHandler, RequestCountReaderHandler]
    subcommands = [RequestReaderSubcommand, ConfirmOutputSubcommand, RecordSandboxSubcommand, SetOutputTimeoutSubcommand, PageOutputSubcommand, HookOutputPageSubcommand, InspectRunQueueSubcommand, MakeReaderDraftSubcommand, SkipReaderRequestSubcommand, ListRunQueueSubcommand, ProcessFeedSubcommand, ProcessCardSubcommand, TitleOutputSubcommand, StopProcessSubcommand, EndProcessSubcommand, StartProcessPartSubcommand, EndProcessPartSubcommand, AddReaderSubcommand, RemoveReaderSubcommand, ChooseDefaultReaderSubcommand, ReadOutputSubcommand, ShowOutputStatusSubcommand, PeekOutputSubcommand, WatchOutputSubcommand, UnwatchOutputSubcommand, HaltRunQueueSubcommand, ResumeRunQueueSubcommand, ProcessListSubcommand, ListBlocksSubcommand, ReleaseBlockSubcommand, MarkRunUnreadableSubcommand, LiftRunUnreadableSubcommand, MarkUnreadableSubcommand, LiftUnreadableSubcommand]
    guards = [RunOwnerReportsGuard, RunOwnerPartsGuard, ReaderOwnerGuard, EndedProcessDockGuard]
    driver_rules = [ReadingRule, RetryLoopRule, ReaderRequestRule, LeftoverRunRule, HandMadeMonitorRule, AliasSuggestionRule, ReadAdviceRule, RunTitleRule, SleepPollRule, JournalChainRule, ReadCommandOutputRule, JournalPipeRule, SilentRunBlockRule, OutputStatusMonitorRule, LongRunDockRule, FolderChangeRule, RunnerRewriteRule, EndedOutputLineRule, WatchLinesRule, OrphanProcessRule, RunQueueHaltedRule]
    listeners = [BootedRunsListener, ReaderRunCountResetListener, UnreadableMarkRunCountResetListener, EndDecisionListener, EndedRunLineListener, FullOutputReadListener, StockReadersPublishListener, StartReadersListener, ReaderFailureListener, ReaderBlockListener, ReaderRequestCompleteListener, ProcessFolderRemovalListener, RunSlotListener, ActiveTestsMarkerListener, WaitingMessageRunListener, EndedAgentRunsListener, BackgroundRunWatchListener, EndedProcessWatchListener, ReaderProofListener, ProcessPruneListener, ProcessRemovalListener, StoppedProcessOutputListener, OrphanedProcessKillListener, ProcessEndMarkListener, ProcessPartStartMarkListener, ProcessMoveMarkListener, ProcessOutputMarkListener, ProcessOutputListener]
    marks = PROCESS_MARKS
    bindings = {WatchedRuns: MonitoredRuns, WaitTargets: ProcessWaitTargets, RunOwners: ProcessRunOwners, RunPlacement: ProcessRunPlacement, RunPauses: AgentRunPauses, RequestRecords: ProcessRowWrapper, PersonClasses: StoredExecutionClasses}
    docks = PROCESS_DOCKS
    window_extensions = [WindowExtension(name, reads=["queue list", "output page"], events=["output.*"],
                                         tabs=[WindowTab("processes", "Processes", "queue list", component="/modules/journal.core.processes/agent-processes.js")])
                         for name in ("agents.agents", "agents.helpers")]
    windows = [WindowDeclaration("processes.outputs", "Commands", "outputs.js", WindowLoading.COMPONENT, skeleton=PROCESSES_OUTPUTS_SKELETON, search=WindowSearch(ProcessSearcher, "Search the commands"), icon=WindowIcon.TERMINAL, reads=WINDOW_READS,
                                 keys=[WindowKey("runs", "process feed", arguments=["session-agent-id"], events=WINDOW_EVENTS),
                                       WindowKey("marks", "unreadable-mark list", events=["unreadable_mark.*"])], runs=WINDOW_RUNS, events=[*WINDOW_EVENTS, "unreadable_mark.*"]),
               WindowDeclaration("processes.output", "Output", "output.js", WindowLoading.COMPONENT, skeleton=PROCESSES_OUTPUT_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.TERMINAL, auto_scroll=AutoScroll.BOTTOM, reads=[*WINDOW_READS, "window setting"],
                                 keys=[WindowKey("selection", "window setting processes.output output", loading=KeyLoading.REQUESTED),
                                       WindowKey("latest", "process feed --limit 1", arguments=["session-agent-id"], loading=KeyLoading.REQUESTED),
                                       WindowKey("run.*", "process feed --id {id}", loading=KeyLoading.REQUESTED),
                                       WindowKey("summary.*", "output peek {id} --summary", loading=KeyLoading.REQUESTED),
                                       WindowKey("output.*", "output page {id}", arguments=["after", "before"], loading=KeyLoading.REQUESTED)],
                                 runs=WINDOW_RUNS, events=WINDOW_EVENTS),
               WindowDeclaration("processes.queue-body", "Process queue", "queue-body.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION, icon=WindowIcon.TERMINAL, skeleton=[SkeletonPart.line()],
                                 reads=["queue list", "output page"], runs=["setting set"], events=["output.*"])]
    window_extensions = [WindowExtension("agents.agents", runs=["process lift-hold"])]
    inspectors = [QUEUE_INSPECTOR]
    seeders = [ProcessesSeeder]
