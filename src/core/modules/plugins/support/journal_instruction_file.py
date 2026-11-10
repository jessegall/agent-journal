import re
from pathlib import Path

from core.base.file_access import FileAccess
from engine.instruction.instruction_imports import IMPORT_LINE, INSTRUCTION_FILES, JOURNAL_FILE
from engine.journal.journal_home import JournalHome
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.manifest_listener import ManifestListener
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.runnable_plugins import RunnablePlugins

JOURNAL_TEXT = Path(__file__).with_name("journal_instructions.md")
JOURNAL_IMPORT = f"@{JOURNAL_FILE}"
OLD_BLOCK = re.compile(r"<!-- BEGIN: agent-journal.*?<!-- END: agent-journal[^\n]*-->\n*", re.DOTALL)


class JournalInstructionFile:
    """Writes the project's JOURNAL.md from the journal's own text and the text each enabled plugin declares, and
    gives CLAUDE.md and AGENTS.md the one line that imports it, so no text is ever put into those two files."""

    def __init__(self, home: JournalHome, runnable: RunnablePlugins, folders: PluginFolders) -> None:
        self.home, self.runnable, self.folders = home, runnable, folders

    def write(self) -> None:
        project = self.home.project_folder
        journal_file = project / JOURNAL_FILE
        self.save(journal_file, self.current_text(journal_file), self.text())
        for name in INSTRUCTION_FILES:
            self.append_import(project / name)

    def text(self) -> str:
        parts = [FileAccess.shared().read(JOURNAL_TEXT).strip()]
        parts.extend(text for plugin in self.runnable.enabled_rows() for text in self.plugin_texts(plugin))
        return "\n\n".join(parts) + "\n"

    def plugin_texts(self, plugin: Plugin) -> list[str]:
        manifest = self.runnable.readable_manifest(plugin)
        if manifest is None:
            return []
        folder = self.folders.code(plugin.name)
        files = [name for name in manifest.injected_instructions if ManifestListener.is_contained_path(name, folder) and (folder / name).is_file()]
        return [FileAccess.shared().read(folder / name).strip() for name in files]

    def append_import(self, file: Path) -> None:
        current_text = self.current_text(file)
        if current_text is None:
            self.save(file, None, self.with_import(""))
            return
        self.save(file, current_text, self.with_import(OLD_BLOCK.sub("", current_text)))

    @staticmethod
    def with_import(text: str) -> str:
        names = IMPORT_LINE.findall(text)
        if JOURNAL_FILE in names or any(name in INSTRUCTION_FILES for name in names):
            return text
        return f"{text.rstrip()}\n\n{JOURNAL_IMPORT}\n".lstrip()

    @staticmethod
    def current_text(file: Path) -> str | None:
        return FileAccess.shared().read(file) if file.is_file() else None

    @staticmethod
    def save(file: Path, current_text: str | None, text: str) -> None:
        if current_text != text:
            FileAccess.shared().write(file, text)
