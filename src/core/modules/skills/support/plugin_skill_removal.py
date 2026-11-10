from engine.provider.providers import Providers
from engine.skill.skill_contents import SkillContents
from engine.skill.skill_declaration import SKILL_FILE
from core.modules.skills.support.skill_catalogue import PLUGIN_KEY, SkillCatalogue
from core.modules.skills.support.skill_projects import SkillProjects
from pathlib import Path
import shutil


class PluginSkillRemoval:
    """Removes the skills a plugin published from the project and worktree program folders."""

    def __init__(self, projects: SkillProjects, providers: Providers) -> None:
        self.projects, self.providers = projects, providers

    def remove(self, plugin_name: str) -> None:
        for root in self.projects.roots(self.providers.skill_folders()):
            for path in root.glob(f"*/{SKILL_FILE}"):
                fields = SkillCatalogue.front_matter(SkillContents.read(path).text)
                if PLUGIN_KEY in fields and fields[PLUGIN_KEY] == plugin_name:
                    self.remove_folder(path.parent)

    @staticmethod
    def remove_folder(folder: Path) -> None:
        if folder.is_symlink():
            folder.unlink()
            return
        shutil.rmtree(folder)
