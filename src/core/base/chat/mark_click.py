from enum import StrEnum


class MarkClick(StrEnum):
    """What a click on a mark's line does: opens its second line in place, opens the row it names, opens a page, or
    nothing."""

    UNFOLD = "unfold"
    OPEN_ROW = "open row"
    OPEN_PAGE = "open page"
    NOTHING = "nothing"
