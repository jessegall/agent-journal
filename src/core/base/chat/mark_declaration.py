from collections.abc import Sequence
from dataclasses import dataclass
from enum import StrEnum
from string import Formatter

from core.base.chat.mark_button import MarkButton
from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_grouping import MarkGrouping

GROUP_LABEL_FIELDS = ("family", "type", "count")


@dataclass(frozen=True)
class MarkDeclaration:
    """A type of chat mark a module adds: its type and variants as members of the module's own enums, its family, the
    words Show in chat lists it under, what a click on it and on its group does, its buttons, and the file of its own
    body if it has one, and the viewer kit versions it was built for."""

    type: StrEnum
    variants: type[StrEnum]
    family: MarkFamily
    label: str
    mark_icon: str
    click: MarkClick = MarkClick.UNFOLD
    grouping: MarkGrouping = MarkGrouping.FAMILY
    group_label: str = "{family}: {count} updates"
    group_buttons: Sequence[MarkButton] = ()
    buttons: Sequence[MarkButton] = ()
    body: str = ""
    shown: bool = True
    main: bool = True
    process: bool = False
    kit: str = ">=1,<2"

    def problems(self) -> list[str]:
        fields = [field for _, field, _, _ in Formatter().parse(self.group_label) if field is not None]
        return [f"the mark {self.type} puts {{{field}}} in its group label, which takes only {{family}}, {{type}} and {{count}}"
                for field in dict.fromkeys(fields) if field not in GROUP_LABEL_FIELDS]
