from engine.database.database import Database
from engine.database.statement import Statement
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.support.story_checks import expect_value

RECORD_HANDLER = "suites.coding.commands.record_file_edit.record_file_edit_handler"
EDITS_MADE = 60
EDITS_PRUNED = 30
LINK_STATEMENT = ("INSERT INTO links (creator_id, source_model, source_id, target_model, target_id, link_type, version, metadata, created_at, updated_at)"
                  " SELECT creator_id, 'task', id, 'file_edit', id, 'edited', 1, '{}', created_at, updated_at FROM file_edits WHERE id > 1 ORDER BY id LIMIT ?")


def test_pruning_many_file_edits_that_have_links_removes_their_links_in_one_request(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    for number in range(EDITS_MADE):
        scanned_edit(story, "s-1", f"src/part{number}.py")
    database = story.container.get(Database)
    database.update(Statement(LINK_STATEMENT, (EDITS_PRUNED,)))
    monkeypatch.setattr(f"{RECORD_HANDLER}.ROWS_KEPT", EDITS_PRUNED)
    scanned_edit(story, "s-1", "src/last.py")
    expect_value(database.rows(Statement("SELECT count(*) AS total FROM file_edits"))[0]["total"], EDITS_MADE + 1 - EDITS_PRUNED)
    expect_value(database.rows(Statement("SELECT count(*) AS total FROM links WHERE target_model = 'file_edit'"))[0]["total"], 0)
