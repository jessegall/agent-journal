from core.base.registry.inspector_entry import InspectorEntry
from core.base.registry.registry import Registry
from core.base.viewer.inspector_declaration import InspectorDeclaration


class InspectorDefaults:
    """The inspectors of the installed models that no module declares one for: the default declaration of each,
    supplied by the module that adds the model."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def entries(self) -> tuple[InspectorEntry, ...]:
        declared = {entry.declaration.model_name for entry in self.registry.inspectors}
        return tuple(InspectorEntry(entry.module, InspectorDeclaration.default_declaration(entry.model.loaded()), True)
                     for model_name, entry in self.registry.models.items() if model_name not in declared)
