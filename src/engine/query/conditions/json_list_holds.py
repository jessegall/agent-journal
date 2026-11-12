import re
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.errors.metadata_key_error import MetadataKeyError

PLAIN_NAME = re.compile(r"^[a-z_][a-z0-9_]*$")


@dataclass(frozen=True)
class JsonListHolds:
    """Matches rows whose column holds a JSON list with the given value in it."""

    column: str
    value: object

    def statement(self) -> Statement:
        if not PLAIN_NAME.match(self.column):
            raise MetadataKeyError(f"a JSON list is read from a plain column, not {self.column}")
        return Statement(f"EXISTS (SELECT 1 FROM json_each({self.column}) WHERE value = ?)", [self.value])
