from enum import StrEnum


class KeptReason(StrEnum):
    """Why the assignment of a parent row left the assignment of a child row as it was."""

    HAND_GIVEN = "given by hand"
    FOREIGN_SOURCE = "inherited from another row"
    MODEL_RULE = "passed over by its model"
