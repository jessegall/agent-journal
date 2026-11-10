from tests.unit.core.base.samples.listener_sample import ShelfCounter
from tests.unit.core.base.samples.unused_guard_sample import ShelfGuard
from engine.module.module import Module
from engine.module.model_declaration import ModelDeclaration
from tests.unit.engine.model.test_model import Item


class ItemsModule(Module):
    name = "items"
    requires_core = ">=5.0,<6"
    models = [ModelDeclaration(Item)]
    guards = [ShelfGuard]
    listeners = [ShelfCounter]
