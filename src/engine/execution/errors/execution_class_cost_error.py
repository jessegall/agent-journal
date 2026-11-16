from engine.errors.refusal import Refusal


class ExecutionClassCostError(Refusal):
    """Raised when a class costs more slot units than its pool holds, so it could never start."""

    def __init__(self, overrun: str) -> None:
        super().__init__(overrun, "lower the cost or raise the capacity")
