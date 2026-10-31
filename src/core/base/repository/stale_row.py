from core.base.refusal import Refusal


class StaleRow(Refusal):
    """Raised when a row is saved from a copy read before someone else changed it."""

    def __init__(self, cli_noun: str, row_id: int) -> None:
        super().__init__(f"{cli_noun} {row_id} changed since it was read", "read it again and repeat the change")
