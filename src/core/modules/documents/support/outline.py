from dataclasses import dataclass

from core.modules.documents.support.section import Section

FENCE = "```"
TOP_HEADING = "(before the first heading)"


@dataclass(frozen=True)
class Outline:
    """A text as its sections: every # heading outside a code fence starts one, and the text before the first
    heading is section 0, left out when it is blank."""

    sections: tuple[Section, ...]

    @classmethod
    def built(cls, text: str) -> "Outline":
        sections: list[Section] = [Section(0, TOP_HEADING, ())]
        fence_open = False
        for line in text.splitlines():
            if line.startswith(FENCE):
                fence_open = not fence_open
            if line.startswith("#") and not fence_open:
                sections.append(Section(len(sections), line.lstrip("#").strip(), ()))
            else:
                sections[-1] = sections[-1].with_line(line)
        return cls(tuple(section for section in sections if section.number or any(line.strip() for line in section.lines)))

    def section(self, wanted: str) -> Section | None:
        return next((section for section in self.sections if str(section.number) == wanted or section.heading.lower() == wanted.lower()), None)
