class BuiltTwiceError(Exception):
    """Raised when a container builds a class that is built once a second time, naming both places."""

    def __init__(self, class_type: type, first_place: str, second_place: str) -> None:
        super().__init__(f"{class_type.__qualname__} was built a second time in one container\nfirst built at:\n{first_place}\nbuilt again at:\n{second_place}")
        self.class_type = class_type
