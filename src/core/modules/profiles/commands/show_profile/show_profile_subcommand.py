from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.profile.agent_profile import AgentProfile
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.profiles.support.profile_files import ProfileFiles

SHOWN_FIELDS = ("name", "agent_type", "program", "model", "occupant", "access", "description", "body")


class ShowProfileSubcommand(ReadSubcommand[AgentProfile]):
    """`journal profile show <name>`: the effective profile, with a person's changes over the registered one:
    its type, program, model, occupant, access, description and body."""

    cli_name = "profile"
    name = "show"

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile_name")

    def read(self, arguments: Namespace, caller: Caller) -> AgentProfile:
        return self.files.effective(arguments.profile_name)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentProfile):
            shown = {name: str(field) for name, field in ((name, getattr(value, name)) for name in SHOWN_FIELDS) if field}
            output.write("\n".join(f"{name}: {text}" for name, text in shown.items()), shown)
