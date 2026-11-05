class UnboundValueError(Exception):
    """Raised when the container is asked to make a standard library value, such as a path."""

    def __init__(self, class_type: type) -> None:
        super().__init__(f"{class_type.__name__} is a value the container never makes up: bind it, or bind the class that asks for it")
