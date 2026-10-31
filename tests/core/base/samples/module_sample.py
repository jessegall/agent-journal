from core.base.module.module import Module
from core.base.module.noun import Noun
from tests.core.base.model.test_model import Item


class ItemsModule(Module):
    name = "items"
    requires_core = ">=5.0,<6"
    nouns = (Noun(Item),)
    guards = ("tests.core.base.samples.unused_guard_sample:ShelfGuard",)
    listeners = ("tests.core.base.samples.listener_sample:ShelfCounter",)
