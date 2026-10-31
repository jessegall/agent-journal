from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.processes.commands.end_process_handler import EndProcessHandler
from core.modules.processes.commands.end_process_part_handler import EndProcessPartHandler
from core.modules.processes.commands.end_process_part_subcommand import EndProcessPartSubcommand
from core.modules.processes.commands.end_process_subcommand import EndProcessSubcommand
from core.modules.processes.commands.peek_output_subcommand import PeekOutputSubcommand
from core.modules.processes.commands.read_output_handler import ReadOutputHandler
from core.modules.processes.commands.read_output_subcommand import ReadOutputSubcommand
from core.modules.processes.commands.show_output_status_subcommand import ShowOutputStatusSubcommand
from core.modules.processes.commands.mark_watch_seen_handler import MarkWatchSeenHandler
from core.modules.processes.commands.unwatch_output_handler import UnwatchOutputHandler
from core.modules.processes.commands.unwatch_output_subcommand import UnwatchOutputSubcommand
from core.modules.processes.commands.watch_output_handler import WatchOutputHandler
from core.modules.processes.commands.watch_output_subcommand import WatchOutputSubcommand
from core.modules.processes.listeners.ended_process_watch_listener import EndedProcessWatchListener
from core.modules.processes.rules.watch_lines import WatchLines
from core.modules.processes.commands.prune_outputs_handler import PruneOutputsHandler
from core.modules.processes.listeners.output_prune_listener import OutputPruneListener
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.rules.lost_process_rule import LostProcessRule
from core.modules.processes.commands.note_progress_handler import NoteProgressHandler
from core.modules.processes.listeners.output_dock_listener import OutputDockListener
from core.modules.processes.listeners.process_end_mark_listener import ProcessEndMarkListener
from core.modules.processes.rules.process_progress_rule import ProcessProgressRule
from core.modules.processes.support.process_marks import PROCESS_DOCKS, PROCESS_MARKS
from core.modules.processes.guards.part_reported_by_its_agent_guard import PartReportedByItsAgentGuard
from core.modules.processes.guards.reported_by_its_agent_guard import ReportedByItsAgentGuard
from core.modules.processes.commands.lose_process import LoseProcess
from core.modules.processes.commands.move_process import MoveProcess
from core.modules.processes.commands.start_process_handler import StartProcessHandler
from core.modules.processes.commands.stop_process_handler import StopProcessHandler
from core.modules.processes.commands.stop_process_subcommand import StopProcessSubcommand
from core.modules.processes.rules.ended_output_line import EndedOutputLine
from core.modules.processes.rules.unread_output_reminder import UnreadOutputReminder
from core.modules.processes.rules.runner_rewrite import RunnerRewrite
from core.modules.processes.rules.sleep_poll_refusal import SleepPollRefusal
from core.modules.processes.commands.add_reader_handler import AddReaderHandler
from core.modules.processes.commands.add_reader_subcommand import AddReaderSubcommand
from core.modules.processes.commands.choose_default_reader_handler import ChooseDefaultReaderHandler
from core.modules.processes.commands.choose_default_reader_subcommand import ChooseDefaultReaderSubcommand
from core.modules.processes.commands.remove_reader_handler import RemoveReaderHandler
from core.modules.processes.commands.remove_reader_subcommand import RemoveReaderSubcommand
from core.modules.processes.guards.reader_owner_guard import ReaderOwnerGuard
from core.modules.processes.migrations.m002_readers import ReadersTableMigration
from core.modules.processes.migrations.m003_shipped_readers import ShippedReadersMigration
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

WINDOW_READS = ["output list", "process list", "process show", "output peek"]
WINDOW_RUNS = ["output stop", "output watch"]
WINDOW_EVENTS = ["process.*", "output.*"]


class ProcessesModule(Module):
    """Adds processes: every shell line an agent runs is kept as a numbered process with its parts and its output."""

    name = "journal.core.processes"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.waits", "journal.core.messages", "journal.core.chat", "journal.core.docking"]
    models = (ModelDeclaration(Process, query=ProcessQuery, commands=(MoveProcess, LoseProcess), excluded_subcommands=["make", "finish", "fail", "stop"]), ModelDeclaration(ProcessPart, query=ProcessPartQuery, excluded_subcommands=["make", "edit"]), ModelDeclaration(Output, query=OutputQuery, excluded_subcommands=["make", "edit"]), ModelDeclaration(Watch, query=WatchQuery), ModelDeclaration(Reader, query=ReaderQuery, excluded_subcommands=["make", "edit", "delete"]))
    migrations = [ProcessesTablesMigration, ReadersTableMigration, ShippedReadersMigration]
    handlers = [StartProcessHandler, EndProcessPartHandler, EndProcessHandler, StopProcessHandler, AddReaderHandler, RemoveReaderHandler, ChooseDefaultReaderHandler, ReadOutputHandler, WatchOutputHandler, UnwatchOutputHandler, MarkWatchSeenHandler, PruneOutputsHandler, NoteProgressHandler]
    subcommands = [StopProcessSubcommand, EndProcessSubcommand, EndProcessPartSubcommand, AddReaderSubcommand, RemoveReaderSubcommand, ChooseDefaultReaderSubcommand, ReadOutputSubcommand, ShowOutputStatusSubcommand, PeekOutputSubcommand, WatchOutputSubcommand, UnwatchOutputSubcommand]
    guards = [ReportedByItsAgentGuard, PartReportedByItsAgentGuard, ReaderOwnerGuard]
    driver_rules = [SleepPollRefusal, RunnerRewrite, EndedOutputLine, UnreadOutputReminder, WatchLines, LostProcessRule, ProcessProgressRule]
    listeners = [EndedProcessWatchListener, OutputPruneListener, ProcessEndMarkListener, OutputDockListener]
    marks = PROCESS_MARKS
    docks = PROCESS_DOCKS
    windows = [WindowDeclaration("processes.outputs", "Commands", "outputs.js", WindowLoading.COMPONENT, icon=WindowIcon.TERMINAL, reads=WINDOW_READS, runs=WINDOW_RUNS, events=WINDOW_EVENTS),
               WindowDeclaration("processes.output", "Output", "output.js", WindowLoading.COMPONENT, icon=WindowIcon.TERMINAL, reads=WINDOW_READS, runs=WINDOW_RUNS, events=WINDOW_EVENTS)]
