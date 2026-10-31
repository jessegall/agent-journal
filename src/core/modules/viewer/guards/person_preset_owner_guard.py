from core.base.refusal import Refusal
from core.modules.viewer.guards.person_row_guard import PersonRowGuard
from core.modules.viewer.models.person_preset import PersonPreset


class PersonPresetOwnerGuard(PersonRowGuard):
    """Refuses a preset of a person written by anyone but the person it is for."""

    name = "viewer.person-preset-owner"
    event = "person_preset.*"
    model = PersonPreset
    refusal = Refusal("only a person keeps a layout", "the viewer saves a preset when the person saves one")
