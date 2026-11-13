from pathlib import Path

from engine.file.file_access import FileAccess
from engine.instruction.instruction_imports import INSTRUCTION_FILES
from engine.journal.journal_home import JournalHome
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.helpers.support.helper_settings import HELPER_INSTRUCTION_FILES
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from engine.setting.setting_values import SettingValues
from core.modules.skills.support.agent_profile_skills import AgentProfileSkills

PROGRAM_FOLDERS = (".claude", ".agents")
ROLE = "helper"


class HelperStartFolder:
    """Makes a helper's start folder: outside the project, every top-level entry of its parent's checkout a
    link to the real one, and CLAUDE.md and AGENTS.md written for its profile, so the helper reads its
    parent's checkout as it is but only the instructions and skills it needs."""

    def __init__(self, home: JournalHome, folders: AgentFolders, settings: SettingValues, suites: SuiteChoice, profiles: ProfileFiles, skills: AgentProfileSkills) -> None:
        self.home, self.folders, self.settings, self.suites, self.profiles, self.skills = home, folders, settings, suites, profiles, skills

    def text(self, profile_name: str) -> str | None:
        profile = self.profiles.row(profile_name) if profile_name else None
        if profile is None or isinstance(profile, ProfileProblem):
            return None
        driver = self.suites.driver(ROLE)
        return "\n\n".join(part for part in (profile.body.strip(), "\n".join(driver.opening_lines) if driver is not None else "") if part) + "\n"

    def prepare(self, helper: Agent) -> None:
        text = self.text(helper.profile)
        if text is None or not self.settings.flag(HELPER_INSTRUCTION_FILES):
            return
        project, folder = self.checkout(helper), self.folders.start_folder(helper)
        if not FileAccess.is_dir(project):
            return
        FileAccess.mkdir(folder, parents=True, exist_ok=True)
        for entry in FileAccess.iterdir(project):
            if entry.name not in (*INSTRUCTION_FILES, *PROGRAM_FOLDERS):
                self.link(folder / entry.name, entry)
        for name in PROGRAM_FOLDERS:
            self.link_skills(folder / name, project / name, helper)
        for name in INSTRUCTION_FILES:
            FileAccess.write(folder / name, text)

    def checkout(self, helper: Agent) -> Path:
        return self.folders.folder(self.folders.agents.find(helper.parent_id)) if helper.parent_id is not None else self.home.project_folder

    @staticmethod
    def link(path: Path, target: Path) -> None:
        if FileAccess.is_symlink(path) and path.resolve() == target.resolve():
            return
        FileAccess.unlink(path, missing_ok=True)
        FileAccess.symlink_to(path, target)

    def link_skills(self, folder: Path, project_folder: Path, helper: Agent) -> None:
        FileAccess.mkdir(folder, exist_ok=True)
        skills, source = folder / "skills", project_folder / "skills"
        if FileAccess.is_symlink(skills):
            FileAccess.unlink(skills)
        if not FileAccess.is_dir(source):
            return
        FileAccess.mkdir(skills, exist_ok=True)
        for entry in FileAccess.iterdir(source):
            if self.skills.refuses(helper.id, entry.name):
                FileAccess.unlink(skills / entry.name, missing_ok=True)
                continue
            self.link(skills / entry.name, entry)
