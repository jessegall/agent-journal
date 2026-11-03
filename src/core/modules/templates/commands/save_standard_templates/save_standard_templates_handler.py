from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.standard_rows import StandardRows
from core.modules.templates.commands.save_standard_templates.save_standard_templates import SaveStandardTemplates
from core.modules.templates.support.standard_templates import STANDARD_TEMPLATE_FIELDS, STANDARD_TEMPLATES


class SaveStandardTemplatesHandler(Handler[SaveStandardTemplates, None]):
    """Writes the templates the journal ships."""

    command = SaveStandardTemplates

    def __init__(self, standard: StandardRows) -> None:
        self.standard = standard

    def handle(self, command: SaveStandardTemplates, context: Context) -> None:
        self.standard.save_all(STANDARD_TEMPLATES, STANDARD_TEMPLATE_FIELDS, context)
