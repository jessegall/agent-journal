from core.base.journal_home import JournalHome
from core.base.registry.registry import Registry
from core.base.registry.skill_entry import SkillEntry
from core.base.skill.skill_declaration import SKILL_FILE
from core.base.skill.skill_digest import SkillDigest
from core.modules.skills.support.skill_files import PROGRAM_FOLDERS

FRONT_MATTER_MARK = "---"
PLUGIN_KEY = "plugin"


class SkillCatalogue:
    """Every skill an agent may be given: the skills the modules declare, and the skills an installed plugin
    published into the agent programs' skill folders, which carry plugin: <name> in their front matter."""

    def __init__(self, registry: Registry, home: JournalHome) -> None:
        self.registry, self.home = registry, home

    def skills(self) -> tuple[SkillEntry, ...]:
        return (*self.registry.skills, *self.plugin_skills())

    def plugin_skills(self) -> list[SkillEntry]:
        root = self.home.project_folder / PROGRAM_FOLDERS[0]
        entries: list[SkillEntry] = []
        for path in sorted(root.glob(f"*/{SKILL_FILE}")):
            text = path.read_text()
            fields = self.front_matter(text)
            if PLUGIN_KEY in fields:
                entries.append(SkillEntry(path.parent.name, f"plugin:{fields[PLUGIN_KEY]}", fields["description"] if "description" in fields else "", (), (), (),
                                          SkillDigest.digest(text), str(path), False))
        return entries

    @staticmethod
    def front_matter(text: str) -> dict[str, str]:
        lines = text.splitlines()
        if not lines or lines[0].strip() != FRONT_MATTER_MARK:
            return {}
        fields: dict[str, str] = {}
        for line in lines[1:]:
            if line.strip() == FRONT_MATTER_MARK:
                break
            key, colon, value = line.partition(":")
            if colon:
                fields[key.strip()] = value.strip()
        return fields
