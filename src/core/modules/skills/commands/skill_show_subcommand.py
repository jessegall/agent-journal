from argparse import ArgumentParser, Namespace
from dataclasses import dataclass
from pathlib import Path

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.skills.support.skill_catalogue import SkillCatalogue


@dataclass(frozen=True)
class SkillText:
    """A skill's text with its folder, description and digest, as the catalogue holds them."""

    folder: str
    description: str
    digest: str
    text: str


class SkillShowSubcommand(ReadSubcommand[SkillText]):
    """`journal skill show <folder>`: the text of one skill and its digest, from the catalogue."""

    cli_name = "skill"
    name = "show"

    def __init__(self, catalogue: SkillCatalogue) -> None:
        self.catalogue = catalogue

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("folder")

    def read(self, arguments: Namespace, caller: Caller) -> SkillText:
        skill = next((entry for entry in self.catalogue.skills() if entry.folder == arguments.folder), None)
        if skill is None:
            raise Refusal(f"no module declares the skill {arguments.folder}", "journal skill list shows the skills")
        return SkillText(skill.folder, skill.description, skill.digest, Path(skill.path).read_text())

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, SkillText):
            return
        if output.json_output:
            output.row(value)
            return
        output.line(f"digest: {value.digest}")
        output.line(value.text)
