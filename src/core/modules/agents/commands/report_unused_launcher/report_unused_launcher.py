from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ReportUnusedLauncher(Command[bool]):
    """Tells the person in the chat, once for a pair of processes, that two launchers ran at once and which
    of them is stopped. It answers whether this was the first time."""

    serving_pid: int
    unused_pid: int
