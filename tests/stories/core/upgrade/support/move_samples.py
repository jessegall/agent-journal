import sqlite3
from dataclasses import dataclass
from pathlib import Path

from core.base.database.migration import Migration
from core.base.model.model import Model
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

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


class NotesMove(VersionFourMove):
    name = "notes"
    reads = ["notes"]
    drops = ["note_drafts"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        ORDER.append("notes")
        report = MoveReport()
        for row in source.rows("notes"):
            report.count("notes", map.transfer("notes", row["id"], "notes", lambda: target.insert(Statement(
                "INSERT INTO notes (creator_id, text, created_at, updated_at) VALUES (?, ?, ?, ?)", (context.core_actor_id, row["text"], context.timestamp, context.timestamp)))))
        report.drop("note_drafts", len(source.rows("note_drafts")))
        return report


class TagsMove(VersionFourMove):
    name = "tags"
    reads = ["tags"]
    id_modules = ["movenotes"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        ORDER.append("tags")
        report = MoveReport()
        for row in source.rows("tags"):
            note_id = map.new_id("notes", row["note_id"])
            report.count("tags", map.transfer("tags", row["id"], "tags", lambda: target.insert(Statement(
                "INSERT INTO tags (creator_id, note_id, label, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                (context.core_actor_id, note_id, row["label"], context.timestamp, context.timestamp)))))
        return report


class BrokenTagsMove(TagsMove):
    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        first = source.rows("tags")[0]
        map.transfer("tags", first["id"], "tags", lambda: target.insert(Statement(
            "INSERT INTO tags (creator_id, note_id, label, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            (context.core_actor_id, map.new_id("notes", first["note_id"]), first["label"], context.timestamp, context.timestamp))))
        raise RuntimeError("the second tag could not be read")


class NotesModule(Module):
    name = "movenotes"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    models = [ModelDeclaration(Note)]
    migrations = [NotesMigration]
    moves = [NotesMove]


class TagsModule(Module):
    name = "movetags"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "movenotes"]
    models = [ModelDeclaration(Tag)]
    migrations = [TagsMigration]
    moves = [TagsMove]


class BrokenTagsModule(Module):
    name = "movetags"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "movenotes"]
    models = [ModelDeclaration(Tag)]
    migrations = [TagsMigration]
    moves = [BrokenTagsMove]


class GhostMove(NotesMove):
    reads = ["ghost_notes"]
    drops = []
    id_modules = ["nothing-installed"]


class StrangerMove(NotesMove):
    reads = ["stranger_notes"]
    drops = []
    id_modules = ["journal.core.environments"]


class GhostReaderModule(Module):
    name = "moveghost"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    moves = [GhostMove]


class StrangerReaderModule(Module):
    name = "movestranger"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    moves = [StrangerMove]


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
