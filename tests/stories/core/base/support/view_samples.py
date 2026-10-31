from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.base.module.module import Module

MISSING_COLUMN = "tests.stories.core.base.support.view_samples:MissingColumnModule"
EXTRA_COLUMN = "tests.stories.core.base.support.view_samples:ExtraColumnModule"


@dataclass(frozen=True, kw_only=True)
class ItemTitle(ViewModel):
    """A sample view model whose SELECT lacks its title column."""

    cli_name = "item-title"
    view = "item_titles"
    key = "item_id"
    select = "SELECT items.id AS item_id FROM items"

    item_id: int
    title: str


@dataclass(frozen=True, kw_only=True)
class ItemState(ViewModel):
    """A sample view model whose SELECT has a column it does not declare."""

    cli_name = "item-state"
    view = "item_states"
    key = "item_id"
    select = "SELECT items.id AS item_id, items.state, items.title FROM items"

    item_id: int
    state: str


class MissingColumnModule(Module):
    name = "item-titles"
    requires_core = ">=5,<6"
    dependencies = ["items"]
    views = [ItemTitle]


class ExtraColumnModule(Module):
    name = "item-states"
    requires_core = ">=5,<6"
    dependencies = ["items"]
    views = [ItemState]
