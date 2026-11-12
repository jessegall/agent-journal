from engine.enums.occupant import INDEPENDENT_OCCUPANTS
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.module.profile_check import ProfileCheck
from engine.profile.agent_profile import KEPT_AGENTS_TEXT
from argparse import ArgumentParser, BooleanOptionalAction, Namespace
from dataclasses import replace

from engine.enums.access import Access
from engine.enums.model_tier import ModelTier
from engine.caller.caller import Caller
from engine.profile.agent_profile import AgentProfile
from engine.provider.providers import Providers
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.skills.commands.save_profile.save_profile import SaveProfile
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_format import ProfileFormat
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.modules.skills.support.profile_skills import ProfileSkills


class SaveProfileSubcommand(Subcommand[SaveProfile, AgentProfile]):
    """Saves a personal profile or changes to a registered profile. Only a person or the main agent may: a
    helper of any type is refused before anything is read or written."""

    cli_name = "profile"
    name = "save"
    outward = True

    def __init__(self, files: ProfileFiles, providers: Providers, skills: ProfileSkills, types: HelperTypeBook, agents: AgentRows) -> None:
        self.files, self.providers, self.skills, self.types, self.agents = files, providers, skills, types, agents

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile_name")
        for name in ("title", "type", "program", "fallback-programs", "mcp-tools", "writable-folders"):
            parser.add_argument(f"--{name}")
        for provider in self.providers.all():
            parser.add_argument(provider.model_option, dest=f"program_model_{provider.name}")
        parser.add_argument("--tier", help="fast, general or strongest; blank uses the profile models")
        parser.add_argument("--description")
        parser.add_argument("--body")
        parser.add_argument("--access", type=Access, choices=list(Access))
        parser.add_argument("--independent", action=BooleanOptionalAction, default=None)
        parser.add_argument("--occupant", help="continue, when-cold or each-launch: when the program session of an agent is replaced")
        parser.add_argument("--reuse", help="not accepted: only a person retires an agent")
        parser.add_argument("--keeps-project-instructions", dest="uses_project_instructions", action=BooleanOptionalAction, default=None, help="a helper's own checkout keeps the project's instruction files beside the ones written for this profile")
        parser.add_argument("--skills", help="the skill folders the profile's agents get, a comma list or a JSON list; blank takes the skills of the profile's type")
        parser.add_argument("--required-skills", help="the skills of this profile its agents must read at the start, a comma list or a JSON list; blank requires none")
        parser.add_argument("--injections", help='JSON naming each injection into the instruction files with true or false, such as {"journal": false}')
        parser.add_argument("--program-if-possible", dest="preferred_program", action=BooleanOptionalAction, default=None, help="start on the other program when this one cannot start")

    def command(self, arguments: Namespace, caller: Caller) -> SaveProfile:
        self.agents.require_main(caller.actor, "save a profile")
        if arguments.reuse is not None:
            raise Refusal(KEPT_AGENTS_TEXT, "remove --reuse: --occupant sets when a session is replaced")
        if self.files.has(arguments.profile_name):
            profile = self.files.row(arguments.profile_name)
            if isinstance(profile, ProfileProblem) or profile.problem:
                raise Refusal(profile.problem, "fix the file or use journal profile reset")
        else:
            profile = AgentProfile(arguments.profile_name)
        fields = {name: value for name, value in vars(arguments).items() if name in ("title", "description", "body", "program", "preferred_program", "access", "uses_project_instructions") and value is not None}
        if arguments.independent is not None:
            fields["occupant"] = INDEPENDENT_OCCUPANTS[arguments.independent]
        if arguments.occupant is not None:
            fields["occupant"] = ProfileFormat.occupant(arguments.occupant)
        if arguments.tier is not None:
            fields["tier"] = ModelTier.automatic(arguments.tier) if arguments.tier else None
        if arguments.type is not None:
            fields["agent_type"] = arguments.type
        if arguments.fallback_programs is not None:
            fields["fallback_programs"] = self.registered(ProfileFormat.tools(arguments.fallback_programs))
        if arguments.injections is not None:
            fields["injections"] = ProfileFormat.injections(arguments.injections)
        if arguments.skills is not None:
            fields["skills"] = ProfileFormat.tools(arguments.skills)
        if arguments.mcp_tools is not None:
            fields["mcp_tools"] = ProfileFormat.tools(arguments.mcp_tools)
        if arguments.writable_folders is not None:
            fields["writable_folders"] = ProfileFormat.tools(arguments.writable_folders)
        profile = replace(profile, **fields)
        declared = self.types.find(profile.agent_type)
        if arguments.occupant is not None and declared.start_line:
            raise Refusal(ProfileCheck.occupant_problem(profile.name, declared.label, declared.start_line), "remove --occupant")
        for provider in self.providers.all():
            model = getattr(arguments, f"program_model_{provider.name}")
            if model is not None:
                profile = provider.with_profile_model(profile, model)
        required = None if arguments.required_skills is None else ProfileFormat.tools(arguments.required_skills)
        return SaveProfile(self.skills.with_required(profile, required))

    def registered(self, programs: tuple[str, ...]) -> tuple[str, ...]:
        available = [provider.name for provider in self.providers.all()]
        unknown = [program for program in programs if program not in available]
        if unknown:
            raise Refusal(f"no program named {', '.join(unknown)}", f"name programs from: {', '.join(available)}")
        return programs

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentProfile):
            output.line(f"saved {value.name} in {value.path}")
