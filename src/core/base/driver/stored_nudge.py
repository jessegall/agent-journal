import json
from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class StoredNudge:
    key: str
    type: str
    text: str
    plural_text: str
    id_field: str | None
    required_command: str | None
    path_fields: Sequence[str]
    fields: Mapping[str, str]

    @classmethod
    def read(cls, text: str) -> "StoredNudge":
        return cls(**json.loads(text))

    @property
    def json(self) -> str:
        return json.dumps(asdict(self))

