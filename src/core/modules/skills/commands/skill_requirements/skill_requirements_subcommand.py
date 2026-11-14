from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.support.setting_reader import SettingReader
from engine.setting.setting_values import SettingValues
from core.modules.skills.support.skill_requirements import SkillRequirements


class SkillRequirementsSubcommand(ReadSubcommand[SkillRequirements]):
    """Reads project skill requirements and whether this environment replaces them."""

    cli_name = "skill"
    name = "requirements"

    def __init__(self, reader: SettingReader, values: SettingValues) -> None:
        self.reader, self.values = reader, values

    def read(self, arguments: Namespace, caller: Caller) -> SkillRequirements:
        return SkillRequirements.read(self.reader, self.values)
