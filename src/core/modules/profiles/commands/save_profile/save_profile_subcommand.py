from argparse import ArgumentParser, BooleanOptionalAction, Namespace
from dataclasses import replace

from core.base.access import Access
from core.base.provider.model_tier import ModelTier
from core.base.caller.caller import Caller
from core.base.profile.agent_profile import AgentProfile
from core.base.provider.providers import Providers
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.profiles.commands.save_profile.save_profile import SaveProfile
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_format import ProfileFormat
from core.modules.profiles.support.profile_problem import ProfileProblem


class SaveProfileSubcommand(Subcommand[SaveProfile, AgentProfile]):
    """Saves a personal profile or changes to a registered profile."""

    cli_name = "profile"
    name = "save"
    outward = True

    def __init__(self, files: ProfileFiles, providers: Providers) -> None:
        self.files, self.providers = files, providers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile_name")
        for name in ("title", "type", "program", "mcp-tools", "writable-folders"):
            parser.add_argument(f"--{name}")
        for provider in self.providers.all():
            parser.add_argument(provider.model_option, dest=f"program_model_{provider.name}")
        parser.add_argument("--tier", help="fast, general or strongest; blank uses the profile models")
        parser.add_argument("--description", default="")
        parser.add_argument("--body", default="")
        parser.add_argument("--access", type=Access, choices=list(Access))
        parser.add_argument("--independent", action=BooleanOptionalAction, default=None)
        parser.add_argument("--program-if-possible", action=BooleanOptionalAction, default=None, help="start on the other program when this one cannot start")

    def command(self, arguments: Namespace, caller: Caller) -> SaveProfile:
        if self.files.has(arguments.profile_name):
            profile = self.files.row(arguments.profile_name)
            if isinstance(profile, ProfileProblem) or profile.problem:
                raise Refusal(profile.problem, "fix the file or use journal profile reset")
        else:
            profile = AgentProfile(arguments.profile_name, description=arguments.description, body=arguments.body)
        fields = {name: value for name, value in vars(arguments).items() if name in ("title", "description", "body", "program", "program_if_possible", "access", "independent") and value is not None}
        if arguments.tier is not None:
            fields["tier"] = ModelTier.automatic(arguments.tier) if arguments.tier else None
        if arguments.type is not None:
            fields["agent_type"] = arguments.type
        if arguments.mcp_tools is not None:
            fields["mcp_tools"] = ProfileFormat.tools(arguments.mcp_tools)
        if arguments.writable_folders is not None:
            fields["writable_folders"] = ProfileFormat.tools(arguments.writable_folders)
        profile = replace(profile, **fields)
        for provider in self.providers.all():
            model = getattr(arguments, f"program_model_{provider.name}")
            if model is not None:
                profile = provider.with_profile_model(profile, model)
        return SaveProfile(profile)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentProfile):
            output.line(f"saved {value.name} in {value.path}")
