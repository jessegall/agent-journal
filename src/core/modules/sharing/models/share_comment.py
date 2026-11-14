from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class ShareComment(Model):
    """What a visitor wrote on a shared row, under a name of their own."""

    model_name = "share_comment"
    cli_name = "share-comment"

    share_link_id: int
    creator_id: int
    visitor_name: str
    text: str
