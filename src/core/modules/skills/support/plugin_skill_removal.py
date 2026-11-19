from engine.file.file_access import FileAccess
from engine.provider.providers import Providers
from engine.skill.skill_contents import SkillContents
from engine.skill.skill_declaration import SKILL_FILE
from core.modules.skills.support.skill_catalogue import PLUGIN_KEY, SkillCatalogue
from core.modules.skills.support.skill_projects import SkillProjects
from pathlib import Path


class PluginSkillRemoval:
    """Removes the skills a plugin published from the program folders of the project and of each separate copy of it:
    all of them, or those it no longer ships. Only a skill marked with the plugin's name is touched, never a person's
    own skill or another plugin's."""

    def __init__(self, projects: SkillProjects, providers: Providers) -> None:
        self.projects, self.providers = projects, providers

    def remove(self, plugin_name: str) -> None:
        for folder in self.published(plugin_name):
            self.remove_folder(folder)

    def remove_unshipped(self, plugin_name: str, shipped_names: frozenset[str]) -> None:
        for folder in self.published(plugin_name):
            if folder.name not in shipped_names:
                self.remove_folder(folder)

    def published(self, plugin_name: str) -> list[Path]:
        folders = []
        for root in self.projects.roots(self.providers.skill_folders()):
            for path in FileAccess.glob(root, f"*/{SKILL_FILE}"):
                fields = SkillCatalogue.front_matter(SkillContents.read(path).text)
                if PLUGIN_KEY in fields and fields[PLUGIN_KEY] == plugin_name:
                    folders.append(path.parent)
        return folders

    @staticmethod
    def remove_folder(folder: Path) -> None:
        if FileAccess.is_symlink(folder):
            FileAccess.unlink(folder)
            return
        FileAccess.rmtree(folder)
