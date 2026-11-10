from engine.database.database import Database
from engine.database.statement import Statement
from suites.coding.migrations.m009_prune_file_edits import PruneFileEditsMigration
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.support.story_checks import expect_value


def test_the_migration_removes_edits_under_graphify_out_and_dist_and_keeps_the_others(new_story):
    story = new_story(fixture=BuilderStarted)
    for path in ("graphify-out/graph.json", "web/dist/app.js", "src/cart.py"):
        scanned_edit(story, "s-1", path)
    database = story.container.get(Database)
    for statement in PruneFileEditsMigration.statements:
        database.update(Statement(statement))
    paths = [row["path"] for row in database.rows(Statement("SELECT path FROM file_edits"))]
    expect_value(paths, ["src/cart.py"])
