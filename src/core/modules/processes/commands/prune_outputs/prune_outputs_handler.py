from datetime import timedelta

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.conditions.less import Less
from core.base.repository.repository import Repository
from core.base.timestamp import Timestamp
from core.modules.processes.commands.prune_outputs.prune_outputs import PruneOutputs
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings


class PruneOutputsHandler(Handler[PruneOutputs, int]):
    """Prunes the kept outputs beyond the limit and removes their folders: never one that ended within the
    kept minutes; those that ended first, and among them the outputs no reader reads before a test run's or a
    build's."""

    command = PruneOutputs

    def __init__(self, outputs: OutputQuery, repository: Repository, folder: OutputFolder, settings: ProcessSettings) -> None:
        self.outputs, self.repository, self.folder, self.settings = outputs, repository, folder, settings

    def handle(self, command: PruneOutputs, context: Context) -> int:
        excess = self.outputs.ended().count() - self.settings.integer(ProcessSetting.OUTPUTS_KEPT_COUNT, command.environment_id)
        if excess <= 0:
            return 0
        cutoff = context.timestamp.value - timedelta(minutes=self.settings.integer(ProcessSetting.OUTPUTS_KEPT_MINUTES, command.environment_id))
        old_enough = self.outputs.ended().matching(Less("ended_at", Timestamp(cutoff).text))
        plain = tuple(old_enough.matching(IsNull("reader_id")).ordered("ended_at").page(1, excess).rows)
        read = old_enough.matching(Greater("reader_id", 0)).ordered("ended_at").page(1, excess).rows
        for output in (*plain, *read)[:excess]:
            self.repository.save(output.prune(context.timestamp, context.actor), context)
            self.folder.remove(output.process_id)
        return excess
