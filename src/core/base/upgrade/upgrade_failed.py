class UpgradeFailed(Exception):
    """Raised when a module's move from version 4 failed; its rows were rolled back and the moves before it stay.
    It names the module, the reason and the modules whose moves stand."""

    def __init__(self, message: str, module: str = "", reason: str = "", finished: tuple[str, ...] = ()) -> None:
        super().__init__(message)
        self.module, self.reason, self.finished = module, reason, finished
