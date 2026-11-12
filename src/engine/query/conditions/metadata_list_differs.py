import re
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.errors.metadata_key_error import MetadataKeyError

MODULE_NAME = re.compile(r"^[a-z_][a-z0-9_.]*$")
PLAIN_KEY = re.compile(r"^[a-z_][a-z0-9_]*$")


@dataclass(frozen=True)
class MetadataListDiffers:
    """Matches rows whose metadata list under a module's key has an element of the given kind whose field holds a
    value other than the one given, or has no element of that kind; a missing field counts as empty text."""

    module: str
    key: str
    kind_field: str
    kind: object
    field: str
    value: object

    def statement(self) -> Statement:
        if not MODULE_NAME.match(self.module) or not all(PLAIN_KEY.match(key) for key in (self.key, self.kind_field, self.field)):
            raise MetadataKeyError(f"metadata is read by plain names, not {self.module}.{self.key}")
        elements = f"json_each(metadata, '$.\"{self.module}\".{self.key}')"
        of_kind = f"json_extract(value, '$.{self.kind_field}') = ?"
        return Statement(f"(NOT EXISTS (SELECT 1 FROM {elements} WHERE {of_kind}) OR EXISTS (SELECT 1 FROM {elements} WHERE {of_kind} "
                         f"AND coalesce(json_extract(value, '$.{self.field}'), '') != ?))", [self.kind, self.kind, self.value])
