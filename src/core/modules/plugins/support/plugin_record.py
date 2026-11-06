from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class PluginRecord:
    """What a plugin did: its newest outputs, its fault count and its last fault, and the services it keeps
    running."""

    name: str
    outputs: Sequence[Mapping[str, object]]
    fault_count: int
    last_fault: str
    services: Sequence[Mapping[str, object]] = ()
    inputs: Sequence[str] | None = None

    def json(self) -> Mapping[str, object]:
        return {"name": self.name, "outputs": list(self.outputs), "fault_count": self.fault_count, "inputs": list(self.inputs or ()), "last_fault": self.last_fault, "services": list(self.services)}
