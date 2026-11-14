from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery


class ProcessModelDeclaration(ModelDeclaration):
    """How the module declares Process."""

    model = Process
    query = ProcessQuery
    commands = (MoveProcess, OrphanProcess)
    excluded_subcommands = ["make", "finish", "fail", "stop"]
