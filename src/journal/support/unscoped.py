class Unscoped(RuntimeError):
    """A scoped read or write ran with no environment in scope."""

    def __init__(self) -> None:
        super().__init__("no environment in scope: a scoped read runs behind a door that sets one, or inside scope.of(environment_id)")
