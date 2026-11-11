from engine.event.created import Created
from engine.event.deleted import Deleted
from engine.event.event_type import EventType
from engine.listener.save_listener import SaveListener
from engine.model.model import Model


class Stackable:
    """A sample trait that models take on."""


class Box(Model, Stackable):
    model_name = "box"
    cli_name = "box"


class Lid(Model):
    model_name = "lid"
    cli_name = "lid"


class StackableDeletedListener(SaveListener[Deleted[Stackable]]):
    name = "sample.stackable-deleted"


class BoxCreatedListener(SaveListener[Created[Box]]):
    name = "sample.box-created"


def trait_form() -> EventType:
    return StackableDeletedListener.event_types[0]


def test_pattern_of_deleted_assignable_is_star_delete():
    assert StackableDeletedListener.event == "*.delete" and EventType(Created, Stackable).pattern(()) == "*.create"


def test_a_listener_of_the_trait_form_hears_a_row_of_a_subclass():
    assert trait_form().is_applicable(Box())


def test_a_listener_of_the_trait_form_skips_a_row_of_a_class_that_is_not_a_subclass():
    assert not trait_form().is_applicable(Lid())


def test_an_ordinary_model_listener_is_unchanged():
    assert BoxCreatedListener.event == "box.create" and BoxCreatedListener.event_types[0].is_applicable(Lid())
