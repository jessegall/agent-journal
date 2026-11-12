import re
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.errors.metadata_key_error import MetadataKeyError

PLAIN_NAME = re.compile(r"^[a-z_][a-z0-9_]*$")


@dataclass(frozen=True)
class JsonListEmpty:
    """Matches rows whose column holds an empty JSON list."""

    column: str

    def statement(self) -> Statement:
        if not PLAIN_NAME.match(self.column):
            raise MetadataKeyError(f"a JSON list is read from a plain column, not {self.column}")
        return Statement(f"json_array_length({self.column}) = 0")
