from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.sharing.models.enums.share_link_state import ShareLinkState
from core.modules.sharing.models.lifecycles.share_link_lifecycle import ShareLinkLifecycle


@dataclass(frozen=True, kw_only=True)
class ShareLink(EnvironmentScoped, Model):
    """A link to show one row read-only, until it expires, if it does, or is revoked; an agent's waits for a
    person to
    accept it. It keeps only the digests of its token and password, never the two themselves."""

    model_name = "share_link"
    cli_name = "share"
    search_fields = ["row_model", "state"]
    lifecycle = ShareLinkLifecycle
    hidden_fields = frozenset({"token_digest", "password_digest"})

    environment_id: int = 0
    creator_id: int
    token_digest: str
    row_model: str
    row_id: int
    expires_at: Timestamp | None = None
    comments: bool = False
    password_digest: str | None = None
    locked: bool = False
    view_count: int = 0
    state: ShareLinkState = ShareLinkState.ACTIVE
