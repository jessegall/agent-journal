from pathlib import Path

from engine.file.file_access import FileAccess
from engine.instruction.instruction_imports import INSTRUCTION_FILES
from engine.profile.agent_profile import AgentProfile
from engine.file.versions.file_version import FileVersion
from engine.registry.registry import Registry
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.manifest_listener import ManifestListener
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from suites.coding.modules.workers.support.worker_settings import WORKER_INSTRUCTION_FILES_SETTING
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.library_folders import LibraryFolders
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.instruction_injection import InstructionInjection

JOURNAL_KEY = "journal"
JOURNAL_TITLE = "Inject the journal briefing"
WORKER_DRIVER = "coding.worker"
ORIGINAL_SUFFIX = ".original"


class WorkerInstructionFiles:
    """Writes the instruction files of a worker's worktree for its profile, in place of the project's copies:
    the profile's text and each injection the profile has on, the journal's own briefing and each plugin's
    block. The project's originals stay beside them when the profile says so, and the written files stay
    out of the worker's commits. A user can turn it off with the setting."""

    def __init__(self, settings: SettingValues, profiles: ProfileFiles, registry: Registry, plugins: RunnablePlugins, folders: PluginFolders, git: WorktreeGit, libraries: LibraryFolders,
                 agents: AgentRows) -> None:
        self.settings, self.profiles, self.registry, self.plugins, self.folders, self.git, self.libraries = settings, profiles, registry, plugins, folders, git, libraries
        self.agents = agents
        self.file_texts: dict[Path, tuple[FileVersion, str]] = {}

    def injections(self, profile: AgentProfile) -> tuple[InstructionInjection, ...]:
        driver = self.registry.driver(WORKER_DRIVER)
        journal_text = "\n".join(driver.opening_lines) if driver is not None else ""
        injections = [InstructionInjection(JOURNAL_KEY, JOURNAL_TITLE, journal_text, profile.injections.get(JOURNAL_KEY, True))]
        for runnable in self.plugins.running():
            folder = self.folders.code(runnable.plugin.name)
            for block in runnable.manifest.instruction_blocks:
                key = f"{runnable.plugin.name}.{block.key}"
                path = folder / block.file
                text = self.block_text(folder, block.file, path)
                injections.append(InstructionInjection(key, block.title, text, profile.injections.get(key, block.default)))
        return tuple(injections)

    def block_text(self, folder: Path, file: str, path: Path) -> str:
        if not ManifestListener.is_contained_path(file, folder) or not path.is_file():
            return ""
        return self.kept_text(path).strip()

    def kept_text(self, path: Path) -> str:
        version = FileAccess.shared().version(path)
        kept = self.file_texts.get(path)
        if kept is None or kept[0] != version:
            kept = (version, FileAccess.shared().read(path))
            self.file_texts[path] = kept
        return kept[1]

    def profile(self, name: str) -> AgentProfile | None:
        row = self.profiles.row(name) if name else None
        return None if row is None or isinstance(row, ProfileProblem) else row

    def write(self, folder: str, profile_name: str, originals: bool = True) -> None:
        profile = self.profile(profile_name)
        if profile is None or not self.settings.flag(WORKER_INSTRUCTION_FILES_SETTING):
            return
        parts = [profile.body.strip(), *(injection.text for injection in self.injections(profile) if injection.enabled and injection.text)]
        if profile.uses_project_instructions:
            parts.append("The project's own instruction files are kept beside these, named with .original before .md.")
        text = "\n\n".join(part for part in parts if part) + "\n"
        original_texts = {name: self.file_text(Path(folder) / name) for name in INSTRUCTION_FILES}
        if all(original_texts[name] == text for name in INSTRUCTION_FILES):
            return
        untracked_after = self.git.untrack_files(folder, INSTRUCTION_FILES)
        restored: list[str] = []
        for name in INSTRUCTION_FILES:
            path = Path(folder) / name
            original_text = original_texts[name]
            if originals and profile.uses_project_instructions and original_text is not None:
                original = path.with_name(f"{path.stem}{ORIGINAL_SUFFIX}{path.suffix}")
                FileAccess.shared().write(original, original_text)
                restored.append(original.name)
            if original_text != text:
                FileAccess.shared().write(path, text)
            if name in untracked_after:
                restored.append(name)
        self.libraries.exclude(folder, restored)

    def refresh(self, worktree: Worktree) -> None:
        self.write(worktree.folder, self.agents.find(worktree.session_agent_id).profile, originals=False)

    def file_text(self, path: Path) -> str | None:
        return self.kept_text(path) if path.is_file() else None
