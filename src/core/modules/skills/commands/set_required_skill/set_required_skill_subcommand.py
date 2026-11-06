from argparse import ArgumentParser, BooleanOptionalAction, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.skills.commands.set_required_skill.set_required_skill import SetRequiredSkill
from core.modules.skills.support.required_agents import RequiredAgents
from core.modules.skills.support.skill_requirements import SkillRequirements


class SetRequiredSkillSubcommand(Subcommand[SetRequiredSkill, SkillRequirements]):
    """Changes the start requirements of one skill for the whole project."""

    cli_name = "skill"
    name = "set-required"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("skill")
        parser.add_argument("--agents", type=RequiredAgents, choices=list(RequiredAgents), required=True)
        parser.add_argument("--after-compaction", action=BooleanOptionalAction, default=True)

    def command(self, arguments: Namespace, caller: Caller) -> SetRequiredSkill:
        return SetRequiredSkill(arguments.skill, arguments.agents, arguments.after_compaction)
