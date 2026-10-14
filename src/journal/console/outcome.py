from dataclasses import dataclass


@dataclass(frozen=True)
class Outcome:
    """What a command run produced: its text and its exit code, so the server can hand it to the shim and the shim can print it."""

    code: int
    out: str
    err: str = ""
