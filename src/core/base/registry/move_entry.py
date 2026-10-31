from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any

from core.base.registry.dotted_path import DottedPath


@dataclass(frozen=True)
class MoveEntry:
    """A registered move from version 4: the module that declares it, its class, the version 4 tables it reads and
    drops, and the modules whose new ids it looks up; entries stand in module order."""

    module: str
    path: DottedPath
    reads: Sequence[str]
    drops: Sequence[str]
    id_modules: Sequence[str]

    def stored(self) -> Mapping[str, Any]:
        return {"module": self.module, "path": self.path.text, "reads": list(self.reads), "drops": list(self.drops), "id_modules": list(self.id_modules)}

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "MoveEntry":
        return cls(stored["module"], DottedPath(stored["path"]), tuple(stored["reads"]), tuple(stored["drops"]), tuple(stored["id_modules"]))
