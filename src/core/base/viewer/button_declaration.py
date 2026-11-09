from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any

from core.base.viewer.agent_field import AgentField
from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_field import ButtonField, restored_fields
from core.base.viewer.button_menu_item import ButtonMenuItem
from core.base.viewer.choice import Choice
from core.base.viewer.choice_field import ChoiceField
from core.base.viewer.template_field import TemplateField
from core.base.viewer.text_field import TextField

__all__ = ["Choice", "ChoiceField", "TextField", "TemplateField", "AgentField", "ButtonCondition", "ButtonMenuItem", "ButtonDeclaration"]


@dataclass(frozen=True)
class ButtonDeclaration:
    """A viewer button with its slots, command, form fields and menu actions."""

    name: str
    slots: Sequence[str]
    label: str
    runs: str
    icon: str = ""
    primary: bool = False
    fields: Sequence[ButtonField] = ()
    condition: ButtonCondition | None = None
    menu: Sequence[ButtonMenuItem] = ()
    menu_label: str = ""
    tip: str = ""
    confirm: str = ""
    danger: bool = False

    def has_slot_with(self, prefixes: str | tuple[str, ...]) -> bool:
        return any(slot.startswith(prefixes) for slot in self.slots)

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "ButtonDeclaration":
        condition = stored.get("condition")
        return cls(name=stored["name"], slots=tuple(stored["slots"]), label=stored["label"], runs=stored["runs"],
                   icon=stored.get("icon", ""), primary=stored.get("primary", False), fields=restored_fields(stored.get("fields", ())),
                   condition=ButtonCondition(condition["field"], tuple(condition["values"])) if condition is not None else None,
                   menu=tuple(ButtonMenuItem.restored(item) for item in stored.get("menu", ())),
                   menu_label=stored.get("menu_label", ""), tip=stored.get("tip", ""),
                   confirm=stored.get("confirm", ""), danger=stored.get("danger", False))
