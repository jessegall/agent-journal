from typing import TypedDict


class AttachmentListRow(TypedDict):
    """The JSON form of AttachmentListSubcommand.listed."""

    message_id: object
    name: object
    message_text: object
    created_at: object
    is_image: object
