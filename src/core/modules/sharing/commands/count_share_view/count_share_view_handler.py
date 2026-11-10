from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.sharing.commands.count_share_view.count_share_view import CountShareView
from core.modules.sharing.models.share_link import ShareLink


class CountShareViewHandler(Handler[CountShareView, ShareLink]):
    """Adds one to a link's views; only the viewer counts them."""

    command = CountShareView

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: CountShareView, context: Context) -> ShareLink:
        if context.actor.type is not ActorType.CORE:
            raise Refusal("only the viewer counts a link's views")
        link = self.queries.query(ShareLink).filter(token_digest=command.token_digest).first()
        if link is None:
            raise Refusal("no share link has this token", "the link may have been removed")
        return self.repository.save(link.changed(view_count=link.view_count + 1), context)
