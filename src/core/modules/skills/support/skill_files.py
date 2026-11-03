import shutil
from collections.abc import Sequence
from pathlib import Path

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.provider.providers import Providers
from core.base.registry.skill_entry import SkillEntry
from core.base.skill.skill_declaration import SKILL_FILE
from core.base.skill.skill_digest import SkillDigest
from core.base.module.skill_check import FOLDER_PREFIX
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_projects import SkillProjects


class SkillFiles:
    """Publishes skills in each program's folder and selects paths for agent reminders."""

    def __init__(self, projects: SkillProjects, providers: Providers, catalogue: SkillCatalogue) -> None:
        self.projects, self.providers, self.catalogue = projects, providers, catalogue

    def path(self, folder: str, hook: AgentHook) -> Path:
        project = self.projects.agent_folder(hook.agent_id, hook.environment_id)
        path = Path(self.providers.provider(hook.event.program).skills_folder) / folder / SKILL_FILE
        return project / path if hook.role is AgentRole.WORKER else path

    def write_all(self, skills: Sequence[SkillEntry]) -> dict[str, bool]:
        projects = self.projects.projects()
        return {skill.folder: any(tuple(self.write(project, skill) for project in projects)) for skill in skills}

    def write(self, project: Path, skill: SkillEntry) -> bool:
        text, changed = Path(skill.path).read_text(), False
        for program_folder in self.providers.skill_folders():
            target = project / program_folder / skill.folder / SKILL_FILE
            if target.exists() and SkillDigest.digest(target.read_text()) == SkillDigest.digest(text):
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(text)
            changed = True
        return changed

    def place(self, project: Path) -> tuple[str, ...]:
        for skill in self.catalogue.skills():
            self.write(project, skill)
        return self.providers.skill_folders()

    def remove_all(self) -> None:
        for root in self.projects.roots((*self.providers.skill_folders(), ".codex/skills")):
            for folder in root.glob(f"{FOLDER_PREFIX}*"):
                if folder.is_dir():
                    shutil.rmtree(folder)

    def clear(self, declared: Sequence[SkillEntry]) -> list[str]:
        names, cleared = {skill.folder for skill in declared}, list[str]()
        legacy_roots = set(self.projects.roots([".codex/skills"]))
        for root in (*self.projects.roots(self.providers.skill_folders()), *legacy_roots):
            stale = [folder for folder in root.glob(f"{FOLDER_PREFIX}*") if folder.is_dir() and (root in legacy_roots or folder.name not in names)]
            for folder in stale:
                shutil.rmtree(folder)
                cleared.append(folder.name)
        return list(dict.fromkeys(cleared))
