from engine.skill.skill_contents import SkillContents
from engine.file.file_access import FileAccess
import shutil
from collections.abc import Callable, Sequence
from pathlib import Path

from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.driver.agent_hook import AgentHook
from engine.provider.providers import Providers
from engine.registry.skill_entry import SkillEntry
from engine.skill.skill_declaration import SKILL_FILE
from engine.skill.skill_digest import SkillDigest
from engine.module.skill_check import FOLDER_PREFIX
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_projects import SkillProjects


class SkillFiles:
    """Publishes skills in each program's folder and selects paths for agent reminders."""

    def __init__(self, projects: SkillProjects, providers: Providers, catalogue: SkillCatalogue, suites: SuiteChoice) -> None:
        self.projects, self.providers, self.catalogue = projects, providers, catalogue
        self.suites = suites

    def path(self, folder: str, hook: AgentHook) -> Path:
        project = self.projects.agent_folder(hook.agent_id, hook.environment_id)
        path = Path(self.providers.provider(hook.event.program).skills_folder) / folder / SKILL_FILE
        return project / path if hook.role in self.suites.agent_policy().project_skill_roles else path

    def instruction(self, folder: str, hook: AgentHook) -> str:
        return self.providers.provider(hook.event.program).skill_instruction(folder, self.path(folder, hook))

    def agent_instruction(self, folder: str, agent: Agent) -> str:
        provider = self.providers.provider(agent.program)
        path = Path(provider.skills_folder) / folder / SKILL_FILE
        if agent.role in self.suites.agent_policy().project_skill_roles:
            path = self.projects.agent_folder(agent.id, agent.environment_id) / path
        return provider.skill_instruction(folder, path)

    def readable(self, folder: str) -> Path:
        return self.readable_paths([folder])[folder]

    def readable_paths(self, folders: Sequence[str]) -> dict[str, Path]:
        projects, program_folders = self.projects.projects(), self.providers.skill_folders()
        return {folder: self.first_present([project / program_folder / folder / SKILL_FILE for project in projects for program_folder in program_folders]) for folder in folders}

    def first_present(self, paths: Sequence[Path]) -> Path:
        return next((path for path in paths if FileAccess.exists(path)), paths[0])

    def write_all(self, skills: Sequence[SkillEntry]) -> dict[str, bool]:
        projects = self.projects.projects()
        permitted = {project: self.projects.permitted(project) for project in projects}
        published: dict[str, bool] = {}
        for skill in skills:
            source = Path(skill.path)
            # a skill whose file the registry still names but that is gone is left out; the others are written all the same
            if not FileAccess.is_file(source):
                published[skill.folder] = False
                continue
            text = SkillContents.read(source).text
            published[skill.folder] = any(tuple(self.publish(project, skill, text, permitted[project](skill.folder)) for project in projects))
        return published

    def write(self, project: Path, skill: SkillEntry) -> bool:
        return self.publish(project, skill, SkillContents.read(Path(skill.path)).text, self.projects.permitted(project)(skill.folder))

    def publish(self, project: Path, skill: SkillEntry, text: str, is_permitted: bool) -> bool:
        if not is_permitted:
            return False
        changed = False
        for program_folder in self.providers.skill_folders():
            target = project / program_folder / skill.folder / SKILL_FILE
            if target.resolve() == Path(skill.path).resolve():
                continue
            if FileAccess.exists(target) and SkillContents.read(target).digest == SkillDigest.digest(text):
                continue
            FileAccess.mkdir(target.parent, parents=True, exist_ok=True)
            FileAccess.write(target, text)
            changed = True
        return changed

    def place(self, project: Path) -> tuple[str, ...]:
        for skill in self.catalogue.skills():
            self.write(project, skill)
        return self.providers.skill_folders()

    def clear(self, declared: Sequence[SkillEntry]) -> list[str]:
        names, cleared = {skill.folder for skill in declared}, list[str]()
        legacy_roots = set(self.projects.roots([".codex/skills"]))
        permitted: dict[Path, Callable[[str], bool]] = {}
        for root in (*self.projects.roots(self.providers.skill_folders()), *legacy_roots):
            is_permitted = permitted.setdefault(root.parents[1], self.projects.permitted(root.parents[1]))
            stale = [folder for folder in FileAccess.glob(root, f"{FOLDER_PREFIX}*") if FileAccess.is_dir(folder) and (root in legacy_roots or folder.name not in names or not is_permitted(folder.name))]
            for folder in stale:
                shutil.rmtree(folder)
                cleared.append(folder.name)
        return list(dict.fromkeys(cleared))
