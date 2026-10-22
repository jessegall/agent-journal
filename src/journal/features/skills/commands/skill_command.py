from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.skills.support.skill_files import SkillFiles


class SkillCommand(Command):
    noun = "skill"

    def __init__(self, files: SkillFiles) -> None:
        self.files = files

    def arguments(self, verbs) -> None:
        self.verb(verbs, "write", "write every feature's skill into the agents' skill folders")
        self.verb(verbs, "list", "every skill the journal teaches")

    def write(self, args: Namespace, caller: Caller) -> int:
        for path in self.files.write_all():
            print(path.relative_to(self.files.config.root))
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for skill in self.files.registry.skills():
            print(f"{skill.folder:<20} {skill.description}")
        return 0
