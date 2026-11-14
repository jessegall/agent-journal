from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any

from engine.enums.command_category import CommandCategory
from engine.helper_type.journal_line import JournalLine
from engine.helper_type.enums.journal_line_class import JournalLineClass


@dataclass(frozen=True)
class CommandAllowList:
    """What an agent of one helper type may run: shell categories, whole journal command groups, single
    journal lines and classes of journal lines; a line passes by class when the list names every class it
    has. Whatever it does not name is refused."""

    categories: Sequence[CommandCategory] = ()
    groups: Sequence[str] = ()
    lines: Sequence[str] = ()
    classes: Sequence[JournalLineClass] = ()

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "CommandAllowList":
        return cls(tuple(CommandCategory(value) for value in stored["categories"]), tuple(stored["groups"]), tuple(stored["lines"]),
                   tuple(JournalLineClass(value) for value in stored["classes"]))

    def allows_category(self, category: CommandCategory) -> bool:
        return category in self.categories

    def allows(self, line: JournalLine) -> bool:
        return line.is_listed(self.groups, self.lines) or line.matches_classes(self.classes)

    def refused_line(self, lines: Sequence[JournalLine]) -> JournalLine | None:
        return next((line for line in lines if not self.allows(line)), None)

    # a line whose group the joined list names is covered by that group and is not listed beside it
    def joined(self, type_list: "CommandAllowList") -> "CommandAllowList":
        groups = tuple(dict.fromkeys((*self.groups, *type_list.groups)))
        lines = tuple(line for line in dict.fromkeys((*self.lines, *type_list.lines)) if line.partition(" ")[0] not in groups)
        return CommandAllowList(tuple(dict.fromkeys((*self.categories, *type_list.categories))), groups, lines, tuple(dict.fromkeys((*self.classes, *type_list.classes))))

    def intersection(self, profile: "CommandAllowList") -> "CommandAllowList":
        return CommandAllowList(tuple(category for category in profile.categories if category in self.categories), tuple(group for group in profile.groups if group in self.groups),
                                tuple(line for line in profile.lines if line in self.lines or line.partition(" ")[0] in self.groups),
                                tuple(line_class for line_class in profile.classes if line_class in self.classes))

    def widened_names(self, profile: "CommandAllowList") -> tuple[str, ...]:
        kept = self.intersection(profile)
        return (*(category.value for category in profile.categories if category not in kept.categories), *(group for group in profile.groups if group not in kept.groups),
                *(line for line in profile.lines if line not in kept.lines), *(line_class.value for line_class in profile.classes if line_class not in kept.classes))

    def entries(self) -> tuple[str, ...]:
        return (*self.groups, *self.lines)
