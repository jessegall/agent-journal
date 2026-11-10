from collections.abc import Sequence
from dataclasses import dataclass, field, replace
from typing import ClassVar, Self
from engine.model.event_form import EventForm
from engine.row.metadata import Metadata
from engine.model.added_state import StateValue
from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from engine.time.timestamp import Timestamp
from engine.model.errors.model_error import ModelError
from engine.text.search_term import SearchTerm


STATE = "state"
END_CHANGE = "end"
@dataclass(frozen=True, kw_only=True)
class Model:
    """A row of the database as an object that cannot be changed in place; every change makes a copy."""

    model_name: ClassVar[str]
    cli_name: ClassVar[str]
    lifecycle: ClassVar[type[Lifecycle] | None] = None
    hidden_fields: ClassVar[frozenset[str]] = frozenset()
    filter_fields: ClassVar[Sequence[str]] = ()
    search_fields: ClassVar[Sequence[str]] = ()
    search_rank: ClassVar[int] = 0
    search_ignored_start: ClassVar[str] = ""
    shared_rows: ClassVar[bool] = False
    shown_properties: ClassVar[Sequence[str]] = ()
    change_names: ClassVar[Sequence[str]] = ()
    event_forms: ClassVar[tuple[EventForm, ...]] = tuple(EventForm)
    events_expire: ClassVar[bool] = False

    id: int = 0
    version: int = 0
    metadata: Metadata = field(default_factory=Metadata)
    created_at: Timestamp | None = None
    updated_at: Timestamp | None = None
    move: Move | None = field(default=None, compare=False)

    def change_name(self, old_row: "Model | None") -> str | None:
        return None

    def creation_timestamp(self) -> Timestamp:
        if self.created_at is None:
            raise ModelError(f"{type(self).__name__} {self.id} was never saved")
        return self.created_at

    def update_timestamp(self) -> Timestamp:
        return self.updated_at if self.updated_at is not None else self.creation_timestamp()

    def search_text(self) -> str:
        return " ".join(str(getattr(self, name)) for name in self.search_fields)

    def count_matching_terms(self, terms: Sequence[str]) -> int:
        text = self.search_text().lower()
        return sum(SearchTerm.stem(term) in text for term in terms)

    @property
    def is_saved(self) -> bool:
        return self.version > 0

    def changed(self, **values: object) -> Self:
        if self.lifecycle is not None and STATE in values:
            raise ModelError(f"{type(self).__name__}.changed cannot set the state: ask for a move")
        return replace(self, **values)

    def moved(self, move: Move, **values: object) -> Self:
        if self.lifecycle is None:
            raise ModelError(f"{move.name} is no move of {type(self).__name__}")
        return replace(self, **{STATE: move.target, "move": move, **values})

    def saved(self, id: int, version: int, timestamp: Timestamp) -> Self:
        return replace(self, id=id, version=version, created_at=self.created_at or timestamp, updated_at=timestamp, move=None)

    def current_state(self) -> StateValue:
        return getattr(self, STATE)
