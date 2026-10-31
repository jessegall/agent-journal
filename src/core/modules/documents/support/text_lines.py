from argparse import ArgumentParser, Namespace

from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.modules.documents.support.outline import Outline

OUTLINE_HINT = 'read a section with --section <n or heading>, its bullets with --bullets, search with --grep "<words>", or read it all with --all'


class TextLines:
    """Prints a document or a report the way it is asked for: the outline, one section, its bullets, the lines a
    search finds, or the whole text."""

    @staticmethod
    def write(heading: str, abstract: str, body: str, arguments: Namespace, output: Output) -> None:
        outline = Outline.built(body)
        if arguments.all:
            output.line(body)
            return
        if arguments.grep:
            matching_lines = [f"{section.number} {section.heading}: {line}" for section in outline.sections for line in section.lines if arguments.grep.lower() in line.lower()]
            output.line("\n".join(matching_lines) if matching_lines else f"no line holds {arguments.grep}")
            return
        if arguments.section:
            section = outline.section(arguments.section)
            if section is None:
                raise Refusal(f"no section {arguments.section}: the outline numbers them from 1", "the outline lists them with their numbers")
            if arguments.bullets:
                output.line("\n".join(section.bullets()))
                return
            output.line(f"{section.number}. {section.heading}")
            output.line("\n".join(section.lines))
            return
        output.line(heading)
        output.line(abstract)
        for section in outline.sections:
            output.line(f"{section.number}  {section.heading}  ({len(section.lines)} lines)")
        output.line(OUTLINE_HINT)

    @staticmethod
    def reading_flags(parser: ArgumentParser) -> None:
        parser.add_argument("--section")
        parser.add_argument("--bullets", action="store_true")
        parser.add_argument("--grep")
        parser.add_argument("--all", action="store_true")
