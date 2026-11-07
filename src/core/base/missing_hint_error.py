class MissingHintError(Exception):
    """Raised when a class asks for something in its constructor without saying its type."""

    def __init__(self, class_type: type, parameter: str) -> None:
        super().__init__(f"{class_type.__name__}.__init__ gives no type for {parameter}, so the container cannot build it")
