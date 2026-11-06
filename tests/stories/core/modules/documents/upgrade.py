import json
import sqlite3
import pytest
from unittest.mock import patch

from core.base.upgrade.move_runner import MoveRunner
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.registry.registry import Registry
from core.modules.documents.documents_module import DocumentsModule
from core.modules.documents.upgrade.documents_move import DocumentsMove
from core.modules.questions.questions_module import QuestionsModule
from core.modules.questions.upgrade.questions_move import QuestionsMove
from tests.stories.core.modules.documents.support.trail_fixtures import Trail, feature, pending

from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text


def test_a_version_4_document_keeps_its_number_title_abstract_and_text_in_the_project_library(new_story):
    story = upgraded_story(new_story)
    story.expect_text("doc show 1 --all", "in cents, see task 1")
    story.expect_text("doc show 1 --json", '"title": "Cart rules"', '"abstract": "How the cart counts"')
    story.run("doc show 1 --json").expect_no_text('environment_id')


def test_a_document_signed_off_in_version_4_is_closed_with_its_reason_and_one_with_no_text_moves_empty(new_story):
    story = upgraded_story(new_story)
    story.expect_text("doc show 2 --json", '"close_reason": "kept for reference"', '"body": ""')


def test_a_documents_revisions_move_with_their_numbers_through_their_revision_of_links(new_story):
    story = upgraded_story(new_story)
    story.expect_text("doc revisions 1", "1", "written")
    rows = json.loads(story.run('doc revisions 1 --json').output_text)['rows']
    story.expect_rows(rows[0]['author_id'] == rows[0]['creator_id'], bool(rows[0]['body']))


def test_a_report_moves_with_the_rows_it_is_about_and_a_document_keeps_its_mentions_and_comments(new_story):
    story = upgraded_story(new_story)
    story.expect_text("report show 1", "report 1: Cart review")
    story.expect_text("link list --source report:1", "about  task:1")
    story.expect_text("link list --source doc:1", "mentions  task:1")
    story.expect_text("doc comments 1", "message 1:")


def test_links_to_a_row_that_did_not_move_are_counted(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "dropped links to a row that did not move: 1 rows")


def add_trail_links(folder):
    with sqlite3.connect(folder / "journal.db") as database:
        database.executemany("INSERT INTO links (source, target, link_type, creator, created_at, updated_at) VALUES (?, ?, ?, 'user:1', '2026-10-01T10:00:00+00:00', '2026-10-02T10:00:00+00:00')",
                             [("messages:1", "tasks:1", "about"), ("messages:1", "tasks:1", "edited"),
                              ("messages:1", "tasks:1", "comments_on"), ("messages:1", "messages:2", "refers_to"),
                              ("questions:1", "messages:1", "about"), ("messages:1", "plans:1", "about"),
                              ("messages:1", "tasks:99999", "mentions"), ("messages:1", "tasks:1", "about"),
                              ("messages:1", "tasks:1", "old_unknown_relation")])


@pytest.fixture
def historical_trail(new_story):
    return Trail(upgraded_story(new_story, prepare=add_trail_links))


@pytest.fixture
def old_release_trail(new_story):
    with patch.object(DocumentsModule, "moves", [DocumentsMove]), patch.object(QuestionsModule, "moves", [QuestionsMove]):
        story = upgraded_story(new_story)
    code, output = story.synced()
    assert code == 0, output
    return Trail(story)


@pending(6853)
def test_message_work_links_move_without_document_endpoint(historical_trail):
    trail = historical_trail
    rows = trail.links("message:1")
    subjects = {(row["target_model"], row["target_id"]) for row in rows if row["link_type"] == "about"}
    feature({("task", 1), ("plan", 1)} <= subjects, json.dumps(rows))


@pending(6853)
def test_old_edited_and_comment_links_keep_creator_and_timestamps(historical_trail):
    trail = historical_trail
    rows = trail.links("message:1")
    restored = [row for row in rows if row["target_model"] == "task" and row["target_id"] == 1]
    feature({row["link_type"] for row in restored} >= {"about", "edited", "comments_on"}, json.dumps(restored))
    feature(all(row["created_at"] == "2026-10-01T10:00:00+00:00" and row["updated_at"] == "2026-10-02T10:00:00+00:00" for row in restored), json.dumps(restored))
    feature(len({row["creator_id"] for row in restored}) == 1, "migration changed creators across relations")


@pending(6853)
def test_historical_refers_to_keeps_its_distinct_type(historical_trail):
    trail = historical_trail
    rows = trail.links("message:1")
    relations = {row["link_type"] for row in rows if row["target_model"] == "message" and row["target_id"] == 2}
    feature("refers_to" in relations and "mentions" not in relations, "explicit refers_to was lost or relabelled as a mention")


@pending(6853)
def test_question_links_move_after_question_ids(historical_trail):
    trail = historical_trail
    trail.expect_link("question:1", "message:1", "about")


@pending(6853)
def test_retry_duplicate_unmapped_and_other_domain_links_are_accounted_for(historical_trail):
    trail = historical_trail
    trail.expect_link("message:1", "task:1", "about")
    feature("old_unknown_relation" in trail.story.upgrade_text, trail.story.upgrade_text)
    feature("99999" in trail.story.upgrade_text, trail.story.upgrade_text)
    feature("duplicate" in trail.story.upgrade_text.lower(), trail.story.upgrade_text)


@pending(6853)
def test_recovery_after_finished_documents_move(old_release_trail):
    trail = old_release_trail
    source = next((trail.story.home.folder / "version-4").glob("*/journal.db"))
    with sqlite3.connect(source) as database:
        database.execute("INSERT INTO links (source, target, link_type, creator, created_at) VALUES ('messages:1', 'tasks:1', 'edited', 'user:1', '2026-10-01T10:00:00+00:00')")
    outcome = trail.story.container.get(MoveRunner).run(source)
    trail.expect_link("message:1", "task:1", "edited")
    feature(outcome.moved["journal.core.documents"] >= 1, "completed old move prevented recovery of retained links")


@pending(6853)
def test_migrated_task_overview_reads_original_conversation(historical_trail):
    trail = historical_trail
    result = trail.story.run("task overview 1")
    assert result.code == 0, result.output_text
    feature("Ship the cart today" in result.output_text and "Shipping it" in result.output_text, result.output_text)


@pending(6853)
def test_multiple_moves_of_one_module_keep_all_counts(historical_trail):
    story = historical_trail.story
    entries = [entry for entry in story.container.get(Registry).moves if entry.module == DocumentsModule.name]
    feature(len(entries) >= 2, "historical recovery has no independent completion identity")
    mapping = story.container.get(MoveMap)
    names = [entry.path.checked_class(VersionFourMove).name for entry in entries]
    completions = [mapping.finished(DocumentsModule.name, name) for name in names]
    feature(all(completion is not None for completion in completions), "one recovery pass has no completion record")
    expected = sum(sum(completion["moved"].values()) + sum(completion["repeated"].values()) for completion in completions)
    source = next((story.home.folder / "version-4").glob("*/journal.db"))
    repeated = story.container.get(MoveRunner).run(source)
    feature(repeated.repeated[DocumentsModule.name] == expected, f"module totals overwrite earlier passes: {repeated.repeated}, expected {expected}")
