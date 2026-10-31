from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.viewer.commands.rename_person_preset import RenamePersonPreset
from core.modules.viewer.models.person_preset import PersonPreset


class RenamePersonPresetHandler(Handler[RenamePersonPreset, PersonPreset]):
    """Saves the new name on the row; the owner guard refuses a row of someone else's."""

    command = RenamePersonPreset

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RenamePersonPreset, context: Context) -> PersonPreset:
        return self.repository.save(replace(self.queries.query(PersonPreset).find(command.row_id), name=command.name), context)
