from core.base.module.module import Module
from core.base.module.noun import Noun
from tests.core.base.test_model import Loan


class LoansModule(Module):
    name = "loans"
    requires_core = ">=5.0,<6"
    nouns = (Noun(Loan),)
    guards = ("tests.core.base.unused_guard_sample:ShelvesOnlyGuard",)
    listeners = ("tests.core.base.listener_sample:ShelfCounter",)
