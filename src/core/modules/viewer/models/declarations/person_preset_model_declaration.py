from engine.module.model_declaration import ModelDeclaration
from core.modules.viewer.models.person_preset import PersonPreset


class PersonPresetModelDeclaration(ModelDeclaration):
    """How the module declares PersonPreset."""

    model = PersonPreset
    excluded_subcommands = ["make", "edit", "delete"]
