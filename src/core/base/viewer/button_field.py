from collections.abc import Mapping, Sequence
from typing import Any

from core.base.viewer.choice_field import ChoiceField
from core.base.viewer.template_field import TemplateField
from core.base.viewer.text_field import TextField

ButtonField = ChoiceField | TextField | TemplateField


def restored_field(stored: Mapping[str, Any]) -> ButtonField:
    if "choices" in stored:
        return ChoiceField.restored(stored)
    if "target" in stored:
        return TemplateField(**stored)
    return TextField(**stored)


def restored_fields(stored: Sequence[Mapping[str, Any]]) -> tuple[ButtonField, ...]:
    return tuple(restored_field(field) for field in stored)
