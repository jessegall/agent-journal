from dataclasses import asdict, dataclass, fields
from typing import ClassVar


@dataclass(frozen=True)
class Operation:
    """What a tool call does, as its provider decoded it from the program's own tool and input: the journal reads the operation, never the tool's name."""

    kind: ClassVar[str]

    def line(self) -> str:
        return ""

    def writes(self) -> bool:
        return False

    def target_paths(self) -> tuple[str, ...]:
        return ()

    def read_paths(self) -> tuple[str, ...]:
        return ()

    def file_lines(self) -> int:
        return 0

    def loaded_skill(self) -> str:
        return ""

    def as_data(self) -> dict:
        return {"kind": self.kind, **asdict(self)}

    @classmethod
    def parsed(cls, data: dict) -> "Operation":
        return cls(**{field.name: tuple(data[field.name]) if isinstance(data.get(field.name), list) else data.get(field.name) for field in fields(cls)})
