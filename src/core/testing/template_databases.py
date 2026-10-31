import json
import shutil
from pathlib import Path

from core.base.journal_container import opened_container
from core.base.database.database import Database
from core.base.journal_home import JournalHome
from core.base.module.module_sync import ModuleSync
from core.testing.manual_clock import ManualClock
from core.base.clock import Clock


class TemplateDatabases:
    """One migrated and synced database per set of modules, item once and copied for every story that loads
    the same modules."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder
        self.homes: dict[tuple[str, ...], JournalHome] = {}

    def copied(self, modules: tuple[str, ...], target: JournalHome) -> None:
        template = self.homes.get(modules) or self.new_template(modules)
        target.folder.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(template.database, target.database)
        shutil.copyfile(template.module_list, target.module_list)

    def new_template(self, modules: tuple[str, ...]) -> JournalHome:
        home = JournalHome(self.folder / f"template-{len(self.homes) + 1}")
        home.folder.mkdir(parents=True)
        home.module_list.write_text(json.dumps(list(modules)))
        container = opened_container(home)
        container.bind(Clock, ManualClock())
        container.get(ModuleSync).run()
        container.get(Database).close()
        self.homes[modules] = home
        return home
