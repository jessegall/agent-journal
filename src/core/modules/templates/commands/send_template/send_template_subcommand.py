from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.models.message import Message
from core.modules.templates.commands.send_template.send_template import SendTemplate


class SendTemplateSubcommand(Subcommand[SendTemplate, Message]):
    """Sends template send <n> --on=<type:id> --set=<name>=<value> as a person's comment."""

    cli_name = "template"
    name = "send"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("template_id", type=int)
        parser.add_argument("--on", dest="target", required=True)
        parser.add_argument("--set", dest="values", action="append", default=[])

    def command(self, arguments: Namespace, caller: Caller) -> SendTemplate:
        values: dict[str, str] = {}
        for assignment in arguments.values:
            name, separator, value = assignment.partition("=")
            if not separator or not name or name in values:
                raise Refusal(f"invalid or repeated template value {assignment!r}", "give each value once as --set=name=value")
            values[name] = value
        return SendTemplate(arguments.template_id, arguments.target, values)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Message):
            output.line(f"template sent as message {value.id}")
