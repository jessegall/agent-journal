class UnregisteredListenerStateError(Exception):
    """Raised when a state listener's state is no registered agent state."""

    def __init__(self, state_name: str) -> None:
        super().__init__(f"agent state {state_name} is not registered")
