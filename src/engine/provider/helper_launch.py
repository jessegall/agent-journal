from dataclasses import dataclass

from engine.provider.launch import Launch


@dataclass(frozen=True)
class HelperLaunch(Launch):
    """A helper program launched without a terminal to run its brief and return a report."""

    brief: str
