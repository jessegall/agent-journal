from dataclasses import dataclass
from typing import Callable


@dataclass(frozen=True)
class CommandLine:
    run: Callable
    parser: Callable
    words: Callable
    queries: set


WIRED: list = []


def wire(line: CommandLine) -> None:
    WIRED[:] = [line]


def command_line() -> CommandLine:
    if not WIRED:
        raise RuntimeError("no command line is wired into this process: import commands.cli at its entry")
    return WIRED[0]
