from core.base.database.database import Database
from core.base.database.statement import Statement
from core.testing.story import Story

TRIGGERS = Statement("SELECT name FROM sqlite_master WHERE type = 'trigger' ORDER BY name")


def test_one_template_is_migrated_once_and_each_story_gets_a_copy_of_its_own(templates, tmp_path):
    first = Story.started(templates, tmp_path / "first", ())
    first.run("environment make main /work/journal")
    template = templates.homes[()]
    second = Story.started(templates, tmp_path / "second", ())
    second.expect_success("environment list", "nothing found")
    first.expect_rows(templates.homes[()] is template, first.home.database != second.home.database)


def test_the_copy_holds_the_generated_triggers_of_every_default_module(templates, tmp_path):
    story = Story.started(templates, tmp_path / "journal", ())
    names = [row["name"] for row in story.container.get(Database).rows(TRIGGERS)]
    story.expect_rows(*(any(name.startswith(table) for name in names) for table in ("tasks_", "plans_", "agents_", "messages_", "actors_")))
