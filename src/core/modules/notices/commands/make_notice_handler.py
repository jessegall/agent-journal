from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.notices.commands.make_notice import MakeNotice
from core.modules.notices.models.notice import Notice


class MakeNoticeHandler(Handler[MakeNotice, Notice]):
    """Saves a new notice in the caller's environment."""

    command = MakeNotice

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MakeNotice, context: Context) -> Notice:
        if context.environment_id is None:
            raise Refusal("a notice is pinned above one environment's chat", "name it with --environment")
        return self.repository.save(Notice(environment_id=context.environment_id, creator_id=context.actor.id, title=command.title, link=command.link,
                                           label=command.button_label), context)
