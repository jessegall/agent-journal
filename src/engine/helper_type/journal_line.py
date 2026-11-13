from collections.abc import Sequence, Set
from dataclasses import dataclass

from engine.helper_type.enums.journal_line_class import JournalLineClass


@dataclass(frozen=True)
class JournalLine:
    """One journal command a person or an agent runs, as its group and verb, with its subcommand's
    classes."""

    text: str
    classes: Set[JournalLineClass]

    @property
    def group(self) -> str:
        return self.text.partition(" ")[0]

    def is_listed(self, groups: Sequence[str], lines: Sequence[str]) -> bool:
        return self.group in groups or self.text in lines

    def matches_classes(self, classes: Sequence[JournalLineClass]) -> bool:
        return bool(self.classes) and all(line_class in classes for line_class in self.classes)
