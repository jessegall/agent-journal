from enum import StrEnum


class TransformSlot(StrEnum):
    """The three fixed slots that may rewrite an admitted tool input, in their order."""

    ALIAS = "alias"
    PROJECT_HOOK = "project-hook"
    RUNNER = "runner"
