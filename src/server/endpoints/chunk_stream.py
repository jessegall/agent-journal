import io
from collections.abc import Callable


class ChunkStream(io.StringIO):
    """A text stream that hands each piece of output on as it is written, so the caller reads it before the
    command ends; it counts as closed once the caller has hung up."""

    def __init__(self, output_consumer: Callable[[bytes], None], caller_disconnected: Callable[[], bool] = lambda: False) -> None:
        self.output_consumer, self.caller_disconnected = output_consumer, caller_disconnected

    def write(self, text: str) -> int:
        if text:
            self.output_consumer(text.encode())
        return len(text)

    @property
    def closed(self) -> bool:
        return self.caller_disconnected()
