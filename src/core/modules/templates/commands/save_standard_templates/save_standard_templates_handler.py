from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.standard_rows import StandardRows
from core.modules.templates.commands.save_standard_templates.save_standard_templates import SaveStandardTemplates
from core.base.registry.registry import Registry
from core.modules.templates.models.template import Template

STANDARD_TEMPLATE_FIELDS = ("brief", "targets", "purpose", "parts", "commands", "module")


class SaveStandardTemplatesHandler(Handler[SaveStandardTemplates, None]):
    """Writes the templates the journal ships."""

    command = SaveStandardTemplates

    def __init__(self, standard: StandardRows, registry: Registry) -> None:
        self.standard, self.registry = standard, registry

    def handle(self, command: SaveStandardTemplates, context: Context) -> None:
        templates = tuple(Template.build(entry.declaration, entry.module) for entry in self.registry.templates)
        self.standard.save_all(Template, templates, STANDARD_TEMPLATE_FIELDS, context)
