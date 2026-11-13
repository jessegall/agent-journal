from typing import TypedDict


class LinkPageJsonRecord(TypedDict):
    """The JSON form of a LinkPage as LinkPages.payload writes it."""

    rows: list[dict[str, object]]
    counterparts: list[dict[str, object]]
    page: int
    page_size: int
    total: int
    has_next_page: bool
    next_page: int | None
    next_command: str | None
    categories: dict[str, int]
