from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.drivers.migrations.m019_hook_change_names import HookChangeNamesMigration
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

COMPACTION = HookSamples.sample("compact")


def test_a_compaction_logged_under_the_old_name_is_handled_once_after_the_rename(new_story):
    story = new_story(fixture=BuilderStarted)
    memory = story.new_row_id('memory make "The cart total is in cents" --environment main', actor=story.agent)
    story.hook("s-1", COMPACTION)
    database = story.container.get(Database)
    database.update(Statement("UPDATE events SET name = 'hook_call.create' WHERE name = 'hook_call.compact'"))
    HookChangeNamesMigration().run(database)
    story.run_listeners()
    story.expect_success(f"memory show {memory}", "weight: 4")
    story.run_listeners()
    story.expect_success(f"memory show {memory}", "weight: 4")
