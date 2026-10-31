from collections.abc import Callable
import io


class ChunkStream(io.StringIO):
    """A text stream that hands each piece of output on as it is written, so the caller reads it before the
    command ends."""

    def __init__(self, output_consumer: Callable[[bytes], None]) -> None:
        self.output_consumer = output_consumer

    def write(self, text: str) -> int:
        if text:
            self.output_consumer(text.encode())
        return len(text)
