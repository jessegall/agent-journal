from enum import StrEnum


class KeptReason(StrEnum):
    """Why the assignment of a parent row left the assignment of a child row as it was."""

    HAND_GIVEN = "given by hand"
    INHERITED_ELSEWHERE = "inherited from another row"
