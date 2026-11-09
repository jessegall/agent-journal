from core.base.refusal import Refusal


class CodeVersionMissingError(Refusal):
    """Raised when a switch names a code version that has no folder."""

    def __init__(self, tag: str) -> None:
        super().__init__(f"no code version {tag}", "add it first")
