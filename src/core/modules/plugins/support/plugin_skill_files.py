from core.base.skill.skill_contents import SkillContents
from engine.file.file_access import FileAccess
from pathlib import Path

from core.base.provider.providers import Providers
from core.base.skill.skill_declaration import SKILL_FILE
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.skills.support.skill_catalogue import FRONT_MATTER_MARK, PLUGIN_KEY
from core.modules.skills.support.skill_projects import SkillProjects



class PluginSkillFiles:
    """Publishes enabled plugin skills in project and worktree program folders."""

    def __init__(self, projects: SkillProjects, providers: Providers) -> None:
        self.projects, self.providers = projects, providers

    def names(self, folder: Path, manifest: PluginManifest) -> list[str]:
        if not manifest.skills_folder:
            return []
        return sorted(path.parent.name for path in (folder / manifest.skills_folder).glob(f"*/{SKILL_FILE}"))

    def publish(self, folder: Path, manifest: PluginManifest) -> None:
        roots = self.projects.roots(self.providers.skill_folders())
        for name in self.names(folder, manifest):
            text = self.with_plugin_key(SkillContents.read(folder / manifest.skills_folder / name / SKILL_FILE).text, manifest.name)
            for root in roots:
                target = root / name / SKILL_FILE
                target.parent.mkdir(parents=True, exist_ok=True)
                FileAccess.shared().write(target, text)

    @staticmethod
    def with_plugin_key(text: str, plugin_name: str) -> str:
        if text.startswith(FRONT_MATTER_MARK):
            return text.replace(FRONT_MATTER_MARK + "\n", f"{FRONT_MATTER_MARK}\n{PLUGIN_KEY}: {plugin_name}\n", 1)
        return f"{FRONT_MATTER_MARK}\n{PLUGIN_KEY}: {plugin_name}\n{FRONT_MATTER_MARK}\n\n{text}"
