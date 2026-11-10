from typing import TextIO


class CallerStream:
    """Writes progress to a caller, or a blank line for JSON; a closed stream raises BrokenPipeError."""

    def __init__(self, stream: TextIO | None = None, is_json: bool = False) -> None:
        self.stream, self.is_json = stream, is_json

    def line(self, text: str) -> None:
        if self.stream is None:
            return
        self.stream.write("\n" if self.is_json else f"{text}\n")
        self.stream.flush()
