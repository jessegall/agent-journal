from engine.file.file_access import FileAccess
import fcntl
import hashlib
import json
import pickle
import re
import tempfile
import time
import weakref
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
from engine.file.copies.file_clone import FileClone
from engine.testing.templates.template import Template
from engine.testing.templates.template_adaptation import STATE_FILE, TemplateAdaptation
from engine.testing.templates.touched_code import TouchedCode
from engine.testing.cache.folder_stat import FolderStat
from engine.testing.stories.working_journal import WorkingJournal

WORKING_FOLDER_PREFIX = "story-journals-"
STALE_WORKING_FOLDER_SECONDS = 6 * 3600
UNUSED_VARIANT_SECONDS = 24 * 3600


class TemplateDatabases:
    """Migrated databases shared by test processes and kept for later runs: a template is built the first
    time a story uses it and saved as a numbered variant; a changed file its build ran (see TouchedCode)
    makes the next story build a new variant beside it, so a runner copying from the old one is never
    disturbed. A story runs on a working journal of its template that rolls back at its end, so only a
    runner's first story of a template copies it."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder
        self.adaptation = TemplateAdaptation(CORE_FOLDER.parent.parent.resolve())
        self.templates: dict[tuple[tuple[str, ...], type[StoryFixture] | None], Template] = {}
        self.working_folder = FileAccess.make_temporary_folder(prefix=WORKING_FOLDER_PREFIX)
        weakref.finalize(self, FileAccess.rmtree, self.working_folder, True)
        self.working_journals: dict[Path, list[WorkingJournal]] = {}

    @staticmethod
    def remove_stale_working_folders(current_time: float) -> None:
        for folder in FileAccess.glob(Path(tempfile.gettempdir()), f"{WORKING_FOLDER_PREFIX}*"):
            try:
                modified = FileAccess.stat(folder).st_mtime
            except FileNotFoundError:
                # another test run removed it between the listing and this read: nothing is left to remove
                continue
            if current_time - modified > STALE_WORKING_FOLDER_SECONDS:
                FileAccess.rmtree(folder, ignore_errors=True)

    def story(self, folder: Path, modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> Story:
        template = self.template(modules, fixture)
        journal = self.free_journal(template)
        journal.reserve()
        story = Story.opened(self.linked_home(template, journal, folder), template.state)
        story.attach_journal(journal)
        return story

    # a journal home with every module synced and no story around it, for the integration tests that need a real
    # database but no story kit
    def synced_home(self, folder: Path, modules: tuple[str, ...] = ()) -> JournalHome:
        return self.copy(self.template(modules, None), folder)

    # a journal home copied from a story fixture's template, built once and kept like a story's, with the actors the
    # fixture made: an integration test starts from a fixture's state without replaying its lines
    def fixture_home(self, folder: Path, fixture: type[StoryFixture], modules: tuple[str, ...] = ()) -> tuple[JournalHome, StoryState]:
        template = self.template(modules, fixture)
        return self.copy(template, folder), template.state

    def free_journal(self, template: Template) -> WorkingJournal:
        journals = self.working_journals.setdefault(template.home.database, [])
        free = next((journal for journal in journals if not journal.is_taken), None)
        if free is not None:
            return free
        journal = WorkingJournal(template.home.database, self.working_folder / f"{template.home.folder.name}-{len(journals)}.db")
        journals.append(journal)
        return journal

    def linked_home(self, template: Template, journal: WorkingJournal, folder: Path) -> JournalHome:
        home = JournalHome(folder)
        FileAccess.mkdir(home.folder, parents=True, exist_ok=True)
        FileAccess.unlink(home.database, missing_ok=True)
        FileAccess.symlink_to(home.database, journal.file)
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
        with self.locked(self.folder / f"{name}.lock"):
            folder = self.current_variant(name)
            if folder is None:
                folder = self.build_variant(name, modules, fixture)
            FileAccess.update_timestamp(folder)
            usable = self.usable_folder(folder, folder.name)
            return Template(JournalHome(usable), pickle.loads(FileAccess.binary(usable / STATE_FILE)))

    def variants(self, name: str) -> list[Path]:
        pattern = re.compile(re.escape(name) + r"-v(\d+)")
        matched = [folder for folder in FileAccess.glob(self.folder, f"{name}-v*") if pattern.fullmatch(folder.name)]
        return sorted(matched, key=lambda folder: int(pattern.fullmatch(folder.name).group(1)))

    def current_variant(self, name: str) -> Path | None:
        touched = TouchedCode(Path(self.adaptation.checkout))
        return next((folder for folder in reversed(self.variants(name)) if FileAccess.is_file(folder / STATE_FILE) and touched.is_unchanged(folder)), None)

    def build_variant(self, name: str, modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> Path:
        older = self.variants(name)
        folder = self.folder / f"{name}-v{int(older[-1].name.rsplit('-v', 1)[1]) + 1 if older else 1}"
        self.drop_unused_variants(older)
        touched = TouchedCode(Path(self.adaptation.checkout))
        with touched.recording():
            built = self.fixture_template(folder, modules, fixture) if fixture else self.synced_template(folder, modules)
        touched.write(folder, self.template(modules, fixture.parent).home.folder if fixture else None)
        state = folder / (STATE_FILE + ".new")
        FileAccess.write_binary(state, pickle.dumps(built.state))
        FileAccess.replace(state, folder / STATE_FILE)
        self.adaptation.mark(folder)
        return folder

    def drop_unused_variants(self, variants: list[Path]) -> None:
        for variant in variants:
            if FolderStat.modified_time(variant) < time.time() - UNUSED_VARIANT_SECONDS or not FileAccess.is_file(variant / STATE_FILE):
                FileAccess.rmtree(variant, ignore_errors=True)
                for adapted in FileAccess.glob(self.folder, f"{variant.name}-*"):
                    FileAccess.rmtree(adapted, ignore_errors=True)

    def usable_folder(self, folder: Path, name: str) -> Path:
        if self.adaptation.builder_name(folder) == self.adaptation.checkout:
            return folder
        adapted = self.folder / f"{name}-{hashlib.sha1(self.adaptation.checkout.encode()).hexdigest()[:16]}"
        if not FileAccess.is_file(adapted / STATE_FILE) or self.adaptation.builder_name(adapted) != self.adaptation.checkout:
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
        with FileAccess.writer(path) as lock_file:
            fcntl.flock(lock_file, fcntl.LOCK_EX)
            yield

    def synced_template(self, folder: Path, modules: tuple[str, ...]) -> Template:
        home = JournalHome(folder)
        FileAccess.mkdir(home.folder, parents=True)
        FileAccess.write(home.module_list, json.dumps(list(modules)))
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
        FileAccess.mkdir(home.folder, parents=True, exist_ok=True)
        FileClone.copy(template.home.database, home.database)
        self.copy_lists(template, home)
        return home

    @staticmethod
    def copy_lists(template: Template, home: JournalHome) -> None:
        FileAccess.copyfile(template.home.module_list, home.module_list)
        FileAccess.copyfile(template.home.program_table, home.program_table)
