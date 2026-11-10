import re
import secrets
from datetime import timedelta

from engine.enums.actor_type import ActorType
from core.base.clock import Clock
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.scopes import Scopes
from core.base.text_digest import TextDigest
from core.base.timestamp import Timestamp
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from core.modules.plans.models.plan import Plan
from core.modules.sharing.commands.make_share_link.make_share_link import MakeShareLink
from core.modules.sharing.commands.support.share_invitation import ShareInvitation
from core.modules.sharing.commands.support.share_targets import ShareTargets
from core.modules.sharing.models.enums.share_link_state import ShareLinkState
from core.modules.sharing.models.share_link import ShareLink
from core.modules.sharing.support.share_password import SharePassword

TOKEN_BYTES = 24
LINK_LIFETIME_DAYS = 7
LINK_PATH = "/viewer/share/"
UNLIMITED = "never"
SPANS = {"h": timedelta(hours=1), "d": timedelta(days=1)}


class MakeShareLinkHandler(Handler[MakeShareLink, ShareInvitation]):
    """Makes a link to a row for the calling person, keeping the digest of its token and giving the token this
    once; an agent's link only asks: nothing opens until a person accepts it, and only then is there a token.
    """

    command = MakeShareLink

    def __init__(self, repository: Repository, clock: Clock, targets: ShareTargets, scopes: Scopes) -> None:
        self.repository, self.clock, self.targets, self.scopes = repository, clock, targets, scopes

    def handle(self, command: MakeShareLink, context: Context) -> ShareInvitation:
        shared = self.targets.row(command.target)
        if isinstance(shared, Plan):
            with self.scopes.row_scope(shared):
                return self.made(command, shared, context)
        if context.environment_id is None:
            raise Refusal(f"{command.target} belongs to no environment and neither does this caller", "run it from an environment")
        return self.made(command, shared, context)

    def made(self, command: MakeShareLink, shared: Doc | Report | Plan, context: Context) -> ShareInvitation:
        token = secrets.token_urlsafe(TOKEN_BYTES)
        is_person = context.actor.type is ActorType.USER
        link = self.repository.save(ShareLink(creator_id=context.actor.id, token_digest=TextDigest().hex_digest(token),
                                              row_model=shared.model_name, row_id=shared.id, expires_at=self.end_time(command.ends), comments=command.comments,
                                              password_digest=SharePassword.digest(command.password) if command.password else None, locked=bool(command.password),
                                              state=ShareLinkState.ACTIVE if is_person else ShareLinkState.WAITING), context)
        if is_person:
            return ShareInvitation(link.id, link.state.value, token, f"{LINK_PATH}{token}", link.expires_at)
        return ShareInvitation(link.id, link.state.value, None, None, link.expires_at)

    def end_time(self, ends: str) -> Timestamp | None:
        if ends == UNLIMITED:
            return None
        if not re.fullmatch(r"[1-9]\d*[hd]", ends):
            raise Refusal(f"a link cannot end after {ends!r}", "give a number of hours or days, such as 12h or 7d, or never")
        return Timestamp(self.clock.timestamp().value + int(ends[:-1]) * SPANS[ends[-1]])
