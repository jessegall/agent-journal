import re
from dataclasses import dataclass
from engine.database.statement import Statement
from engine.query.errors.metadata_key_error import MetadataKeyError


PLAIN_KEY = re.compile(r"^[a-z_][a-z0-9_]*$")
MODULE_NAME = re.compile(r"^[a-z_][a-z0-9_]*(\.[a-z_][a-z0-9_]*)*$")


@dataclass(frozen=True)
class MetadataEqual:
    """Matches rows whose metadata holds a given value under a module's key; a module is named by its dotted name."""

    module: str
    key: str
    value: object

    def statement(self) -> Statement:
        if not (MODULE_NAME.match(self.module) and PLAIN_KEY.match(self.key)):
            raise MetadataKeyError(f"metadata is read by plain names, not {self.module}.{self.key}")
        return Statement(f"json_extract(metadata, '$.\"{self.module}\".{self.key}') = ?", [self.value])
