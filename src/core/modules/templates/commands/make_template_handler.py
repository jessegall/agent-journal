from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.templates.commands.make_template import MakeTemplate
from core.modules.templates.models.template import Template


class MakeTemplateHandler(Handler[MakeTemplate, Template]):
    """Saves a new template."""

    command = MakeTemplate

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MakeTemplate, context: Context) -> Template:
        return self.repository.save(Template(creator_id=context.actor.id, title=command.title, brief=command.brief, targets=command.targets, purpose=command.purpose,
                                             parts=command.parts, commands=command.commands), context)
