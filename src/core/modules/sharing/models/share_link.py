from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.sharing.models.enums.share_link_state import ShareLinkState
from core.modules.sharing.models.lifecycles.share_link_lifecycle import ShareLinkLifecycle


@dataclass(frozen=True, kw_only=True)
class ShareLink(Model):
    """A link a person made to show one row read-only, until it expires or is revoked; it keeps only the digest
    of its token, never the token."""

    model_name = "share_link"
    cli_name = "share"
    lifecycle = ShareLinkLifecycle
    hidden_fields = frozenset({"token_digest"})

    environment_id: int
    creator_id: int
    token_digest: str
    row_model: str
    row_id: int
    expires_at: Timestamp
    comments: bool = False
    state: ShareLinkState = ShareLinkState.ACTIVE
