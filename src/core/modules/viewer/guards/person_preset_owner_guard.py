from engine.errors.refusal import Refusal
from core.modules.viewer.guards.person_row_guard import PersonRowGuard
from core.modules.viewer.models.person_preset import PersonPreset
from engine.change.changed import Changed


class PersonPresetOwnerGuard(PersonRowGuard[Changed[PersonPreset]]):
    """Refuses a preset of a person written by anyone but the person it is for."""

    name = "viewer.person-preset-owner"
    refusal = Refusal("this layout preset belongs to another person")
    question = "Change this saved layout preset?"

    def person_id(self, event: Changed[PersonPreset]) -> int:
        return event.row.person_id
