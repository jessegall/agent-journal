from core.base.skill.skill_contents import SkillContents
from argparse import ArgumentParser, Namespace
from core.base.caller.caller import Caller
from engine.errors.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.argument_alias import declare_argument_alias
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_text import SkillText
from pathlib import Path


class SkillShowSubcommand(ReadSubcommand[SkillText]):
    """`journal skill show <folder>`: the text of one skill and its digest, from the catalogue."""

    cli_name = "skill"
    name = "show"

    def __init__(self, catalogue: SkillCatalogue) -> None:
        self.catalogue = catalogue

    def arguments(self, parser: ArgumentParser) -> None:
        declare_argument_alias(parser, "folder")

    def read(self, arguments: Namespace, caller: Caller) -> SkillText:
        skill = next((entry for entry in self.catalogue.skills() if entry.folder == arguments.folder), None)
        if skill is None:
            raise Refusal(f"no module declares the skill {arguments.folder}", "journal skill list shows the skills")
        return SkillText(skill.folder, skill.description, skill.digest, SkillContents.read(Path(skill.path)).text)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, SkillText):
            return
        if output.json_output:
            output.row(value)
            return
        output.line(f"digest: {value.digest}")
        output.line(value.text)
