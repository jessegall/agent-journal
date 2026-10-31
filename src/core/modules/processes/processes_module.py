from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.processes.commands.end_process_handler import EndProcessHandler
from core.modules.processes.commands.end_process_part_handler import EndProcessPartHandler
from core.modules.processes.commands.end_process_part_subcommand import EndProcessPartSubcommand
from core.modules.processes.commands.end_process_subcommand import EndProcessSubcommand
from core.modules.processes.commands.read_output_subcommand import ReadOutputSubcommand
from core.modules.processes.commands.show_output_status_subcommand import ShowOutputStatusSubcommand
from core.modules.processes.guards.part_reported_by_its_agent_guard import PartReportedByItsAgentGuard
from core.modules.processes.guards.reported_by_its_agent_guard import ReportedByItsAgentGuard
from core.modules.processes.commands.lose_process import LoseProcess
from core.modules.processes.commands.move_process import MoveProcess
from core.modules.processes.commands.start_process_handler import StartProcessHandler
from core.modules.processes.commands.stop_process_handler import StopProcessHandler
from core.modules.processes.commands.stop_process_subcommand import StopProcessSubcommand
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


class ProcessesModule(Module):
    """Adds processes: every shell line an agent runs is kept as a numbered process with its parts and its output."""

    name = "journal.core.processes"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.waits", "journal.core.messages"]
    models = (ModelDeclaration(Process, query=ProcessQuery, commands=(MoveProcess, LoseProcess), excluded_subcommands=["make", "finish", "fail"]), ModelDeclaration(ProcessPart, excluded_subcommands=["make", "edit"]), ModelDeclaration(Output, query=OutputQuery, excluded_subcommands=["make", "edit"]), ModelDeclaration(Watch, query=WatchQuery), ModelDeclaration(Reader, query=ReaderQuery, excluded_subcommands=["make", "edit", "delete"]))
    migrations = [ProcessesTablesMigration, ReadersTableMigration, ShippedReadersMigration]
    handlers = [StartProcessHandler, EndProcessPartHandler, EndProcessHandler, StopProcessHandler, AddReaderHandler, RemoveReaderHandler, ChooseDefaultReaderHandler]
    subcommands = [StopProcessSubcommand, EndProcessSubcommand, EndProcessPartSubcommand, AddReaderSubcommand, RemoveReaderSubcommand, ChooseDefaultReaderSubcommand, ReadOutputSubcommand, ShowOutputStatusSubcommand]
    guards = [ReportedByItsAgentGuard, PartReportedByItsAgentGuard, ReaderOwnerGuard]
    driver_rules = [SleepPollRefusal, RunnerRewrite]
