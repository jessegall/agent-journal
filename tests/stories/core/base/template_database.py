from tests.stories.core.support import story_lines as lines
from core.base.database.database import Database
from core.base.database.statement import Statement

TRIGGERS = Statement("SELECT name FROM sqlite_master WHERE type = 'trigger' ORDER BY name")


def test_one_template_is_migrated_once_and_each_story_gets_a_copy_of_its_own(templates, tmp_path):
    first = templates.story(tmp_path / "first", (), None)
    first.run(lines.NEW_ENVIRONMENT)
    template = templates.template((), None)
    second = templates.story(tmp_path / "second", (), None)
    second.expect_success("environment list", "nothing found")
    first.expect_rows(templates.template((), None) is template, first.home.database != second.home.database)


def test_the_copy_holds_the_generated_triggers_of_every_default_module(templates, tmp_path):
    story = templates.story(tmp_path / "journal", (), None)
    names = [row["name"] for row in story.container.get(Database).rows(TRIGGERS)]
    story.expect_rows(*(any(name.startswith(table) for name in names) for table in ("tasks_", "plans_", "agents_", "messages_", "actors_")))
