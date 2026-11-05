from enum import StrEnum


class CommentSelectionType(StrEnum):
    """What a comment's selection is: running text, a line of code, or a row of a table."""

    TEXT = "text"
    CODE = "code"
    ROW = "row"
