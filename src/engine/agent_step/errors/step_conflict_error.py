class StepConflictError(Exception):
    """A step's save found the answer basis moved since the step read it, so the hook's whole write rolls back
    and the route checks again or answers by its fallback (doc 1310 section 6.6)."""

    def __init__(self) -> None:
        super().__init__("the answer basis moved while the step was decided")
