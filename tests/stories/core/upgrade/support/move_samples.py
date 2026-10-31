import sqlite3
from dataclasses import dataclass
from pathlib import Path

from core.base.database.migration import Migration
from core.base.model.model import Model
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.upgrade.move_declaration import MoveDeclaration
from core.base.upgrade.move_writer import MoveWriter
from core.base.upgrade.source_rows import SourceRows
from core.base.upgrade.upgrade_move import UpgradeMove

PATH = "tests.stories.core.upgrade.support.move_samples"
STANDARD = " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"
ORDER: list[str] = []


@dataclass(frozen=True, kw_only=True)
class Note(Model):
    model_name = "note"
    cli_name = "note"

    creator_id: int
    text: str


@dataclass(frozen=True, kw_only=True)
class Tag(Model):
    model_name = "tag"
    cli_name = "tag"

    creator_id: int
    note_id: int
    label: str


class NotesMigration(Migration):
    number = 1
    statements = ("CREATE TABLE notes (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id), text TEXT NOT NULL," + STANDARD,)


class TagsMigration(Migration):
    number = 1
    statements = ("CREATE TABLE tags (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id), note_id INTEGER NOT NULL REFERENCES notes(id),"
                  " label TEXT NOT NULL," + STANDARD,)


class NotesMove(UpgradeMove):
    def carry(self, source: SourceRows, writer: MoveWriter) -> None:
        ORDER.append("notes")
        for row in source.rows("notes"):
            writer.insert("notes", {"creator_id": writer.core_actor_id, "text": row["text"]}, "notes", row["id"])


class TagsMove(UpgradeMove):
    def carry(self, source: SourceRows, writer: MoveWriter) -> None:
        ORDER.append("tags")
        for row in source.rows("tags"):
            writer.insert("tags", {"creator_id": writer.core_actor_id, "note_id": writer.mapped("notes", row["note_id"]), "label": row["label"]}, "tags", row["id"])


class BrokenTagsMove(UpgradeMove):
    def carry(self, source: SourceRows, writer: MoveWriter) -> None:
        first = source.rows("tags")[0]
        writer.insert("tags", {"creator_id": writer.core_actor_id, "note_id": writer.mapped("notes", first["note_id"]), "label": first["label"]}, "tags", first["id"])
        raise RuntimeError("the second tag could not be read")


class NotesModule(Module):
    name = "movenotes"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    models = [ModelDeclaration(Note)]
    migrations = [NotesMigration]
    moves = [MoveDeclaration(NotesMove, tables=["notes"], drops=["note_drafts"])]


class TagsModule(Module):
    name = "movetags"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "movenotes"]
    models = [ModelDeclaration(Tag)]
    migrations = [TagsMigration]
    moves = [MoveDeclaration(TagsMove, tables=["tags"], reads_ids_of=["movenotes"])]


class BrokenTagsModule(Module):
    name = "movetags"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "movenotes"]
    models = [ModelDeclaration(Tag)]
    migrations = [TagsMigration]
    moves = [MoveDeclaration(BrokenTagsMove, tables=["tags"], reads_ids_of=["movenotes"])]


class GhostReaderModule(Module):
    name = "moveghost"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    moves = [MoveDeclaration(NotesMove, tables=["ghost_notes"], reads_ids_of=["nothing-installed"])]


class StrangerReaderModule(Module):
    name = "movestranger"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    moves = [MoveDeclaration(NotesMove, tables=["stranger_notes"], reads_ids_of=["journal.core.environments"])]


def version_four_database(folder: Path) -> Path:
    path = folder / "version-4.db"
    connection = sqlite3.connect(path)
    connection.executescript("""
        CREATE TABLE notes (id INTEGER PRIMARY KEY, text TEXT);
        CREATE TABLE tags (id INTEGER PRIMARY KEY, note_id INTEGER, label TEXT);
        CREATE TABLE note_drafts (id INTEGER PRIMARY KEY, text TEXT);
        CREATE TABLE old_reports (id INTEGER PRIMARY KEY, body TEXT);
        INSERT INTO notes VALUES (7, 'First'), (9, 'Second');
        INSERT INTO tags VALUES (1, 7, 'red'), (2, 9, 'blue');
        INSERT INTO note_drafts VALUES (1, 'unfinished');
        INSERT INTO old_reports VALUES (1, 'a report');
    """)
    connection.commit()
    connection.close()
    return path
