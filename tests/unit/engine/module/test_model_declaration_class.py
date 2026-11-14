from core.modules.pins.models.pin import Pin
from core.modules.pins.queries.pin_query import PinQuery
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module


class PinsModelDeclaration(ModelDeclaration):
    model = Pin
    query = PinQuery
    excluded_subcommands = ["delete"]


class BoardModule(Module):
    name = "board"
    models = [PinsModelDeclaration, ModelDeclaration(Pin)]


def test_a_model_declaration_class_gives_the_declaration_the_keyword_call_gave():
    assert PinsModelDeclaration.declared() == ModelDeclaration(Pin, query=PinQuery, excluded_subcommands=["delete"])


def test_a_module_gives_its_class_declarations_beside_its_short_inline_ones():
    assert BoardModule.model_declarations() == [ModelDeclaration(Pin, query=PinQuery, excluded_subcommands=["delete"]), ModelDeclaration(Pin)]
