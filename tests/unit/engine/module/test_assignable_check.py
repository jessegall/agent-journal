from collections.abc import Sequence

from engine.enums.actor_count import ActorCount
from engine.enums.actor_type import ActorType
from engine.model.assignable import Assignable
from engine.model.model import Model
from engine.module.assignable_check import ASSIGNMENTS_MODULE, AssignableCheck
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module


class Parcel(Model, Assignable):
    model_name = "parcel"
    cli_name = "parcel"
    takes_actors = ActorCount.ONE


class Crate(Model, Assignable):
    model_name = "crate"
    cli_name = "crate"


class Label(Model):
    model_name = "label"
    cli_name = "label"


def owner(*models: type[Model], dependencies: Sequence[str] = tuple([ASSIGNMENTS_MODULE])) -> type[Module]:
    return type("Depot", tuple([Module]), {"name": "depot", "dependencies": list(dependencies), "models": [ModelDeclaration(model) for model in models]})


def problems(module: type[Module]) -> str:
    return "; ".join(AssignableCheck().problems([module]))


def test_an_assignable_model_that_says_its_actor_count_in_a_module_that_depends_on_assignments_passes():
    assert problems(owner(Parcel, Label)) == ""


def test_an_assignable_model_with_no_actor_count_is_named():
    assert "Crate is assignable and does not say how many actors a row takes" in problems(owner(Crate))


def test_a_module_that_owns_an_assignable_model_and_does_not_depend_on_assignments_is_named():
    assert f"depot owns the assignable Parcel and does not depend on {ASSIGNMENTS_MODULE}" in problems(owner(Parcel, dependencies=()))


def test_a_module_with_no_assignable_model_needs_no_dependency():
    assert problems(owner(Label, dependencies=())) == ""


def test_a_person_and_an_agent_take_work_and_a_module_and_the_core_do_not():
    assert [actor_type for actor_type in ActorType if actor_type.can_take_work] == [ActorType.USER, ActorType.AGENT]
