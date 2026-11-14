from dataclasses import dataclass

from core.modules.documents.models.enums.work_context_order import WorkContextOrder


@dataclass(frozen=True)
class WorkContextRequest:
    """The requested conversation page, text segment or ancestry continuation."""

    page: int = 1
    page_size: int = 5
    message_id: int | None = None
    text_offset: int = 0
    ancestor_cursor: str | None = None
    attachment: str | None = None
    attachment_page: int | None = None
    order: WorkContextOrder = WorkContextOrder.OLDEST
