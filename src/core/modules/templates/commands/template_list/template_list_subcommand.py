from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.templates.commands.support.template_heading import TemplateHeading
from core.modules.templates.models.template import Template
from core.modules.templates.conditions.template_target import TemplateTarget
from core.modules.templates.queries.template_query import TemplateQuery


class TemplateListSubcommand(ReadSubcommand[Sequence[Template]]):
    """`journal template list`: every template with what it applies to and its purpose."""

    cli_name = "template"
    name = "list"

    def __init__(self, templates: TemplateQuery) -> None:
        self.templates = templates

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--target", help="Show templates that apply to this target")
        parser.add_argument("--purpose", help="Show templates with this purpose")

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Template]:
        query = self.templates.active().oldest()
        if arguments.target is not None:
            query = query.matching(TemplateTarget(arguments.target))
        if arguments.purpose is not None:
            query = query.filter(purpose=arguments.purpose)
        return tuple(query.all_rows())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, Template)] if is_tuple(value) else []
        output.write("\n".join(f"{row.id:>4}  {TemplateHeading.text(row)}" for row in listed), {"rows": [output.values(row) for row in listed]})
