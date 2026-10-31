import json

from core.base.viewer.layout_shape import loaded_layout


def is_layout_text(text: str) -> bool:
    try:
        loaded_layout(json.loads(text))
    except ValueError:
        return False
    return True
