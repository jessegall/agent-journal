from collections.abc import Sequence

from core.base.model.state_book import StateBook
from core.base.module.module import Module


def modules_book(modules: Sequence[type[Module]]) -> StateBook:
    return StateBook(tuple(addition for module in modules for addition in module.added_states))
