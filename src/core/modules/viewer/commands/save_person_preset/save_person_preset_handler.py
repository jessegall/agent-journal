from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.viewer.commands.save_person_preset.save_person_preset import SavePersonPreset
from core.modules.viewer.commands.support.layout_text import is_layout_text
from core.modules.viewer.models.person_preset import PersonPreset
from engine.actor.person_check import PersonCheck


class SavePersonPresetHandler(Handler[SavePersonPreset, PersonPreset]):
    """Writes a new preset row for the person, refusing a shape that is no layout and a name the person gave
    another preset of the page; the guard viewer.person-preset-owner refuses any caller but a person."""

    command = SavePersonPreset

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: SavePersonPreset, context: Context) -> PersonPreset:
        if context.environment_id is None:
            raise Refusal("a preset of a person belongs to an environment", "name one with --environment")
        if not is_layout_text(command.shape):
            raise Refusal(f"{command.shape} is no layout", "a layout is the viewer's layout tree: tabs with windows and active, or a split of two")
        PersonCheck.require(context, f"Save the layout preset {command.name}?")
        if self.queries.query(PersonPreset).filter(person_id=context.actor.id, page=command.page, name=command.name).exists():
            raise Refusal(f"you have a preset named {command.name} for {command.page} already", "journal person-preset rename gives it another name")
        return self.repository.save(PersonPreset(person_id=context.actor.id, creator_id=context.actor.id,
                                                page=command.page, name=command.name, shape=command.shape), context)
