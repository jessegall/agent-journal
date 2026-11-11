from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class StartUnstartedJobs(Command[None]):
    """Starts, in one environment, each kept helper whose open job never started. It takes no write lock, since
    a launcher can take seconds to answer."""

    lock = False
