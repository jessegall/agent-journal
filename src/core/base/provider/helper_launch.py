from dataclasses import dataclass

from core.base.provider.launch import Launch


@dataclass(frozen=True)
class HelperLaunch(Launch):
    """A launch of a worker, reviewer or verifier: the program runs its brief without a terminal and prints its
    report."""

    brief: str
