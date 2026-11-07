import secrets

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.text_digest import TextDigest
from core.base.timestamp import Timestamp
from core.modules.agents.support.person_check import PersonCheck
from core.modules.sharing.commands.accept_share_link.accept_share_link import AcceptShareLink
from core.modules.sharing.commands.make_share_link.make_share_link_handler import LINK_PATH, TOKEN_BYTES
from core.modules.sharing.commands.support.share_invitation import ShareInvitation
from core.modules.sharing.models.lifecycles.share_link_lifecycle import ShareLinkLifecycle
from core.modules.sharing.models.share_link import ShareLink


class AcceptShareLinkHandler(Handler[AcceptShareLink, ShareInvitation]):
    """Opens an agent's link for the person who accepts it, who becomes its owner and is the only one shown
    its token, this once."""

    command = AcceptShareLink

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: AcceptShareLink, context: Context) -> ShareInvitation:
        PersonCheck.require(context, "Accept this share request?", returns_output=True)
        token = secrets.token_urlsafe(TOKEN_BYTES)
        link = self.queries.query(ShareLink).find(command.link_id)
        accepted = self.repository.save(link.moved(ShareLinkLifecycle.accept, token_digest=TextDigest().hex_digest(token), creator_id=context.actor.id, expires_at=self.end_time(link, context)), context)
        return ShareInvitation(accepted.id, accepted.state.value, token, f"{LINK_PATH}{token}", accepted.expires_at)

    @staticmethod
    def end_time(link: ShareLink, context: Context) -> Timestamp | None:
        if link.expires_at is None:
            return None
        return Timestamp(link.expires_at.value + (context.timestamp.value - link.creation_timestamp().value))
