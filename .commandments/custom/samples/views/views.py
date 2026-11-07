from dataclasses import dataclass

from core.base.model.view_model import ViewModel


# @sin architecture_views_view_model_without_select
@dataclass(frozen=True, kw_only=True)
class ShelfCount(ViewModel):
    cli_name = "shelf-count"
    view = "shelf_counts"
    key = "shelf_id"

    shelf_id: int


# @righteous architecture_views_view_model_without_select
@dataclass(frozen=True, kw_only=True)
class ShelfLabel(ViewModel):
    cli_name = "shelf-label"
    view = "shelf_labels"
    key = "label"
    select = "SELECT label FROM shelves"

    label: str


# @sin architecture_views_second_view_reader
class ViewQuery:
    pass
