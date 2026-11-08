from pathlib import Path

from core.base.file_access import FileAccess
from core.base.instruction_imports import INSTRUCTION_FILES
from core.base.journal_home import JournalHome
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.helpers.support.helper_settings import HELPER_INSTRUCTION_FILES
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.modules.settings.bindings.support.setting_values import SettingValues

PROGRAM_FOLDERS = (".claude", ".agents")
ROLE = "helper"


class HelperStartFolder:
    """Makes a helper's start folder: outside the project, every top-level entry of its parent's checkout a link to the real one, and CLAUDE.md
    and AGENTS.md written for its profile, so the helper reads its parent's checkout as it is but only the instructions it
    needs."""

    def __init__(self, home: JournalHome, folders: AgentFolders, settings: SettingValues, suites: SuiteChoice, profiles: ProfileFiles) -> None:
        self.home, self.folders, self.settings, self.suites, self.profiles = home, folders, settings, suites, profiles

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
        if not project.is_dir():
            return
        folder.mkdir(parents=True, exist_ok=True)
        for entry in project.iterdir():
            if entry.name not in (*INSTRUCTION_FILES, *PROGRAM_FOLDERS):
                self.link(folder / entry.name, entry)
        for name in PROGRAM_FOLDERS:
            self.link_skills(folder / name, project / name)
        for name in INSTRUCTION_FILES:
            FileAccess.shared().write(folder / name, text)

    def checkout(self, helper: Agent) -> Path:
        return self.folders.folder(self.folders.agents.find(helper.parent_id)) if helper.parent_id is not None else self.home.project_folder

    @staticmethod
    def link(path: Path, target: Path) -> None:
        if path.is_symlink() and path.resolve() == target.resolve():
            return
        path.unlink(missing_ok=True)
        path.symlink_to(target)

    def link_skills(self, folder: Path, project_folder: Path) -> None:
        folder.mkdir(exist_ok=True)
        if (project_folder / "skills").exists():
            self.link(folder / "skills", project_folder / "skills")
