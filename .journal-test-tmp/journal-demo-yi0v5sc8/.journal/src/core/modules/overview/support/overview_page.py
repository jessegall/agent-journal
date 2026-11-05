from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.overview.support.overview_section import OverviewSection


@dataclass(frozen=True)
class OverviewPage:
    """What journal overview shows: a section for each command the setting names."""

    sections: Sequence[OverviewSection]

    def text(self) -> str:
        return "\n\n".join(section.lines() for section in self.sections) or "the overview runs no commands: journal setting set journal.core.overview.commands"

    def json(self) -> Mapping[str, object]:
        return {"sections": [{"command": section.command, "text": section.text} for section in self.sections]}
