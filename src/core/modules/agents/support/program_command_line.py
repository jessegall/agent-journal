import json
from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class ProgramCommandLine:
    """The arguments that start an agent program and the variables its launch must carry."""

    arguments: tuple[str, ...]
    variables: Mapping[str, str]

    def json(self) -> str:
        return json.dumps({"arguments": list(self.arguments), "variables": dict(self.variables)})
