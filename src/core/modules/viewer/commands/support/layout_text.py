import json

from core.base.type_guards import is_mapping, is_text_list

SPLIT_DIRECTIONS = ("row", "col")


def is_layout_text(text: str) -> bool:
    try:
        return is_arranged_layout(json.loads(text))
    except ValueError:
        return False


# The tree the viewer arranges and keeps: tabs of windows with whatever options the pane holds, or a split of two.
def is_arranged_layout(data: object) -> bool:
    if not is_mapping(data):
        return False
    if is_text_list(data.get("tabs")):
        return True
    return data.get("dir") in SPLIT_DIRECTIONS and is_arranged_layout(data.get("a")) and is_arranged_layout(data.get("b"))
