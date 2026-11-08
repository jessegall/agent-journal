from dataclasses import dataclass
from pathlib import Path

from core.base.file_access import FileAccess
from core.base.instruction_imports import INSTRUCTION_FILES
from core.base.profile.agent_profile import AgentProfile
from core.base.registry.registry import Registry
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.manifest_listener import ManifestListener
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.modules.profiles.support.profile_settings import WORKER_INSTRUCTION_FILES_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.library_folders import LibraryFolders
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

JOURNAL_KEY = "journal"
JOURNAL_TITLE = "Inject the journal briefing"
WORKER_DRIVER = "coding.worker"
ORIGINAL_SUFFIX = ".original"


@dataclass(frozen=True)
class InstructionInjection:
    """One block of text a profile can have in its instruction files: its key, the title of its switch, its text and
    whether it is on for the profile."""

    key: str
    title: str
    text: str
    is_on: bool


class WorkerInstructionFiles:
    """Writes the instruction files of a worker's worktree for its profile, in place of the project's copies: the
    profile's text and each injection the profile has on, the journal's own briefing and each plugin's block. The
    project's originals stay beside them when the profile says so, and the written files stay out of the worker's
    commits. A person can turn it off with the setting."""

    def __init__(self, settings: SettingValues, profiles: ProfileFiles, registry: Registry, plugins: PluginQuery, folders: PluginFolders, git: WorktreeGit, libraries: LibraryFolders) -> None:
        self.settings, self.profiles, self.registry, self.plugins, self.folders, self.git, self.libraries = settings, profiles, registry, plugins, folders, git, libraries

    def injections(self, profile: AgentProfile) -> tuple[InstructionInjection, ...]:
        driver = self.registry.driver(WORKER_DRIVER)
        journal_text = "\n".join(driver.opening_lines) if driver is not None else ""
        found = [InstructionInjection(JOURNAL_KEY, JOURNAL_TITLE, journal_text, profile.injections.get(JOURNAL_KEY, True))]
        for plugin in self.plugins.enabled_plugins():
            folder = self.folders.code(plugin.name)
            for block in PluginManifest.read(folder).instruction_blocks:
                key = f"{plugin.name}.{block.key}"
                path = folder / block.file
                text = FileAccess.shared().read(path).strip() if ManifestListener.is_contained_path(block.file, folder) and path.is_file() else ""
                found.append(InstructionInjection(key, block.title, text, profile.injections.get(key, block.default)))
        return tuple(found)

    def profile(self, name: str) -> AgentProfile | None:
        row = self.profiles.row(name) if name else None
        return None if row is None or isinstance(row, ProfileProblem) else row

    def write(self, folder: str, profile_name: str) -> None:
        profile = self.profile(profile_name)
        if profile is None or not self.settings.flag(WORKER_INSTRUCTION_FILES_SETTING):
            return
        parts = [profile.body.strip(), *(injection.text for injection in self.injections(profile) if injection.is_on and injection.text)]
        if profile.keeps_project_instructions:
            parts.append("The project's own instruction files are kept beside these, named with .original before .md.")
        text = "\n\n".join(part for part in parts if part) + "\n"
        untracked_after = self.git.hold_back(folder, INSTRUCTION_FILES)
        written: list[str] = []
        for name in INSTRUCTION_FILES:
            path = Path(folder) / name
            if profile.keeps_project_instructions and path.is_file():
                original = path.with_name(f"{path.stem}{ORIGINAL_SUFFIX}{path.suffix}")
                FileAccess.shared().write(original, FileAccess.shared().read(path))
                written.append(original.name)
            FileAccess.shared().write(path, text)
            if name in untracked_after:
                written.append(name)
        self.libraries.exclude(folder, written)
