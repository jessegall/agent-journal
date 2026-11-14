from engine.command.outside_work import OutsideWork


class OutsideRunRollbackError(Exception):
    """Rolls a command back so its outside work runs with no lock held, and the command runs again. It is no refusal,
    so what catches a refusal lets it pass."""

    def __init__(self, work: OutsideWork) -> None:
        super().__init__(work.label())
        self.work = work
