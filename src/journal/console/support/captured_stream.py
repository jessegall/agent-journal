import io
import sys
from contextlib import contextmanager
from contextvars import ContextVar
from typing import Iterator, TextIO


class CapturedStream(io.TextIOBase):
    """Standard output or error that writes to the buffer of the command running in this context, and anywhere else where it wrote before; so commands on several threads print side by side, each into its own outcome."""

    def __init__(self, original: TextIO, target: ContextVar) -> None:
        self.original, self.target = original, target

    def write(self, text: str) -> int:
        return (self.target.get() or self.original).write(text)

    def flush(self) -> None:
        (self.target.get() or self.original).flush()

    def __getattr__(self, name: str) -> object:
        return getattr(self.original, name)

    @staticmethod
    @contextmanager
    def capture(output: io.StringIO, err: io.StringIO) -> Iterator[None]:
        if not isinstance(sys.stdout, CapturedStream):
            sys.stdout = CapturedStream(sys.stdout, CAPTURED_OUTPUT)
        if not isinstance(sys.stderr, CapturedStream):
            sys.stderr = CapturedStream(sys.stderr, ERR)
        tokens = CAPTURED_OUTPUT.set(output), ERR.set(err)
        try:
            yield
        finally:
            CAPTURED_OUTPUT.reset(tokens[0])
            ERR.reset(tokens[1])


CAPTURED_OUTPUT: ContextVar[io.StringIO | None] = ContextVar("command_out", default=None)
ERR: ContextVar[io.StringIO | None] = ContextVar("command_err", default=None)
