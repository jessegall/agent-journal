import shutil
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.skill.skill_declaration import SKILL_FILE
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.skills.support.skill_catalogue import FRONT_MATTER_MARK, PLUGIN_KEY, SkillCatalogue
from core.modules.skills.support.skill_files import PROGRAM_FOLDERS



class PluginSkillFiles:
    """A plugin's skills in the agent programs' skill folders: each folder of its skills folder published while it
    is on, with plugin: <name> added to the front matter, and taken away when it is switched off or removed."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def names(self, folder: Path, manifest: PluginManifest) -> list[str]:
        if not manifest.skills_folder:
            return []
        return sorted(path.parent.name for path in (folder / manifest.skills_folder).glob(f"*/{SKILL_FILE}"))

    def publish(self, folder: Path, manifest: PluginManifest) -> None:
        for name in self.names(folder, manifest):
            text = self.with_plugin_key((folder / manifest.skills_folder / name / SKILL_FILE).read_text(), manifest.name)
            for program_folder in PROGRAM_FOLDERS:
                target = self.home.project_folder / program_folder / name / SKILL_FILE
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(text)

    def withdraw(self, plugin_name: str) -> None:
        for program_folder in PROGRAM_FOLDERS:
            for path in (self.home.project_folder / program_folder).glob(f"*/{SKILL_FILE}"):
                fields = SkillCatalogue.front_matter(path.read_text())
                if PLUGIN_KEY in fields and fields[PLUGIN_KEY] == plugin_name:
                    shutil.rmtree(path.parent)

    @staticmethod
    def with_plugin_key(text: str, plugin_name: str) -> str:
        if text.startswith(FRONT_MATTER_MARK):
            return text.replace(FRONT_MATTER_MARK + "\n", f"{FRONT_MATTER_MARK}\n{PLUGIN_KEY}: {plugin_name}\n", 1)
        return f"{FRONT_MATTER_MARK}\n{PLUGIN_KEY}: {plugin_name}\n{FRONT_MATTER_MARK}\n\n{text}"
