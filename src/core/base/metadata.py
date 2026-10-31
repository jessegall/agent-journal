import json
from collections.abc import Mapping
from dataclasses import dataclass, field
from types import MappingProxyType

EMPTY: Mapping[str, object] = MappingProxyType({})


@dataclass(frozen=True)
class Metadata:
    """Extra data modules attach to a row, each module under its own key."""

    values: Mapping[str, Mapping[str, object]] = field(default_factory=lambda: MappingProxyType({}))

    @classmethod
    def parsed(cls, text: str) -> "Metadata":
        return cls(MappingProxyType({module: MappingProxyType(dict(part)) for module, part in json.loads(text).items()}))

    @property
    def text(self) -> str:
        return json.dumps({module: dict(part) for module, part in self.values.items()}, sort_keys=True)

    def module_part(self, module: str) -> Mapping[str, object]:
        return self.values.get(module, EMPTY)
