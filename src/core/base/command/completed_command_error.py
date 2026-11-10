from engine.errors.refusal import Refusal


class CompletedCommandError(Refusal):
    """A refused command whose work has already been completed or whose row has ended."""

    @property
    def is_completed(self) -> bool:
        return True
