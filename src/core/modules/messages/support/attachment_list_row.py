from typing import TypedDict


class AttachmentListRow(TypedDict):
    """The JSON form of AttachmentListSubcommand.listed."""

    message_id: int
    name: str
    message_text: str
    created_at: str
    is_image: bool
