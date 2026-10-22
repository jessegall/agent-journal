from argparse import ArgumentParser, Namespace
from dataclasses import dataclass

from journal.support.rejection import Rejection
from journal.support.section import Section


@dataclass(frozen=True)
class Outline:
    """A markdown text read the way an agent reads a document or a report: its headings first, then one section at a time, and the whole only when asked for with --all."""

    sections: tuple[Section, ...]
    text: str

    @classmethod
    def build(cls, text: str) -> "Outline":
        sections: list[Section] = []
        lines: list[str] = []
        heading, fenced = "(before the first heading)", False
        for line in text.splitlines():
            fenced ^= line.lstrip().startswith("```")
            if line.startswith("#") and not fenced:
                sections.append(Section(len(sections), heading, tuple(lines)))
                heading, lines = line.lstrip("#").strip(), []
            else:
                lines.append(line)
        sections.append(Section(len(sections), heading, tuple(lines)))
        return cls(tuple(s for s in sections if s.number or any(line.strip() for line in s.lines)), text)

    @staticmethod
    def arguments(parser: ArgumentParser) -> None:
        parser.add_argument("--section", help="read one section, by its number in the outline or its heading")
        parser.add_argument("--bullets", action="store_true", help="with --section, only the section's bullets")
        parser.add_argument("--grep", help="the lines holding these words, each with its section")
        parser.add_argument("--all", action="store_true", help="the whole text, every section, when the outline is not enough")

    def summary(self, args: Namespace) -> list[str]:
        if args.all:
            return self.text.splitlines()
        if args.grep:
            return self.rows(args.grep)
        if args.section:
            section = self.section(args.section)
            return section.bullets() if args.bullets else [f"{section.number}. {section.heading}", *section.lines]
        return [section.outline_line() for section in self.sections] + ["read a section with --section <n or heading>, its bullets with --bullets, search with --grep \"<words>\", or read it all with --all"]

    def section(self, wanted: str) -> Section:
        for section in self.sections:
            if wanted == str(section.number) or wanted.lower() == section.heading.lower():
                return section
        raise Rejection(f"no section {wanted}: the outline numbers them from 1")

    def rows(self, text: str) -> list[str]:
        lowered = text.lower()
        return [f"{section.number} {section.heading}: {line.strip()}" for section in self.sections for line in section.lines if lowered in line.lower()] or [f"no line holds {text}"]
