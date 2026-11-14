from dataclasses import dataclass

from engine.command.context import Context
from engine.enums.actor_count import ActorCount
from engine.errors.refusal import Refusal
from engine.event.created import Created
from engine.guard.guard import Guard
from engine.model.assignable import Assignable
from engine.model.children import Children
from engine.model.model import Model
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.assignments.models.assignment import Assignment

PATH = "tests.stories.core.modules.assignments.support.unsound_chains"
SEVERAL_OVER_SINGLE = f"{PATH}:DockModule"
LOOPED = f"{PATH}:GearModule"
PARCEL_GUARD = f"{PATH}:ParcelGuardModule"
REFUSED_PARCEL = 5
GUARD_REFUSAL = "parcel 5 is sealed"


@dataclass(frozen=True, kw_only=True)
class Bolt(Model, Assignable):
    model_name = "bolt"
    cli_name = "bolt"
    takes_actors = ActorCount.SINGLE

    dock_id: int


@dataclass(frozen=True, kw_only=True)
class Dock(Model, Assignable):
    model_name = "dock"
    cli_name = "dock"
    takes_actors = ActorCount.SEVERAL
    assigns = tuple([Children(Bolt, "dock_id")])

    title: str


class DockModule(Module):
    """A sample module whose model several actors hold assigns a child that one actor holds."""

    name = "acme.dock"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.assignments"]
    models = [ModelDeclaration(Dock), ModelDeclaration(Bolt)]


@dataclass(frozen=True, kw_only=True)
class Cog(Model, Assignable):
    model_name = "cog"
    cli_name = "cog"
    takes_actors = ActorCount.SINGLE

    gear_id: int


@dataclass(frozen=True, kw_only=True)
class Gear(Model, Assignable):
    model_name = "gear"
    cli_name = "gear"
    takes_actors = ActorCount.SINGLE
    assigns = tuple([Children(Cog, "gear_id")])

    cog_id: int


Cog.assigns = tuple([Children(Gear, "cog_id")])


class GearModule(Module):
    """A sample module whose two models assign each other."""

    name = "acme.gear"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.assignments"]
    models = [ModelDeclaration(Gear), ModelDeclaration(Cog)]


class SealedParcelGuard(Guard[Created[Assignment]]):
    """Refuses the assignment of one parcel of the sample chain, so a story sees a cascade fail in its middle."""

    name = "acme.sealed-parcel"

    def check(self, event: Created[Assignment], context: Context) -> None:
        if event.row.subject_model == "parcel" and event.row.subject_id == REFUSED_PARCEL:
            raise Refusal(GUARD_REFUSAL)


class ParcelGuardModule(Module):
    """A sample module that guards the assignment of one parcel."""

    name = "acme.parcel-guard"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.assignments", "acme.chain"]
    guards = [SealedParcelGuard]
