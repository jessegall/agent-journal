import itertools
import json
import shutil
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


class TemplateDatabases:
    """One migrated and synced database per set of modules, and one more per fixture built on it, each made once
    and copied for every story that starts from it."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder
        self.numbers = itertools.count(1)
        self.templates: dict[tuple[tuple[str, ...], type[StoryFixture] | None], Template] = {}

    def story(self, folder: Path, modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> Story:
        template = self.template(modules, fixture)
        home = self.copy(template, folder)
        return Story.opened(home, template.state)

    def template(self, modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> Template:
        template = self.templates.get((modules, fixture))
        if template is None:
            template = self.fixture_template(modules, fixture) if fixture else self.synced_template(modules)
            self.templates[(modules, fixture)] = template
        return template

    def synced_template(self, modules: tuple[str, ...]) -> Template:
        home = JournalHome(self.folder / f"template-{next(self.numbers)}")
        home.folder.mkdir(parents=True)
        home.module_list.write_text(json.dumps(list(modules)))
        container = opened_container(home)
        container.bind(Clock, ManualClock())
        container.get(ModuleSync).run()
        container.get(Database).close()
        return Template(home, StoryState())

    def fixture_template(self, modules: tuple[str, ...], fixture: type[StoryFixture]) -> Template:
        base = self.template(modules, fixture.parent)
        story = Story.opened(self.copy(base, self.folder / f"template-{next(self.numbers)}"), base.state)
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
