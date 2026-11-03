import fcntl
import hashlib
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
from core.base.module.module_sync import ModuleSync
from core.testing.manual_clock import ManualClock
from core.testing.story import Story
from core.testing.story_state import StoryState
from core.testing.story_fixture import StoryFixture
from core.testing.template import Template

STATE_FILE = "story-state.pickle"


class TemplateDatabases:
    """One migrated and synced database per set of modules, and one more per fixture built on it, each made once
    for all the workers of a run, under a lock in a folder they share, and copied for every story that starts
    from it."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder
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
        name = hashlib.sha1(repr((modules, fixture.__module__, fixture.__qualname__) if fixture else [modules]).encode()).hexdigest()[:16]
        folder = self.folder / name
        with self.locked(self.folder / f"{name}.lock"):
            if not (folder / STATE_FILE).is_file():
                shutil.rmtree(folder, ignore_errors=True)
                built = self.fixture_template(folder, modules, fixture) if fixture else self.synced_template(folder, modules)
                (folder / STATE_FILE).write_bytes(pickle.dumps(built.state))
            return Template(JournalHome(folder), pickle.loads((folder / STATE_FILE).read_bytes()))

    @staticmethod
    @contextmanager
    def locked(path: Path) -> Generator[None]:
        with path.open("w") as lock_file:
            fcntl.flock(lock_file, fcntl.LOCK_EX)
            yield

    def synced_template(self, folder: Path, modules: tuple[str, ...]) -> Template:
        home = JournalHome(folder)
        home.folder.mkdir(parents=True)
        home.module_list.write_text(json.dumps(list(modules)))
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
