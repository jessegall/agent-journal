from typing import TextIO


class CallerStream:
    """Where a request can tell its caller something while it waits. With no stream it writes nothing, and with --json
    it writes a blank line, which a JSON reader passes over. A write to a caller that left raises BrokenPipeError."""

    def __init__(self, stream: TextIO | None = None, is_json: bool = False) -> None:
        self.stream, self.is_json = stream, is_json

    def line(self, text: str) -> None:
        if self.stream is None:
            return
        self.stream.write("\n" if self.is_json else f"{text}\n")
        self.stream.flush()
