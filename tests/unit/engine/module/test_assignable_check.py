from collections.abc import Sequence

from engine.enums.actor_count import ActorCount
from engine.enums.actor_type import ActorType
from engine.model.assignable import Assignable
from engine.model.children import Children
from engine.model.model import Model
from engine.module.assignable_check import ASSIGNMENTS_MODULE, AssignableCheck
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module


class Parcel(Model, Assignable):
    model_name = "parcel"
    cli_name = "parcel"
    takes_actors = ActorCount.SINGLE


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
    assert [actor_type for actor_type in ActorType if actor_type.can_receive_work] == [ActorType.USER, ActorType.AGENT]


class Bin(Model, Assignable):
    model_name = "bin"
    cli_name = "bin"
    takes_actors = ActorCount.SINGLE


class Rack(Model, Assignable):
    model_name = "rack"
    cli_name = "rack"
    takes_actors = ActorCount.SINGLE
    assigns = tuple([Children(Bin, "rack_id")])


class Aisle(Model, Assignable):
    model_name = "aisle"
    cli_name = "aisle"
    takes_actors = ActorCount.SEVERAL
    assigns = tuple([Children(Bin, "aisle_id")])


class Tray(Model, Assignable):
    model_name = "tray"
    cli_name = "tray"
    takes_actors = ActorCount.SINGLE
    assigns = tuple([Children(Label, "tray_id")])


class Hook(Model, Assignable):
    model_name = "hook"
    cli_name = "hook"
    takes_actors = ActorCount.SINGLE


class Chain(Model, Assignable):
    model_name = "chain"
    cli_name = "chain"
    takes_actors = ActorCount.SINGLE
    assigns = tuple([Children(Hook, "chain_id")])


Hook.assigns = tuple([Children(Chain, "hook_id")])


def test_a_child_that_is_not_assignable_is_a_problem():
    assert "Tray assigns its Label rows, and Label is not assignable" in problems(owner(Tray, Label))


def test_a_many_actor_parent_with_a_one_actor_child_names_both():
    assert "Aisle takes several actors and its child Bin takes one" in problems(owner(Aisle, Bin))


def test_a_loop_of_children_names_the_models():
    problem_text = problems(owner(Rack, Bin, Chain, Hook))
    assert problem_text.count("these models assign each other in a loop: Chain, Hook") == 1


def test_a_valid_chain_has_no_problem():
    assert problems(owner(Rack, Bin)) == ""
