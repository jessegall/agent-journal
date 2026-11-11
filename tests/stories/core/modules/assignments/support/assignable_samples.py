from dataclasses import dataclass

from engine.database.migration import Migration
from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from engine.model.model import Model
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module

DEPOT = "tests.stories.core.modules.assignments.support.assignable_samples:DepotModule"
COLUMNS = ("id INTEGER PRIMARY KEY, title TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,"
           " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL")


@dataclass(frozen=True, kw_only=True)
class Crate(Model, Assignable):
    """A sample row that one actor holds at a time."""

    model_name = "crate"
    cli_name = "crate"
    takes_actors = ActorCount.SINGLE

    title: str


@dataclass(frozen=True, kw_only=True)
class Pallet(Model, Assignable):
    """A sample row that several actors can hold together."""

    model_name = "pallet"
    cli_name = "pallet"
    takes_actors = ActorCount.SEVERAL

    title: str


@dataclass(frozen=True, kw_only=True)
class Shelf(Model):
    """A sample row that cannot be assigned."""

    model_name = "shelf"
    cli_name = "shelf"

    title: str


class DepotTables(Migration):
    number = 1
    statements = tuple(f"CREATE TABLE {table} ({COLUMNS}) STRICT" for table in ("crates", "pallets", "shelfs"))


class DepotModule(Module):
    """A sample module with a model one actor holds, a model several hold and a model nobody can be given."""

    name = "acme.depot"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.assignments"]
    models = [ModelDeclaration(Crate), ModelDeclaration(Pallet), ModelDeclaration(Shelf)]
    migrations = [DepotTables]
