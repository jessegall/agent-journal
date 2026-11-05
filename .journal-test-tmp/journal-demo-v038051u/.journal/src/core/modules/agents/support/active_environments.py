from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class ActiveEnvironments:
    """The environments a main agent is running in, by number."""

    environment_ids: Sequence[int]

    def line(self) -> str:
        return ", ".join(str(number) for number in self.environment_ids) or "no environment has an agent"

    def json(self) -> Mapping[str, object]:
        return {"environment_ids": list(self.environment_ids)}
