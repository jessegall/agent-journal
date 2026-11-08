from core.base.file_access import FileAccess
import fcntl
import hashlib
import inspect
import json
import pickle
import shutil
from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path
from core.base.clock import Clock
from core.base.database.database import Database
from core.base.journal_container import opened_container
from core.base.journal_home import JournalHome
from core.base.module.code_fingerprint import CORE_FOLDER
from core.base.module.module_sync import ModuleSync
from core.testing.manual_clock import ManualClock
from core.testing.story import Story
from core.testing.story_state import StoryState
from core.testing.story_fixture import StoryFixture
from core.testing.template import Template
from core.testing.template_adaptation import STATE_FILE, TemplateAdaptation



class TemplateDatabases:
    """Migrated databases shared by test processes and copied for each story."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder
        self.adaptation = TemplateAdaptation(CORE_FOLDER.parent.parent.resolve())
        self.templates: dict[tuple[tuple[str, ...], type[StoryFixture] | None], Template] = {}

    def story(self, folder: Path, modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> Story:
        template = self.template(modules, fixture)
        home = self.copy(template, folder)
        return Story.opened(home, template.state)

    def template(self, modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> Template:
        template = self.templates.get((modules, fixture))
        if template is None:
            template = self.shared_template(modules, fixture)
            self.templates[(modules, fixture)] = template
        return template

    def shared_template(self, modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> Template:
        name = hashlib.sha1(repr(self.template_key(modules, fixture)).encode()).hexdigest()[:16]
        folder = self.folder / name
        with self.locked(self.folder / f"{name}.lock"):
            if not (folder / STATE_FILE).is_file():
                shutil.rmtree(folder, ignore_errors=True)
                built = self.fixture_template(folder, modules, fixture) if fixture else self.synced_template(folder, modules)
                state = folder / (STATE_FILE + ".new")
                FileAccess.shared().write_binary(state, pickle.dumps(built.state))
                FileAccess.shared().replace(state, folder / STATE_FILE)
                self.adaptation.mark(folder)
            usable = self.usable_folder(folder, name)
            return Template(JournalHome(usable), pickle.loads(FileAccess.shared().binary(usable / STATE_FILE)))

    def usable_folder(self, folder: Path, name: str) -> Path:
        if self.adaptation.built_in(folder) == self.adaptation.checkout:
            return folder
        adapted = self.folder / f"{name}-{hashlib.sha1(self.adaptation.checkout.encode()).hexdigest()[:16]}"
        if not (adapted / STATE_FILE).is_file() or self.adaptation.built_in(adapted) != self.adaptation.checkout:
            self.adaptation.adapted(folder, adapted)
        return adapted

    @staticmethod
    def template_key(modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> list[object]:
        key: list[object] = [modules]
        current = fixture
        while current is not None:
            source = inspect.getsourcefile(current)
            key += [current.__module__, current.__qualname__, FileAccess.shared().read(Path(source)) if source else ""]
            current = current.parent
        return key

    @staticmethod
    @contextmanager
    def locked(path: Path) -> Generator[None]:
        with FileAccess.shared().writer(path) as lock_file:
            fcntl.flock(lock_file, fcntl.LOCK_EX)
            yield

    def synced_template(self, folder: Path, modules: tuple[str, ...]) -> Template:
        home = JournalHome(folder)
        home.folder.mkdir(parents=True)
        FileAccess.shared().write(home.module_list, json.dumps(list(modules)))
        container = opened_container(home)
        container.bind(Clock, ManualClock())
        container.get(ModuleSync).run()
        container.get(Database).close()
        return Template(home, StoryState())

    def fixture_template(self, folder: Path, modules: tuple[str, ...], fixture: type[StoryFixture]) -> Template:
        base = self.template(modules, fixture.parent)
        story = Story.opened(self.copy(base, folder), base.state)
        fixture().steps(story)
        fixture().expect(story)
        story.close()
        return Template(story.home, story.state)

    def copy(self, template: Template, folder: Path) -> JournalHome:
        home = JournalHome(folder)
        home.folder.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(template.home.database, home.database)
        shutil.copyfile(template.home.module_list, home.module_list)
        shutil.copyfile(template.home.program_table, home.program_table)
        return home
