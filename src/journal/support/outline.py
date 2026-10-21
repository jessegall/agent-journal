from argparse import ArgumentParser, Namespace
from dataclasses import dataclass

from journal.support.refused import Refused
from journal.support.section import Section


@dataclass(frozen=True)
class Outline:
    """A markdown text read the way an agent reads a document or a report: its headings first, then one section at a time, never the whole."""

    sections: tuple[Section, ...]

    @classmethod
    def of(cls, text: str) -> "Outline":
        sections, heading, lines, fenced = [], "(before the first heading)", [], False
        for line in text.splitlines():
            fenced ^= line.lstrip().startswith("```")
            if line.startswith("#") and not fenced:
                sections.append(Section(len(sections), heading, tuple(lines)))
                heading, lines = line.lstrip("#").strip(), []
            else:
                lines.append(line)
        sections.append(Section(len(sections), heading, tuple(lines)))
        return cls(tuple(s for s in sections if s.number or any(line.strip() for line in s.lines)))

    @staticmethod
    def arguments(parser: ArgumentParser) -> None:
        parser.add_argument("--section", help="read one section, by its number in the outline or its heading")
        parser.add_argument("--bullets", action="store_true", help="with --section, only the section's bullets")
        parser.add_argument("--grep", help="the lines holding these words, each with its section")

    def told(self, args: Namespace) -> list[str]:
        if args.grep:
            return self.found(args.grep)
        if args.section:
            section = self.section(args.section)
            return section.bullets() if args.bullets else [f"{section.number}. {section.heading}", *section.lines]
        return [section.outline_line() for section in self.sections] + ["read a section with --section <n or heading>, its bullets with --bullets, or search with --grep \"<words>\""]

    def section(self, wanted: str) -> Section:
        for section in self.sections:
            if wanted == str(section.number) or wanted.lower() == section.heading.lower():
                return section
        raise Refused(f"no section {wanted}: the outline numbers them from 1")

    def found(self, text: str) -> list[str]:
        lowered = text.lower()
        return [f"{section.number} {section.heading}: {line.strip()}" for section in self.sections for line in section.lines if lowered in line.lower()] or [f"no line holds {text}"]
