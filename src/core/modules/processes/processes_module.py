from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
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
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.waits"]
    models = (ModelDeclaration(Process, query=ProcessQuery), ModelDeclaration(ProcessPart), ModelDeclaration(Output, query=OutputQuery), ModelDeclaration(Watch, query=WatchQuery))
    migrations = [ProcessesTablesMigration]
