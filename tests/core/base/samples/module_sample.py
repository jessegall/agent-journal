from tests.core.base.samples.listener_sample import ShelfCounter
from tests.core.base.samples.unused_guard_sample import ShelfGuard
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from tests.core.base.model.test_model import Item


class ItemsModule(Module):
    name = "items"
    requires_core = ">=5.0,<6"
    models = [ModelDeclaration(Item)]
    guards = [ShelfGuard]
    listeners = [ShelfCounter]
