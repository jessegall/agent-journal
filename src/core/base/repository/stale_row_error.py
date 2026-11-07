from core.base.refusal import Refusal


class StaleRowError(Refusal):
    """Raised when a row is saved from a copy read before someone else changed it."""

    def __init__(self, cli_name: str, row_id: int) -> None:
        super().__init__(f"{cli_name} {row_id} changed since it was read", "read it again and repeat the change")
