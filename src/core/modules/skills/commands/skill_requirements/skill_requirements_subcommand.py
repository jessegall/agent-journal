from argparse import Namespace

from engine.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.skills.support.skill_requirements import SkillRequirements


class SkillRequirementsSubcommand(ReadSubcommand[SkillRequirements]):
    """Reads project skill requirements and whether this environment replaces them."""

    cli_name = "skill"
    name = "requirements"

    def __init__(self, reader: SettingReader) -> None:
        self.reader = reader

    def read(self, arguments: Namespace, caller: Caller) -> SkillRequirements:
        return SkillRequirements.read(self.reader)
