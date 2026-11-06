import json
import sqlite3
import pytest
from unittest.mock import patch

from core.base.upgrade.move_runner import MoveRunner
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.upgrade_failed_error import UpgradeFailedError
from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.database.moved_row import MovedRow
from core.base.module.move_check import MoveCheck
from core.base.module.module_finder import ModuleFinder
from core.base.registry.registry import Registry
from core.modules.documents.documents_module import DocumentsModule
from core.modules.documents.upgrade.documents_move import DocumentsMove
from core.modules.questions.questions_module import QuestionsModule
from core.modules.questions.upgrade.questions_move import QuestionsMove
from core.modules.questions.upgrade.question_links_move import QuestionLinksMove
from install.upgrade_journal import UpgradeJournal
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
                              ("messages:1", "tasks:1", "old_unknown_relation"),
                              ("messages:3", "tasks:1", "about"), ("messages:1", "agents:1", "sent_to")])


@pytest.fixture
def historical_trail(new_story):
    return Trail(upgraded_story(new_story, prepare=add_trail_links))


@pytest.fixture
def old_release_trail(new_story):
    with patch.object(DocumentsModule, "moves", [DocumentsMove]), patch.object(QuestionsModule, "moves", [QuestionsMove]):
        story = upgraded_story(new_story)
    code, output = story.synced()
    assert code == 0, output
    mapping, target = story.container.get(MoveMap), story.container.get(Database)
    source = next((story.home.folder / "version-4").glob("*/journal.db"))
    with VersionFourSource(source) as old, target.transaction():
        creators, rows = CreatorResolver(target, mapping), RowInsert(target)
        models = {"messages": "message", "docs": "doc", "reports": "report", "tasks": "task"}
        for link in old.links("about", "mentions", "comments_on"):
            if not any(link[end].partition(":")[0] in ("docs", "reports") for end in ("source", "target")):
                continue
            left_table, left_number = link["source"].split(":")
            right_table, right_number = link["target"].split(":")
            left, right = mapping.new_id(left_table, int(left_number)), mapping.new_id(right_table, int(right_number))
            if left is None or right is None:
                continue
            new_id = rows.insert("links", {"creator_id": creators.actor_id(link["creator"]), "source_model": models[left_table], "source_id": left,
                                          "target_model": models[right_table], "target_id": right, "link_type": link["link_type"],
                                          "created_at": link["created_at"], "updated_at": link["updated_at"] or link["created_at"]})
            mapping.record(MovedRow("links", link["id"], "links", new_id))
        counts = mapping.finished(DocumentsModule.name, DocumentsMove.name)
        counts["moved"]["links"] = 3
        mapping.finish(DocumentsModule.name, DocumentsMove.name, counts)
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
    reply = trail.person("viewer.shell", "message", "show", "2")
    assert reply["parent_id"] == 1 and reply["text"] == "Shipping it"


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
    assert "handled elsewhere" in trail.story.upgrade_text
    assert "depends" in trail.story.upgrade_text and "revision_of" in trail.story.upgrade_text


@pending(6853)
def test_recovery_after_finished_documents_move(old_release_trail):
    trail = old_release_trail
    source = next((trail.story.home.folder / "version-4").glob("*/journal.db"))
    mapping = trail.story.container.get(MoveMap)
    before = mapping.finished(DocumentsModule.name, DocumentsMove.name)
    trail.story.expect_success('doc edit 1 --body "A later edit stays"')
    with sqlite3.connect(source) as database:
        database.execute("INSERT INTO links (source, target, link_type, creator, created_at) VALUES ('messages:1', 'tasks:1', 'edited', 'user:1', '2026-10-01T10:00:00+00:00')")
    outcome = trail.story.container.get(MoveRunner).run(source)
    trail.expect_link("message:1", "task:1", "edited")
    feature(outcome.moved["journal.core.documents"] >= 1, "completed old move prevented recovery of retained links")
    assert mapping.finished(DocumentsModule.name, DocumentsMove.name) == before
    trail.story.expect_text("doc show 1 --all", "A later edit stays")


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


def test_recovery_reuses_an_unmapped_partial_copy_without_overwriting_it(old_release_trail):
    trail = old_release_trail
    source = next((trail.story.home.folder / "version-4").glob("*/journal.db"))
    with sqlite3.connect(source) as database:
        old_id = database.execute("INSERT INTO links (source, target, link_type, creator, created_at) VALUES ('messages:1', 'tasks:1', 'edited', 'user:1', '2026-10-01T10:00:00+00:00')").lastrowid
    target = trail.story.container.get(Database)
    with target.transaction():
        copied_id = RowInsert(target).insert("links", {"creator_id": 1, "source_model": "message", "source_id": 1,
                                                      "target_model": "task", "target_id": 1, "link_type": "edited",
                                                      "created_at": "2026-09-01T00:00:00+00:00", "updated_at": "2026-09-02T00:00:00+00:00"})
    trail.story.container.get(MoveRunner).run(source)
    rows = [row for row in trail.links("message:1") if row["link_type"] == "edited"]
    assert len(rows) == 1 and rows[0]["id"] == copied_id and rows[0]["updated_at"] == "2026-09-02T00:00:00+00:00"
    assert trail.story.container.get(MoveMap).new_id("links", old_id) == copied_id


def test_question_recovery_rolls_back_alone_and_retries_after_the_documents_pass(old_release_trail, monkeypatch):
    trail = old_release_trail
    source = next((trail.story.home.folder / "version-4").glob("*/journal.db"))
    with sqlite3.connect(source) as database:
        database.execute("INSERT INTO links (source, target, link_type, creator, created_at) VALUES ('questions:1', 'messages:1', 'about', 'user:1', '2026-10-01T10:00:00+00:00')")
    move = QuestionLinksMove.move

    def interrupted(self, *arguments):
        move(self, *arguments)
        raise RuntimeError("question recovery interrupted")

    monkeypatch.setattr(QuestionLinksMove, "move", interrupted)
    with pytest.raises(UpgradeFailedError, match="question recovery interrupted") as failure:
        trail.story.container.get(MoveRunner).run(source)
    assert len(failure.value.finished) == len(set(failure.value.finished))
    mapping = trail.story.container.get(MoveMap)
    assert mapping.finished(QuestionsModule.name, QuestionLinksMove.name) is None
    assert mapping.finished(DocumentsModule.name, "message-links-v1") is not None
    trail.expect_no_link("question:1", "message:1")
    monkeypatch.undo()
    trail.story.container.get(MoveRunner).run(source)
    trail.expect_link("question:1", "message:1", "about")


def test_recovery_uses_the_existing_upgrade_entry_with_retained_source(old_release_trail):
    trail = old_release_trail
    source = trail.story.home.folder / "version-4" / "journal.db"
    with sqlite3.connect(source) as database:
        database.execute("INSERT INTO links (source, target, link_type, creator, created_at) VALUES ('messages:1', 'tasks:1', 'edited', 'user:1', '2026-10-01T10:00:00+00:00')")
    outcome = UpgradeJournal(trail.story.home).run(confirmed=True)
    assert outcome.code == 0, outcome.text
    trail.expect_link("message:1", "task:1", "edited")
    assert UpgradeJournal(trail.story.home).run(confirmed=True).text == "nothing left to move"


def test_a_message_converted_to_a_card_is_not_used_as_a_message_endpoint(historical_trail):
    assert "maps to chat_marks" in historical_trail.story.upgrade_text
    historical_trail.expect_no_link("message:3", "task:1")
    historical_trail.expect_link("message:1", "agent:1", "sent_to")


def test_recovery_declares_direct_dependencies_without_a_second_links_claim(historical_trail):
    modules = ModuleFinder(historical_trail.story.home).modules()
    assert MoveCheck().problems(modules) == ()
    claims = [module.name for module in modules for move in module.moves if "links" in (*move.reads, *move.drops)]
    assert claims == ["journal.core.tasks"]


def test_fresh_module_counts_include_both_text_and_link_moves(new_story, monkeypatch):
    run, outcomes = MoveRunner.run, []
    documents = DocumentsMove.move

    def with_dropped_rows(self, *arguments):
        result = documents(self, *arguments)
        result.drop("test document rows", 2)
        return result

    def recorded(self, *arguments, **keywords):
        result = run(self, *arguments, **keywords)
        outcomes.append(result)
        return result

    monkeypatch.setattr(MoveRunner, "run", recorded)
    monkeypatch.setattr(DocumentsMove, "move", with_dropped_rows)
    story = upgraded_story(new_story, prepare=add_trail_links)
    mapping = story.container.get(MoveMap)
    entries = [entry for entry in story.container.get(Registry).moves if entry.module == DocumentsModule.name]
    expected = sum(sum(mapping.finished(entry.module, entry.path.checked_class(VersionFourMove).name)["moved"].values()) for entry in entries)
    assert outcomes[-1].moved[DocumentsModule.name] == expected and expected > 3
    assert outcomes[-1].module_tables[DocumentsModule.name]["test document rows"] == 2
    dropped = sum(sum(mapping.finished(entry.module, entry.path.checked_class(VersionFourMove).name)["dropped"].values()) for entry in entries)
    assert outcomes[-1].dropped[DocumentsModule.name] == dropped and dropped > 2
