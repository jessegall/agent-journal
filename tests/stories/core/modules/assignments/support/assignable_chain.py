from dataclasses import dataclass

from engine.database.migration import Migration
from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from engine.model.assignment_link import AssignmentLink
from engine.model.children import Children
from engine.model.model import Model
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module

CHAIN = "tests.stories.core.modules.assignments.support.assignable_chain:ChainModule"
BOOKKEEPING = ("version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
               " created_at TEXT NOT NULL, updated_at TEXT NOT NULL")


@dataclass(frozen=True, kw_only=True)
class Piece(Model, Assignable):
    """A sample row at the end of the chain, as a task is: once done, the assignment of a parent passes it."""

    model_name = "piece"
    cli_name = "piece"
    takes_actors = ActorCount.SINGLE

    title: str
    is_done: bool = False

    def cascade_skips(self, actor_id: int) -> bool:
        return self.is_done


@dataclass(frozen=True, kw_only=True)
class SectionPiece(Model, AssignmentLink):
    """The link that puts one piece in one section, as a phase holds a task."""

    model_name = "section_piece"
    cli_name = "section-piece"

    section_id: int
    piece_id: int


@dataclass(frozen=True, kw_only=True)
class Section(Model, Assignable):
    """A sample row in the middle of the chain, as a phase is: it belongs to a lot and holds pieces by a link."""

    model_name = "section"
    cli_name = "section"
    takes_actors = ActorCount.SINGLE
    assigns = tuple([Children(Piece, "section_id", link_model=SectionPiece, link_column="piece_id")])

    lot_id: int
    title: str


@dataclass(frozen=True, kw_only=True)
class Lot(Model, Assignable):
    """A sample row at the top of the chain, as a plan is: it holds sections."""

    model_name = "lot"
    cli_name = "lot"
    takes_actors = ActorCount.SINGLE
    assigns = tuple([Children(Section, "lot_id")])

    title: str


class ChainTables(Migration):
    number = 1
    statements = (
        f"CREATE TABLE lots (id INTEGER PRIMARY KEY, title TEXT NOT NULL, {BOOKKEEPING}) STRICT",
        f"CREATE TABLE sections (id INTEGER PRIMARY KEY, lot_id INTEGER NOT NULL REFERENCES lots(id) ON DELETE CASCADE, title TEXT NOT NULL, {BOOKKEEPING}) STRICT",
        f"CREATE TABLE pieces (id INTEGER PRIMARY KEY, title TEXT NOT NULL, is_done INTEGER NOT NULL DEFAULT 0, {BOOKKEEPING}) STRICT",
        f"CREATE TABLE section_pieces (id INTEGER PRIMARY KEY, section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,"
        f" piece_id INTEGER NOT NULL UNIQUE REFERENCES pieces(id) ON DELETE CASCADE, {BOOKKEEPING}) STRICT",
    )


class ChainModule(Module):
    """A sample module with a chain of three assignable models joined as a plan, its phases and their tasks are."""

    name = "acme.chain"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.assignments"]
    models = [ModelDeclaration(Lot), ModelDeclaration(Section), ModelDeclaration(Piece), ModelDeclaration(SectionPiece)]
    migrations = [ChainTables]
