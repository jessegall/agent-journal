from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.processes.commands.prune_outputs import PruneOutputs
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings


class PruneOutputsHandler(Handler[PruneOutputs, int]):
    """Prunes the oldest kept outputs beyond the limit and removes their folders."""

    command = PruneOutputs

    def __init__(self, outputs: OutputQuery, repository: Repository, folder: OutputFolder, settings: ProcessSettings) -> None:
        self.outputs, self.repository, self.folder, self.settings = outputs, repository, folder, settings

    def handle(self, command: PruneOutputs, context: Context) -> int:
        excess = self.outputs.kept().count() - self.settings.outputs_kept(command.environment_id)
        if excess <= 0:
            return 0
        for output in tuple(self.outputs.kept().oldest().page(1, excess).rows):
            self.repository.save(output.prune(context.timestamp, context.actor), context)
            self.folder.remove(output.process_id)
        return excess
