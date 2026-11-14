class LateResolveError(Exception):
    """Raised when a container whose boot ended builds a handler, listener, guard or rule it did not build at boot."""

    def __init__(self, class_type: type, place: str) -> None:
        super().__init__(f"{class_type.__qualname__} was built after boot; build it when the container boots\nbuilt at:\n{place}")
        self.class_type = class_type
