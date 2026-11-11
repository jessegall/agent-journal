from dataclasses import dataclass

from engine.command.command import Command

SOURCE_KEY_PREFIX = "stopped-run:"


@dataclass(frozen=True)
class ReportStoppedWorkerRuns(Command[None]):
    """Reports each worker that stopped with tasks left while a command it started still runs."""
