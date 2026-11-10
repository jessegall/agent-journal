from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_skill_list import ProfileSkillList
from core.modules.skills.support.profile_skills import ProfileSkills


class ProfileSkillsSubcommand(ReadSubcommand[ProfileSkillList]):
    """`journal profile skills --profile <profile>`: every skill, whether the profile's agents get it, and whether it
    is made for the profile's own agent type."""

    cli_name = "profile"
    name = "skills"
    row_line = "{key}: {status}"
    empty_line = "no skills"

    def __init__(self, files: ProfileFiles, skills: ProfileSkills) -> None:
        self.files, self.skills = files, skills

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--profile", required=True)

    def read(self, arguments: Namespace, caller: Caller) -> ProfileSkillList:
        profile = self.files.effective(arguments.profile)
        return ProfileSkillList(profile.name, self.skills.rows(profile))
