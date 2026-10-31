import secrets
from datetime import timedelta

from core.base.actor_type import ActorType
from core.base.clock import Clock
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.text_digest import TextDigest
from core.base.timestamp import Timestamp
from core.modules.sharing.commands.make_share_link import MakeShareLink
from core.modules.sharing.commands.share_invitation import ShareInvitation
from core.modules.sharing.commands.share_targets import ShareTargets
from core.modules.sharing.models.share_link import ShareLink

TOKEN_BYTES = 24
LINK_LIFETIME_DAYS = 7
LINK_PATH = "/viewer/share/"


class MakeShareLinkHandler(Handler[MakeShareLink, ShareInvitation]):
    """Makes a link for the calling person to a plan, keeping the digest of its token and giving the token
    this once; the link ends a week after it is made."""

    command = MakeShareLink

    def __init__(self, repository: Repository, clock: Clock, targets: ShareTargets) -> None:
        self.repository, self.clock, self.targets = repository, clock, targets

    def handle(self, command: MakeShareLink, context: Context) -> ShareInvitation:
        if context.actor.type is not ActorType.USER:
            raise Refusal("only a person shares", "ask the user to share it from the viewer")
        plan = self.targets.plan(command.target)
        token = secrets.token_urlsafe(TOKEN_BYTES)
        expires_at = Timestamp(self.clock.timestamp().value + timedelta(days=LINK_LIFETIME_DAYS))
        link = self.repository.save(ShareLink(environment_id=plan.environment_id, creator_id=context.actor.id, token_digest=TextDigest().hex_digest(token),
                                              row_model=plan.model_name, row_id=plan.id, expires_at=expires_at), context)
        return ShareInvitation(link.id, token, f"{LINK_PATH}{token}", expires_at)
