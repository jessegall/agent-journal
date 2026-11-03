from core.modules.processes.listeners.waiting_message_run_listener import WaitingMessageRunListener
from core.base.skill.skill_declaration import SkillDeclaration
from core.modules.processes.support.process_nudges import PROCESS_NUDGES
from core.base.driver.watched_runs import WatchedRuns
from core.modules.processes.support.monitored_runs import MonitoredRuns
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
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
from core.modules.processes.rules.watch_lines_rule import WatchLinesRule
from core.modules.processes.commands.prune_outputs.prune_outputs_handler import PruneOutputsHandler
from core.modules.processes.listeners.output_prune_listener import OutputPruneListener
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.rules.leftover_run_rule import LeftoverRunRule
from core.modules.processes.rules.orphan_process_rule import OrphanProcessRule
from core.modules.processes.listeners.output_dock_listener import OutputDockListener
from core.modules.processes.listeners.run_slot_listener import RunSlotListener
from core.modules.processes.rules.alias_suggestion_rule import AliasSuggestionRule
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

WINDOW_READS = ["process card", "process show", "process feed", "output peek"]
WINDOW_RUNS = ["output stop", "output watch"]
WINDOW_EVENTS = ["process.*", "output.*"]


class ProcessesModule(Module):
    """Adds processes: every shell line an agent runs is kept as a numbered process with its parts and its
    output."""

    name = "journal.core.processes"
    nudges = PROCESS_NUDGES
    skills = [SkillDeclaration("journal-shell", "Run shell commands through the journal and read what they printed; read it before reading an output, or writing a reader or an alias.",
                               keywords=("output", "reader", "alias"))]
    requires_core = ">=5,<6"
    block_conditions = [OutputEnded, OutputRead, OutputMonitored]
    settings = PROCESS_SETTINGS
    moves = [ProcessesMove]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.waits", "journal.core.messages", "journal.core.chat", "journal.core.docking"]
    models = (ModelDeclaration(Process, query=ProcessQuery, commands=(MoveProcess, OrphanProcess), excluded_subcommands=["make", "finish", "fail", "stop"]), ModelDeclaration(ProcessPart, query=ProcessPartQuery, excluded_subcommands=["make", "edit"]), ModelDeclaration(Output, query=OutputQuery, excluded_subcommands=["make", "edit"]), ModelDeclaration(Watch, query=WatchQuery), ModelDeclaration(Reader, query=ReaderQuery, excluded_subcommands=["make", "edit", "delete"]))
    views = [ProcessRow]
    migrations = [ProcessQueueMigration, VitestReaderCommandsMigration, ProcessFullTestRunMigration, EndedAgentRunsMigration, ReaderStepsAndTitlesMigration, ProcessesTablesMigration, ReadersTableMigration, StockReadersMigration, OutputReadersMigration, ReaderPluginsMigration, WatchPercentMigration, ProcessStateIndexMigration, ProcessPartCategoryMigration]
    handlers = [TitleOutputHandler, StartProcessHandler, StartProcessPartHandler, EndProcessPartHandler, EndProcessHandler, StopProcessHandler, AddReaderHandler, RemoveReaderHandler, ChooseDefaultReaderHandler, ReadOutputHandler, WatchOutputHandler, UnwatchOutputHandler, RecordGivenPercentHandler, PruneOutputsHandler, ReadNewOutputHandler]
    subcommands = [ProcessFeedSubcommand, ProcessCardSubcommand, TitleOutputSubcommand, StopProcessSubcommand, EndProcessSubcommand, StartProcessPartSubcommand, EndProcessPartSubcommand, AddReaderSubcommand, RemoveReaderSubcommand, ChooseDefaultReaderSubcommand, ReadOutputSubcommand, ShowOutputStatusSubcommand, PeekOutputSubcommand, WatchOutputSubcommand, UnwatchOutputSubcommand]
    guards = [RunOwnerReportsGuard, RunOwnerPartsGuard, ReaderOwnerGuard, EndedProcessDockGuard]
    driver_rules = [LeftoverRunRule, HandMadeMonitorRule, AliasSuggestionRule, ReaderHintRule, RunTitleRule, SleepPollRule, JournalChainRule, JournalPipeRule, RedirectedRunRule, SilentRunRule, OutputStatusMonitorRule, LongRunDockRule, FolderChangeRule, RunnerRewriteRule, EndedOutputLineRule, WatchLinesRule, OrphanProcessRule]
    listeners = [RunSlotListener, TestRunMarkerListener, WaitingMessageRunListener, EndedAgentRunsListener, BackgroundRunWatchListener, EndedProcessWatchListener, OutputPruneListener, StoppedProcessOutputListener, OrphanedProcessKillListener, ProcessEndMarkListener, OutputDockListener]
    marks = PROCESS_MARKS
    bindings = [(WatchedRuns, MonitoredRuns)]
    docks = PROCESS_DOCKS
    windows = [WindowDeclaration("processes.outputs", "Commands", "outputs.js", WindowLoading.COMPONENT, search=WindowSearch(ProcessSearcher, "Search the commands"), icon=WindowIcon.TERMINAL, reads=WINDOW_READS, runs=WINDOW_RUNS, events=WINDOW_EVENTS),
               WindowDeclaration("processes.output", "Output", "output.js", WindowLoading.COMPONENT, icon=WindowIcon.TERMINAL, reads=WINDOW_READS, runs=WINDOW_RUNS, events=WINDOW_EVENTS)]
    seeders = [ProcessesSeeder]
