from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.templates.commands.make_template import MakeTemplate
from core.modules.templates.models.template import Template


class MakeTemplateSubcommand(Subcommand[MakeTemplate, Template]):
    """`journal template make <title> --brief --applies-to plan,task --purpose --parts "title: body | ..."
    --commands "cmd | cmd"`."""

    cli_name = "template"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--brief", default="")
        parser.add_argument("--applies-to", default="")
        parser.add_argument("--purpose", default="")
        parser.add_argument("--parts", default="")
        parser.add_argument("--commands", default="")

    def command(self, arguments: Namespace, caller: Caller) -> MakeTemplate:
        def split(text: str, separator: str) -> tuple[str, ...]:
            return tuple(item.strip() for item in text.split(separator) if item.strip())

        return MakeTemplate(arguments.title, arguments.brief, split(arguments.applies_to, ","), arguments.purpose, split(arguments.parts, "|"), split(arguments.commands, "|"))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Template):
            output.line(f"template {value.id}: {value.title}")
