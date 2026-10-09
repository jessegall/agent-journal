from dataclasses import asdict, dataclass
from enum import StrEnum

from engine.events.engine import FileEdited
from engine.files import KIND, blob_bytes, blob_texts, is_image
from features.file_feed.diff import DIFFS, DiffRow, diffed

KEPT = 500
PAGE = 25
NOTES = "file_feed"


class EditKind(StrEnum):
    EDIT = "edit"
    NEW = "new"
    DELETED = "deleted"


KINDS = {KIND.created: EditKind.NEW, KIND.edited: EditKind.EDIT, KIND.deleted: EditKind.DELETED}


@dataclass(frozen=True)
class Card:
    id: str
    path: str
    kind: EditKind
    at: float
    added: int
    removed: int
    first_line: int
    last_line: int
    rows: tuple[DiffRow, ...]
    image: bool = False


@dataclass(frozen=True)
class Feed:
    cursor: float
    edits: tuple[Card, ...]
    older: bool


@dataclass(frozen=True)
class Page:
    edits: tuple[Card, ...]
    older: bool


@dataclass(frozen=True)
class FileText:
    path: str
    text: str


@dataclass(frozen=True)
class FileImage:
    path: str
    data: bytes


class Side(StrEnum):
    BEFORE = "before"
    AFTER = "after"


class NoSuchEdit(LookupError):
    pass


def noted(record, edit: FileEdited) -> None:
    with record.state(NOTES).changing() as held:
        held["notes"] = [*held.get("notes", []), asdict(edit)][-KEPT:]
    if not is_image(edit.path):
        diffed(record.root.parent, [(edit.before, edit.after)])


def notes(record) -> list[FileEdited]:
    return [FileEdited.from_json(raw) for raw in record.state(NOTES).get("notes", [])]


def agent_notes(record, agent: int) -> list[FileEdited]:
    return [note for note in notes(record) if note.agent == agent]


def more_before(kept: list[FileEdited], shown: list[FileEdited]) -> bool:
    return bool(shown) and kept[0].at < shown[0].at


def edits_since(record, agent: int, since: float, last: int) -> Feed:
    kept = agent_notes(record, agent)
    shown = [note for note in kept if note.at > since][-last:]
    return Feed(shown[-1].at if shown else since, cards(record, shown), more_before(kept, shown))


def edits_before(record, agent: int, before: float, last: int) -> Page:
    kept = agent_notes(record, agent)
    shown = [note for note in kept if note.at < before][-last:]
    return Page(cards(record, shown), more_before(kept, shown))


def edited_file(record, agent: int, card: str, side: Side) -> FileText:
    note = next((note for note in agent_notes(record, agent) if card_id(note) == card), None)
    if note is None:
        raise NoSuchEdit(f"no edit {card}")
    sha = note.after if side == Side.AFTER else note.before
    texts = blob_texts(record.root.parent, [sha])
    if sha not in texts:
        raise NoSuchEdit(f"the {side} of {card} is no longer kept")
    return FileText(note.path, texts[sha])


def edited_image(record, agent: int, card: str) -> FileImage:
    note = next((note for note in agent_notes(record, agent) if card_id(note) == card and is_image(note.path)), None)
    if note is None:
        raise NoSuchEdit(f"no picture {card}")
    data = blob_bytes(record.root.parent, note.after)
    if data is None:
        raise NoSuchEdit(f"the picture of {card} is no longer kept")
    return FileImage(note.path, data)


def cards(record, shown: list[FileEdited]) -> tuple[Card, ...]:
    diffed(record.root.parent, [(note.before, note.after) for note in shown if not is_image(note.path)])
    return tuple(_card(note) for note in shown if is_image(note.path) or (note.before, note.after) in DIFFS)


def card_id(note: FileEdited) -> str:
    return f"{note.path}@{note.at}"


def _card(note: FileEdited) -> Card:
    if is_image(note.path):
        return Card(card_id(note), note.path, KINDS[note.kind], note.at, 0, 0, 0, 0, (), image=True)
    diff, kind = DIFFS[(note.before, note.after)], KINDS[note.kind]
    rows = () if kind == EditKind.DELETED else diff.rows
    return Card(card_id(note), note.path, kind, note.at, diff.added, diff.removed, diff.first_line, diff.last_line, rows)
