from dataclasses import dataclass


@dataclass(frozen=True)
class SuiteDescription:
    """A suite as journal suite show prints it, one field to a line."""

    suite: str
    module: str
    requires: str
    complete_control: bool
    includes: str
    missing: str
    drivers: str
