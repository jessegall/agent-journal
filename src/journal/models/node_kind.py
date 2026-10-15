from enum import StrEnum


class NodeKind(StrEnum):
    TRIGGER = "trigger"
    CHECK = "check"
    ACTION = "action"
