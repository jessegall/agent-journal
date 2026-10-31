import mimetypes

from core.base.database.database import Database
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.module.module_finder import ModuleFinder
from core.base.registry.registry import Registry
from core.base.viewer.window_loading import WindowLoading
from server.viewer.missing_module_file_error import MissingModuleFileError
from server.viewer.module_file import ModuleFile

UNKNOWN_TYPE = "application/octet-stream"


class ModuleFiles:
    """Answers GET /modules/<module>/<path>: a file from that module's web/dist and nothing outside it, with its
    exact content type, marked when it is a frame window's entry."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def file(self, module_name: str, path: str) -> ModuleFile:
        modules = [module for module in ModuleFinder(self.home).modules() if module.name == module_name]
        if not modules:
            raise MissingModuleFileError(f"no installed module is named {module_name}")
        folder = modules[0].web_folder()
        target = (folder / path).resolve()
        if not target.is_relative_to(folder) or not target.is_file():
            raise MissingModuleFileError(f"{module_name} has no file {path} in its web/dist")
        return ModuleFile(target.read_bytes(), mimetypes.guess_type(target.name)[0] or UNKNOWN_TYPE, self.is_frame_entry(module_name, path))

    def is_frame_entry(self, module_name: str, path: str) -> bool:
        container = synced_container(self.home)
        try:
            windows = container.get(Registry).windows
        finally:
            container.get(Database).close()
        return any(window.module == module_name and window.entry == path and window.loading == WindowLoading.FRAME.value for window in windows)
