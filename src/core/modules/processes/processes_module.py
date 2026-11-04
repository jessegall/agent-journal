from core.modules.processes.commands.send_readers_notice.send_readers_notice_handler import SendReadersNoticeHandler
from core.modules.processes.listeners.start_readers_listener import StartReadersListener
from core.modules.processes.commands.make_reader_draft.make_reader_draft_handler import MakeReaderDraftHandler
from core.modules.processes.commands.make_reader_draft.make_reader_draft_subcommand import MakeReaderDraftSubcommand
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.listeners.worker_test_count_listener import WorkerTestCountListener
from core.modules.processes.rules.worker_test_count_rule import WorkerTestCountRule
from core.modules.processes.commands.send_reader_request_notice.send_reader_request_notice_handler import SendReaderRequestNoticeHandler
from core.modules.processes.commands.skip_reader_request.skip_reader_request_handler import SkipReaderRequestHandler
from core.modules.processes.commands.skip_reader_request.skip_reader_request_subcommand import SkipReaderRequestSubcommand
from core.modules.processes.rules.reader_request_rule import ReaderRequestRule
from core.modules.processes.migrations.m027_reader_request_chat_history import ReaderRequestChatHistoryMigration
from core.modules.processes.listeners.reader_failure_listener import ReaderFailureListener
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.migrations.m022_reader_requests import ReaderRequestsMigration
from core.modules.processes.support.block_conditions.reader_request_completed import ReaderRequestCompleted
from core.modules.processes.listeners.reader_block_listener import ReaderBlockListener
from core.modules.processes.listeners.reader_request_complete_listener import ReaderRequestCompleteListener
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from core.modules.processes.ticks.output_reading import OutputReading
from core.modules.processes.ticks.run_slot_grant import RunSlotGrant
from core.modules.processes.ticks.run_end_recovery import RunEndRecovery
from core.modules.processes.commands.grant_run_slots.grant_run_slots_handler import GrantRunSlotsHandler
from core.modules.processes.commands.halt_run_queue.halt_run_queue_handler import HaltRunQueueHandler
from core.modules.processes.commands.halt_run_queue.halt_run_queue_subcommand import HaltRunQueueSubcommand
from core.modules.processes.commands.resume_run_queue.resume_run_queue_handler import ResumeRunQueueHandler
from core.modules.processes.commands.resume_run_queue.resume_run_queue_subcommand import ResumeRunQueueSubcommand
from core.modules.processes.rules.run_queue_halted_rule import RunQueueHaltedRule
from core.modules.processes.listeners.waiting_message_run_listener import WaitingMessageRunListener
from core.base.skill.skill_declaration import SkillDeclaration
from core.modules.processes.support.process_nudges import PROCESS_NUDGES
from core.base.driver.watched_runs import WatchedRuns
from core.modules.processes.support.monitored_runs import MonitoredRuns
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.auto_scroll import AutoScroll
from core.base.viewer.window_search import WindowSearch
from core.modules.processes.support.process_searcher import ProcessSearcher
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.processes.upgrade.processes_move import ProcessesMove
from core.modules.processes.commands.end_process.end_process_handler import EndProcessHandler
from core.modules.processes.commands.end_process_part.end_process_part_handler import EndProcessPartHandler
from core.modules.processes.commands.end_process_part.end_process_part_subcommand import EndProcessPartSubcommand
from core.modules.processes.commands.start_process_part.start_process_part_handler import StartProcessPartHandler
from core.modules.processes.commands.start_process_part.start_process_part_subcommand import StartProcessPartSubcommand
from core.modules.processes.commands.end_process.end_process_subcommand import EndProcessSubcommand
from core.modules.processes.commands.peek_output.peek_output_subcommand import PeekOutputSubcommand
from core.modules.processes.commands.read_output.read_output_handler import ReadOutputHandler
from core.modules.processes.commands.read_output.read_output_subcommand import ReadOutputSubcommand
from core.modules.processes.commands.show_output_status.show_output_status_subcommand import ShowOutputStatusSubcommand
from core.modules.processes.commands.record_given_percent.record_given_percent_handler import RecordGivenPercentHandler
from core.modules.processes.commands.unwatch_output.unwatch_output_handler import UnwatchOutputHandler
from core.modules.processes.commands.unwatch_output.unwatch_output_subcommand import UnwatchOutputSubcommand
from core.modules.processes.commands.watch_output.watch_output_handler import WatchOutputHandler
from core.modules.processes.commands.watch_output.watch_output_subcommand import WatchOutputSubcommand
from core.modules.processes.listeners.background_run_watch_listener import BackgroundRunWatchListener
from core.modules.processes.listeners.ended_process_watch_listener import EndedProcessWatchListener
from core.modules.processes.listeners.reader_proof_listener import ReaderProofListener
from core.modules.processes.rules.watch_lines_rule import WatchLinesRule
from core.modules.processes.commands.prune_outputs.prune_outputs_handler import PruneOutputsHandler
from core.modules.processes.listeners.output_prune_listener import OutputPruneListener
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.rules.leftover_run_rule import LeftoverRunRule
from core.modules.processes.rules.orphan_process_rule import OrphanProcessRule
from core.modules.processes.listeners.run_slot_listener import RunSlotListener
from core.modules.processes.rules.alias_suggestion_rule import AliasSuggestionRule
from core.modules.processes.rules.large_output_read_rule import LargeOutputReadRule
from core.modules.processes.rules.reader_hint_rule import ReaderHintRule
from core.modules.processes.rules.run_title_rule import RunTitleRule
from core.modules.processes.listeners.process_end_mark_listener import ProcessEndMarkListener
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
from core.modules.processes.rules.redirected_run_rule import RedirectedRunRule
from core.modules.processes.rules.silent_run_rule import SilentRunRule
from core.modules.processes.rules.long_run_dock_rule import LongRunDockRule
from core.modules.processes.listeners.test_run_marker_listener import TestRunMarkerListener
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
from core.modules.processes.migrations.m017_queue_membership import QueueMembershipMigration
from core.modules.processes.commands.list_run_queue.list_run_queue_subcommand import ListRunQueueSubcommand
from core.modules.processes.commands.inspect_run_queue.inspect_run_queue_subcommand import InspectRunQueueSubcommand
from core.modules.processes.models.process_queue_row import ProcessQueueRow
from core.modules.processes.migrations.m023_process_admission import ProcessAdmissionMigration
from core.modules.processes.migrations.m024_process_work import ProcessWorkMigration
from core.modules.processes.migrations.m025_stock_reader_summaries import StockReaderSummariesMigration
from core.modules.processes.migrations.m026_process_queue_indexes import ProcessQueueIndexesMigration
from core.modules.processes.migrations.m028_process_part_visibility import ProcessPartVisibilityMigration
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.migrations.m001_processes import ProcessesTablesMigration
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.watch import Watch
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.watch_query import WatchQuery
from core.modules.processes.models.support.process_setting import PROCESS_SETTINGS
from core.modules.processes.seeders.processes_seeder import ProcessesSeeder
from core.modules.processes.support.block_conditions.output_ended import OutputEnded
from core.modules.processes.support.block_conditions.output_monitored import OutputMonitored
from core.modules.processes.support.block_conditions.output_read import OutputRead
from core.modules.processes.support.skeletons import PROCESSES_OUTPUTS_SKELETON, PROCESSES_OUTPUT_SKELETON

WINDOW_READS = ["process card", "process show", "process feed", "output peek"]
WINDOW_RUNS = ["output stop", "output watch"]
WINDOW_EVENTS = ["process.*", "output.*"]


class ProcessesModule(Module):
    """Adds processes: every shell line an agent runs is kept as a numbered process with its parts and its
    output."""

    name = "journal.core.processes"
    nudges = PROCESS_NUDGES
    tick_handlers = [TickHandler(TickInterval(seconds=1), OutputReading(), "read running outputs"), TickHandler(TickInterval(seconds=2), RunSlotGrant(), "run slots"),
                     TickHandler(TickInterval(seconds=15), RunEndRecovery(), "run end recovery")]
    skills = [SkillDeclaration("journal-shell", "Run shell commands through the journal and read what they printed; read it before reading an output, or writing a reader or an alias.",
                               keywords=("output", "reader", "alias"))]
    requires_core = ">=5,<6"
    block_conditions = [ReaderRequestCompleted, OutputEnded, OutputRead, OutputMonitored]
    settings = PROCESS_SETTINGS
    moves = [ProcessesMove]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.waits", "journal.core.messages", "journal.core.chat", "journal.core.docking", "journal.core.tasks"]
    models = (ModelDeclaration(ReaderRequest, query=ReaderRequestQuery, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(Process, query=ProcessQuery, commands=(MoveProcess, OrphanProcess), excluded_subcommands=["make", "finish", "fail", "stop"]), ModelDeclaration(ProcessPart, query=ProcessPartQuery, excluded_subcommands=["make", "edit"]), ModelDeclaration(Output, query=OutputQuery, excluded_subcommands=["make", "edit"]), ModelDeclaration(Watch, query=WatchQuery), ModelDeclaration(Reader, query=ReaderQuery, excluded_subcommands=["make", "edit", "delete"]))
    views = [ProcessRow, ProcessQueueRow]
    migrations = [ProcessPartVisibilityMigration, ReaderRequestChatHistoryMigration, ProcessQueueIndexesMigration, StockReaderSummariesMigration,ProcessWorkMigration,ProcessAdmissionMigration, ReaderRequestsMigration, ReaderTestCountsMigration, OutputTestCountMigration, StockReaderTestCountsMigration, ProcessPartCommandMigration, QueueMembershipMigration, ProcessHotQueryIndexesMigration, ProcessPartTextIndexMigration, OutputReaderPositionMigration, ProcessQueueMigration, VitestReaderCommandsMigration, ProcessFullTestRunMigration, EndedAgentRunsMigration, ReaderStepsAndTitlesMigration, ProcessesTablesMigration, ReadersTableMigration, StockReadersMigration, OutputReadersMigration, ReaderPluginsMigration, WatchPercentMigration, ProcessStateIndexMigration, ProcessPartCategoryMigration]
    handlers = [SendReadersNoticeHandler, MakeReaderDraftHandler, SendReaderRequestNoticeHandler, SkipReaderRequestHandler, TitleOutputHandler, StartProcessHandler, StartProcessPartHandler, EndProcessPartHandler, EndProcessHandler, StopProcessHandler, AddReaderHandler, RemoveReaderHandler, ChooseDefaultReaderHandler, ReadOutputHandler, WatchOutputHandler, UnwatchOutputHandler, RecordGivenPercentHandler, PruneOutputsHandler, ReadNewOutputHandler, GrantRunSlotsHandler, HaltRunQueueHandler, ResumeRunQueueHandler]
    subcommands = [InspectRunQueueSubcommand, MakeReaderDraftSubcommand, SkipReaderRequestSubcommand, ListRunQueueSubcommand, ProcessFeedSubcommand, ProcessCardSubcommand, TitleOutputSubcommand, StopProcessSubcommand, EndProcessSubcommand, StartProcessPartSubcommand, EndProcessPartSubcommand, AddReaderSubcommand, RemoveReaderSubcommand, ChooseDefaultReaderSubcommand, ReadOutputSubcommand, ShowOutputStatusSubcommand, PeekOutputSubcommand, WatchOutputSubcommand, UnwatchOutputSubcommand, HaltRunQueueSubcommand, ResumeRunQueueSubcommand]
    guards = [RunOwnerReportsGuard, RunOwnerPartsGuard, ReaderOwnerGuard, EndedProcessDockGuard]
    driver_rules = [WorkerTestCountRule, ReaderRequestRule, LeftoverRunRule, HandMadeMonitorRule, AliasSuggestionRule, ReaderHintRule, LargeOutputReadRule, RunTitleRule, SleepPollRule, JournalChainRule, JournalPipeRule, RedirectedRunRule, SilentRunRule, OutputStatusMonitorRule, LongRunDockRule, FolderChangeRule, RunnerRewriteRule, EndedOutputLineRule, WatchLinesRule, OrphanProcessRule, RunQueueHaltedRule]
    listeners = [StartReadersListener, WorkerTestCountListener, ReaderFailureListener, ReaderBlockListener, ReaderRequestCompleteListener, RunSlotListener, TestRunMarkerListener, WaitingMessageRunListener, EndedAgentRunsListener, BackgroundRunWatchListener, EndedProcessWatchListener, ReaderProofListener, OutputPruneListener, StoppedProcessOutputListener, OrphanedProcessKillListener, ProcessEndMarkListener]
    marks = PROCESS_MARKS
    bindings = [(WatchedRuns, MonitoredRuns)]
    docks = PROCESS_DOCKS
    windows = [WindowDeclaration("processes.outputs", "Commands", "outputs.js", WindowLoading.COMPONENT, skeleton=PROCESSES_OUTPUTS_SKELETON, search=WindowSearch(ProcessSearcher, "Search the commands"), icon=WindowIcon.TERMINAL, reads=WINDOW_READS, runs=WINDOW_RUNS, events=WINDOW_EVENTS),
               WindowDeclaration("processes.output", "Output", "output.js", WindowLoading.COMPONENT, skeleton=PROCESSES_OUTPUT_SKELETON, icon=WindowIcon.TERMINAL, auto_scroll=AutoScroll.BOTTOM, reads=WINDOW_READS, runs=WINDOW_RUNS, events=WINDOW_EVENTS)]
    seeders = [ProcessesSeeder]
