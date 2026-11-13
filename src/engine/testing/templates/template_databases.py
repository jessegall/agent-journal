from engine.file.file_access import FileAccess
import fcntl
import hashlib
import json
import pickle
import shutil
import tempfile
from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path
from engine.time.clock import Clock
from engine.database.database import Database
from engine.module.journal_container import opened_container
from engine.journal.journal_home import JournalHome
from engine.module.code_fingerprint import CORE_FOLDER
from engine.module.module_sync import ModuleSync
from engine.testing.fakes.manual_clock import ManualClock
from engine.testing.stories.story import Story
from engine.testing.stories.story_state import StoryState
from engine.testing.stories.story_fixture import StoryFixture
from engine.file.file_clone import FileClone
from engine.testing.templates.template import Template
from engine.testing.templates.template_adaptation import STATE_FILE, TemplateAdaptation
from engine.testing.stories.working_journal import WorkingJournal

WORKING_FOLDER_PREFIX = "story-journals-"
STALE_WORKING_FOLDER_SECONDS = 6 * 3600


class TemplateDatabases:
    """Migrated databases shared by test processes and kept for later runs: a template is built the first
    time a story uses it and saved. A story runs on a working journal of its template that rolls back at
    its end, so only a runner's first story of a template copies it."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder
        self.adaptation = TemplateAdaptation(CORE_FOLDER.parent.parent.resolve())
        self.templates: dict[tuple[tuple[str, ...], type[StoryFixture] | None], Template] = {}
        self.working_folder = tempfile.TemporaryDirectory(prefix=WORKING_FOLDER_PREFIX)
        self.working_journals: dict[Path, list[WorkingJournal]] = {}

    @staticmethod
    def remove_stale_working_folders(current_time: float) -> None:
        for folder in Path(tempfile.gettempdir()).glob(f"{WORKING_FOLDER_PREFIX}*"):
            if current_time - folder.stat().st_mtime > STALE_WORKING_FOLDER_SECONDS:
                shutil.rmtree(folder, ignore_errors=True)

    def story(self, folder: Path, modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> Story:
        template = self.template(modules, fixture)
        journal = self.free_journal(template)
        journal.reserve()
        story = Story.opened(self.linked_home(template, journal, folder), template.state)
        story.attach_journal(journal)
        return story

    def free_journal(self, template: Template) -> WorkingJournal:
        journals = self.working_journals.setdefault(template.home.database, [])
        free = next((journal for journal in journals if not journal.is_taken), None)
        if free is not None:
            return free
        journal = WorkingJournal(template.home.database, Path(self.working_folder.name) / f"{template.home.folder.name}-{len(journals)}.db")
        journals.append(journal)
        return journal

    def linked_home(self, template: Template, journal: WorkingJournal, folder: Path) -> JournalHome:
        home = JournalHome(folder)
        home.folder.mkdir(parents=True, exist_ok=True)
        home.database.unlink(missing_ok=True)
        home.database.symlink_to(journal.file)
        self.copy_lists(template, home)
        return home

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
        if self.adaptation.builder_name(folder) == self.adaptation.checkout:
            return folder
        adapted = self.folder / f"{name}-{hashlib.sha1(self.adaptation.checkout.encode()).hexdigest()[:16]}"
        if not (adapted / STATE_FILE).is_file() or self.adaptation.builder_name(adapted) != self.adaptation.checkout:
            self.adaptation.adapted(folder, adapted)
        return adapted

    @staticmethod
    def template_key(modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> list[object]:
        key: list[object] = [modules]
        current = fixture
        while current is not None:
            key += [current.__module__, current.__qualname__, current.source_text]
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
        story.use_fixture_environment(fixture.parent.line_environment() if fixture.parent else None)
        fixture().steps(story)
        story.use_fixture_environment(fixture.line_environment())
        fixture().expect(story)
        story.close()
        return Template(story.home, story.state)

    def copy(self, template: Template, folder: Path) -> JournalHome:
        home = JournalHome(folder)
        home.folder.mkdir(parents=True, exist_ok=True)
        FileClone.copy(template.home.database, home.database)
        self.copy_lists(template, home)
        return home

    @staticmethod
    def copy_lists(template: Template, home: JournalHome) -> None:
        shutil.copyfile(template.home.module_list, home.module_list)
        shutil.copyfile(template.home.program_table, home.program_table)
