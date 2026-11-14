from engine.errors.refusal import Refusal


class LongChildError(Refusal):
    """A hook asked to wait on long work, such as a merge waiting for its place in the long lane."""

    def __init__(self, class_name: str, line: str) -> None:
        super().__init__("a hook cannot wait on long work", f"queue it as a follow-up ({class_name}: {line})")
