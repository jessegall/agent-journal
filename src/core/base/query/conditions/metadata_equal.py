import re
from dataclasses import dataclass

from core.base.database.statement import Statement

PLAIN_KEY = re.compile(r"^[a-z_][a-z0-9_]*$")


class MetadataKeyError(Exception):
    """Raised when a metadata module or key name contains characters it may not."""


@dataclass(frozen=True)
class MetadataEqual:
    """Matches rows whose metadata holds a given value under a module's key."""

    module: str
    key: str
    value: object

    def statement(self) -> Statement:
        if not (PLAIN_KEY.match(self.module) and PLAIN_KEY.match(self.key)):
            raise MetadataKeyError(f"metadata is read by plain names, not {self.module}.{self.key}")
        return Statement(f"json_extract(metadata, '$.{self.module}.{self.key}') = ?", [self.value])
