from core.base.file_access import FileAccess
import importlib
import json
import keyword
import shutil
import sys
from pathlib import Path

from core.base.database.schema_mismatch_error import SchemaMismatchError
from core.base.dotted_path.dotted_path import DottedPath
from engine.journal.journal_home import JournalHome
from core.base.module.module import Module
from core.base.module.module_error import ModuleError
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_sync import ModuleSync
from core.base.module.sync_report import SyncReport


class ModuleAddition:
    """Copies a Python package into the journal and syncs the Module declared in its module.py."""

    def __init__(self, home: JournalHome, finder: ModuleFinder, sync: ModuleSync) -> None:
        self.home, self.finder, self.sync = home, finder, sync

    def add(self, folder: Path) -> SyncReport:
        source = folder.resolve()
        if not source.is_dir() or not (source / "module.py").is_file():
            raise ModuleError(f"{source} must be a Python package folder with module.py")
        if not source.name.isidentifier() or keyword.iskeyword(source.name):
            raise ModuleError(f"{source.name} is not a Python package name")
        target = self.home.modules_folder / source.name
        if target.exists():
            raise ModuleError(f"module folder {target} is already installed")
        if source.name in sys.modules:
            raise ModuleError(f"Python package {source.name} is already imported; choose another folder name")
        saved_list = FileAccess.shared().read(self.home.module_list) if self.home.module_list.exists() else None
        listed = self.finder.plugin_paths()
        self.home.modules_folder.mkdir(parents=True, exist_ok=True)
        try:
            shutil.copytree(source, target, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
            importlib.invalidate_caches()
            path = self.module_path(source.name)
            FileAccess.shared().write(self.home.module_list, json.dumps([*listed, path]))
            return self.sync.run()
        except (ModuleError, SchemaMismatchError, OSError) as error:
            if saved_list is None:
                self.home.module_list.unlink(missing_ok=True)
            else:
                FileAccess.shared().write(self.home.module_list, saved_list)
            if target.exists():
                shutil.rmtree(target)
            for name in tuple(sys.modules):
                if name == source.name or name.startswith(source.name + "."):
                    del sys.modules[name]
            if isinstance(error, OSError):
                raise ModuleError(f"cannot install module folder {source}: {error}") from error
            raise

    def module_path(self, package: str) -> str:
        self.finder.enable_imports()
        source = f"{package}.module"
        try:
            imported = importlib.import_module(source)
        except (ImportError, SyntaxError) as error:
            raise ModuleError.import_failed(source, error) from error
        declarations = [item for item in vars(imported).values() if isinstance(item, type) and issubclass(item, Module)
                        and item is not Module and item.__module__ == source]
        if len(declarations) != 1:
            raise ModuleError(f"{source} must declare exactly one Module; found {len(declarations)}")
        return DottedPath.class_path(self.finder.module(declarations[0], source)).text
