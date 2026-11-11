from dataclasses import dataclass

from engine.database.migration import Migration
from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from engine.model.model import Model
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module

PATH = "tests.stories.core.modules.assignments.support.assignable_samples"
DEPOT = f"{PATH}:DepotModule"
UNCOUNTED = f"{PATH}:UncountedModule"
UNBOUND = f"{PATH}:UnboundModule"
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


@dataclass(frozen=True, kw_only=True)
class Barrel(Model, Assignable):
    """A sample row that is assignable and does not say how many actors hold it."""

    model_name = "barrel"
    cli_name = "barrel"

    title: str


class BarrelsTable(Migration):
    number = 1
    statements = (f"CREATE TABLE barrels ({COLUMNS}) STRICT",)


class UncountedModule(Module):
    """A sample module whose assignable model does not say how many actors hold a row."""

    name = "acme.uncounted"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.assignments"]
    models = [ModelDeclaration(Barrel)]
    migrations = [BarrelsTable]


@dataclass(frozen=True, kw_only=True)
class Sack(Model, Assignable):
    """A sample row of a module that does not depend on the assignments module."""

    model_name = "sack"
    cli_name = "sack"
    takes_actors = ActorCount.SINGLE

    title: str


class SacksTable(Migration):
    number = 1
    statements = (f"CREATE TABLE sacks ({COLUMNS}) STRICT",)


class UnboundModule(Module):
    """A sample module that owns an assignable model and does not depend on the assignments module."""

    name = "acme.unbound"
    requires_core = ">=5,<6"
    models = [ModelDeclaration(Sack)]
    migrations = [SacksTable]
