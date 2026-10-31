from dataclasses import dataclass


@dataclass(frozen=True)
class SuiteRun:
    """The suite an environment runs and the driver of each role, as journal suite current prints them."""

    suite: str
    drivers: str
