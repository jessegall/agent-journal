from dataclasses import dataclass
from enum import StrEnum

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


class ParcelStage(StrEnum):
    """Where a parcel is: stored in its bay, or shipped."""

    STORED = "stored"
    SHIPPED = "shipped"


@dataclass(frozen=True, kw_only=True)
class Parcel(Model, Assignable):
    """A sample row at the end of the chain, as a task is: once shipped, the assignment of a parent passes it."""

    model_name = "parcel"
    cli_name = "parcel"
    takes_actors = ActorCount.SINGLE

    title: str
    stage: ParcelStage = ParcelStage.STORED

    def cascade_skips(self, actor_id: int) -> bool:
        return self.stage is ParcelStage.SHIPPED


@dataclass(frozen=True, kw_only=True)
class BayParcel(Model, AssignmentLink):
    """The link that puts one parcel in one bay, as a phase holds a task."""

    model_name = "bay_parcel"
    cli_name = "bay-parcel"

    bay_id: int
    parcel_id: int


@dataclass(frozen=True, kw_only=True)
class Bay(Model, Assignable):
    """A sample row in the middle of the chain, as a phase is: it belongs to a yard and holds parcels by a link."""

    model_name = "bay"
    cli_name = "bay"
    takes_actors = ActorCount.SINGLE
    assigns = tuple([Children(Parcel, "bay_id", link_model=BayParcel, link_column="parcel_id")])

    yard_id: int
    title: str


@dataclass(frozen=True, kw_only=True)
class Yard(Model, Assignable):
    """A sample row at the top of the chain, as a plan is: it holds bays."""

    model_name = "yard"
    cli_name = "yard"
    takes_actors = ActorCount.SINGLE
    assigns = tuple([Children(Bay, "yard_id")])

    title: str


class ChainTables(Migration):
    number = 1
    statements = (
        f"CREATE TABLE yards (id INTEGER PRIMARY KEY, title TEXT NOT NULL, {BOOKKEEPING}) STRICT",
        f"CREATE TABLE bays (id INTEGER PRIMARY KEY, yard_id INTEGER NOT NULL REFERENCES yards(id) ON DELETE CASCADE, title TEXT NOT NULL, {BOOKKEEPING}) STRICT",
        f"CREATE TABLE parcels (id INTEGER PRIMARY KEY, title TEXT NOT NULL, stage TEXT NOT NULL DEFAULT 'stored', {BOOKKEEPING}) STRICT",
        f"CREATE TABLE bay_parcels (id INTEGER PRIMARY KEY, bay_id INTEGER NOT NULL REFERENCES bays(id) ON DELETE CASCADE,"
        f" parcel_id INTEGER NOT NULL UNIQUE REFERENCES parcels(id) ON DELETE CASCADE, {BOOKKEEPING}) STRICT",
        "CREATE INDEX bays_yard ON bays (yard_id)",
        "CREATE INDEX bay_parcels_bay ON bay_parcels (bay_id)",
    )


class ChainModule(Module):
    """A sample module with a chain of three assignable models joined as a plan, its phases and their tasks are."""

    name = "acme.chain"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.assignments"]
    models = [ModelDeclaration(Yard), ModelDeclaration(Bay), ModelDeclaration(Parcel), ModelDeclaration(BayParcel)]
    migrations = [ChainTables]
