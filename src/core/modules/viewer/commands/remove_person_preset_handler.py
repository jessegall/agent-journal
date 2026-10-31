from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.viewer.commands.remove_person_preset import RemovePersonPreset
from core.modules.viewer.models.person_preset import PersonPreset


class RemovePersonPresetHandler(Handler[RemovePersonPreset, PersonPreset]):
    """Deletes the row when it is the caller's own, since the owner guard passes deletes by."""

    command = RemovePersonPreset

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RemovePersonPreset, context: Context) -> PersonPreset:
        layout = self.queries.query(PersonPreset).find(command.row_id)
        if layout.person_id != context.actor.id:
            raise Refusal(f"preset {layout.id} is another person's", "journal person-preset list lists yours")
        self.repository.delete(layout, context)
        return layout
