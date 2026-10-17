from dataclasses import dataclass


@dataclass(frozen=True)
class Service:
    """A process a feature needs beside the agent: a module of the package, run with the package's own Python and kept running by the supervisor that hosts the journal."""

    name: str
    module: str
