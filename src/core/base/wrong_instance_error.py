class WrongInstanceError(Exception):
    """Raised when the value stored for a class is not an instance of that class."""

    def __init__(self, class_type: type, instance: object) -> None:
        super().__init__(f"the value bound for {class_type.__name__} is a {type(instance).__name__}")
