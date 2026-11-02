from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.profiles.commands.save_profile.save_profile import SaveProfile
from core.modules.profiles.support.agent_profile import SUBAGENT, AgentProfile


class SaveProfileSubcommand(Subcommand[SaveProfile, AgentProfile]):
    """`journal profile save <name> --description "<when it is used>" [--tools "<tools>"]
    [--type subagent|worker] [--model <model>] [--codex-model <model>] [--body "<instructions>"]`."""

    cli_name = "profile"
    name = "save"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile_name")
        parser.add_argument("--description", default="")
        parser.add_argument("--tools", default="Read, Grep, Glob")
        parser.add_argument("--type", default=SUBAGENT)
        parser.add_argument("--model", default="")
        parser.add_argument("--codex-model", default="")
        parser.add_argument("--body", default="")

    def command(self, arguments: Namespace, caller: Caller) -> SaveProfile:
        return SaveProfile(AgentProfile(arguments.profile_name, arguments.description, arguments.tools, arguments.body, arguments.type, arguments.model, arguments.codex_model))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentProfile):
            output.line(f"saved {value.name} in {value.path}")
