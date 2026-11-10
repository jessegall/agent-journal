import json
from collections.abc import Mapping
from typing import ClassVar, Generic, TypeVar

from engine.command.context import Context
from engine.model.model import Model
from engine.text.text_digest import TextDigest

Fields = Mapping[str, object]

M = TypeVar("M", bound=Model)


class LibraryShare(Generic[M]):
    """How the rows of one model are shared with a team: their name on the server, the model they are kept as here,
    the fields that travel, and how a row is made or changed from what the server sends. A module declares its
    own, so the library module knows no model by name."""

    name: ClassVar[str]
    model: ClassVar[type[Model]]

    def fields(self, row: M) -> Fields:
        raise NotImplementedError

    def digest(self, row: M) -> str:
        return self.fields_digest(self.fields(row))

    def fields_digest(self, fields: Fields) -> str:
        return TextDigest().hex_digest(json.dumps(fields, sort_keys=True))

    # Makes the local row for an item that was just fetched.
    def arrive(self, fields: Fields, context: Context) -> M:
        raise NotImplementedError

    # Brings a local row to a newer version from the server.
    def follow(self, row: M, fields: Fields, context: Context) -> M:
        raise NotImplementedError

    # Whether the row was removed from this journal, so its copy goes too.
    def is_removed(self, row: M) -> bool:
        return False

    # Whether a newer version is paused for now, such as while a sequence runs.
    def is_paused(self, row: M) -> bool:
        return False

    # Whether a newer version would run here with nobody looking, so a person reads it first.
    def needs_reading(self, row: M, fields: Fields) -> str:
        return ""

    # What a person must read before getting it, such as the command of a check.
    def warning(self, fields: Fields) -> str:
        return ""

    # Why this row cannot be shared, such as one the journal made for itself.
    def share_refusal(self, row: M) -> str:
        return ""
