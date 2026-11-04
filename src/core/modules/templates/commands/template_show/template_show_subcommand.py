from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.templates.commands.support.template_heading import TemplateHeading
from core.modules.templates.models.template import Template
from core.modules.templates.queries.template_query import TemplateQuery


class TemplateShowSubcommand(ReadSubcommand[Template]):
    """`journal template show <n>`: its heading, brief, parts and phase-end commands."""

    cli_name = "template"
    name = "show"

    def __init__(self, templates: TemplateQuery, environments: EnvironmentNames) -> None:
        self.templates, self.environments = templates, environments

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> Template:
        environment_id = self.environments.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        return self.templates.active(environment_id).find(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, Template):
            return
        if output.json_output:
            output.row(value)
            return
        output.line(f"template {value.id}: {TemplateHeading.text(value)}")
        if value.brief:
            output.line(value.brief)
        for part in value.parts:
            output.line(f"- {part.partition(':')[0].strip()}")
        for command in value.commands:
            output.line(f"runs at each phase end: {command}")
