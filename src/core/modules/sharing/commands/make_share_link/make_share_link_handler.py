import re
import secrets
from datetime import timedelta

from core.base.actor_type import ActorType
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.text_digest import TextDigest
from core.base.timestamp import Timestamp
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.sharing.commands.make_share_link.make_share_link import MakeShareLink
from core.modules.sharing.commands.support.share_invitation import ShareInvitation
from core.modules.sharing.commands.support.share_targets import ShareTargets
from core.modules.sharing.models.enums.share_link_state import ShareLinkState
from core.modules.sharing.models.share_link import ShareLink
from core.modules.sharing.support.share_password import SharePassword

TOKEN_BYTES = 24
LINK_LIFETIME_DAYS = 7
LINK_PATH = "/viewer/share/"
NEVER = "never"
SPANS = {"h": timedelta(hours=1), "d": timedelta(days=1)}


class MakeShareLinkHandler(Handler[MakeShareLink, ShareInvitation]):
    """Makes a link to a row for the calling person, keeping the digest of its token and giving the token this
    once; an agent's link only asks: nothing opens until a person accepts it, and only then is there a token."""

    command = MakeShareLink

    def __init__(self, repository: Repository, clock: Clock, targets: ShareTargets, bus: Bus) -> None:
        self.repository, self.clock, self.targets, self.bus = repository, clock, targets, bus

    def handle(self, command: MakeShareLink, context: Context) -> ShareInvitation:
        shared = self.targets.row(command.target)
        token = secrets.token_urlsafe(TOKEN_BYTES)
        is_person = context.actor.type is ActorType.USER
        link = self.repository.save(ShareLink(environment_id=shared.environment_id, creator_id=context.actor.id, token_digest=TextDigest().hex_digest(token),
                                              row_model=shared.model_name, row_id=shared.id, expires_at=self.end_time(command.ends), comments=command.comments,
                                              password_digest=SharePassword.digest(command.password) if command.password else None, locked=bool(command.password),
                                              state=ShareLinkState.ACTIVE if is_person else ShareLinkState.WAITING), context)
        if is_person:
            return ShareInvitation(link.id, link.state.value, token, f"{LINK_PATH}{token}", link.expires_at)
        asking = SendMessage(f"I ask to share {shared.model_name} {shared.id}, {shared.title}. Nothing opens until you accept it on the Shares window.\n\nshare {link.id}")
        self.bus.dispatch(asking, context.nested(asking))
        return ShareInvitation(link.id, link.state.value, None, None, link.expires_at)

    def end_time(self, ends: str) -> Timestamp | None:
        if ends == NEVER:
            return None
        if not re.fullmatch(r"[1-9]\d*[hd]", ends):
            raise Refusal(f"a link cannot end after {ends!r}", "give a number of hours or days, such as 12h or 7d, or never")
        return Timestamp(self.clock.timestamp().value + int(ends[:-1]) * SPANS[ends[-1]])
