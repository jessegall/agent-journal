from dataclasses import asdict

from core.base.type_guards import is_mapping, is_text_list
from core.base.viewer.layout_split import LayoutSplit
from core.base.viewer.layout_tabs import LayoutTabs

LayoutShape = LayoutTabs | LayoutSplit


def tabs(*windows: str) -> LayoutTabs:
    return LayoutTabs(tuple(windows), windows[0])


def split(direction: str, share: float, first: LayoutShape, second: LayoutShape) -> LayoutSplit:
    return LayoutSplit(direction, share, first, second)


def stored_layout(shape: LayoutShape) -> object:
    return asdict(shape)


def loaded_layout(data: object) -> LayoutShape:
    if not is_mapping(data):
        raise ValueError(f"{data!r} is no layout")
    windows, active = data.get("windows"), data.get("active")
    if is_text_list(windows) and isinstance(active, str):
        return LayoutTabs(tuple(windows), active)
    direction, share = data.get("direction"), data.get("share")
    if not isinstance(direction, str) or not isinstance(share, (int, float)):
        raise ValueError(f"{data!r} is no layout")
    return LayoutSplit(direction, float(share), loaded_layout(data.get("first")), loaded_layout(data.get("second")))
