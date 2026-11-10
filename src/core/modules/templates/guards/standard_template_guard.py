from engine.guard.guard import Guard
from engine.repository.standard_rows import StandardRows
from engine.event.changed import Changed
from engine.command.context import Context
from core.modules.templates.models.template import Template


class StandardTemplateGuard(Guard[Changed[Template]]):
    """Refuses a change to a template that comes with the journal: each start writes it again."""

    name = "templates.standard-is-locked"

    def check(self, event: Changed[Template], context: Context) -> None:
        StandardRows.refuse_change(event.old_row, context.actor)
