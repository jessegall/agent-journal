from dataclasses import dataclass
from typing import Callable


@dataclass(frozen=True)
class CommandLine:
    run: Callable
    parser: Callable
    words: Callable
    queries: set


WIRED: list = []


class NotWired(RuntimeError):
    def __init__(self) -> None:
        super().__init__("no command line is wired into this process: import commands.cli at its entry")


def wire(line: CommandLine) -> None:
    WIRED[:] = [line]


def command_line() -> CommandLine:
    if not WIRED:
        raise NotWired()
    return WIRED[0]
