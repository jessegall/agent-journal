import json
import sqlite3
import pytest
from unittest.mock import patch

from engine.upgrade.move_runner import MoveRunner
from engine.upgrade.move_map import MoveMap
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.errors.upgrade_failed_error import UpgradeFailedError
from engine.database.database import Database
from engine.database.row_insert import RowInsert
from engine.database.moved_row import MovedRow
from engine.module.move_check import MoveCheck
from engine.module.module_finder import ModuleFinder
from engine.registry.registry import Registry
from engine.time.timestamp import Timestamp
from core.modules.documents.documents_module import DocumentsModule
from core.modules.documents.upgrade.documents_move import DocumentsMove
from core.modules.questions.questions_module import QuestionsModule
from core.modules.questions.upgrade.questions_move import QuestionsMove
from core.modules.questions.upgrade.question_links_move import QuestionLinksMove
from tests.stories.core.modules.documents.support.trail_fixtures import Scenario, feature

from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story


def insert_scenario_links(folder):
    with sqlite3.connect(folder / "journal.db") as database:
        database.executemany("INSERT INTO links (source, target, link_type, creator, created_at, updated_at) VALUES (?, ?, ?, 'user:1', '2026-10-01T10:00:00+00:00', '2026-10-02T10:00:00+00:00')",
                             [("messages:1", "tasks:1", "about"), ("messages:1", "tasks:1", "edited"),
                              ("messages:1", "tasks:1", "comments_on"), ("messages:1", "messages:2", "refers_to"),
                              ("questions:1", "messages:1", "about"), ("messages:1", "plans:1", "about"),
                              ("messages:1", "tasks:99999", "mentions"), ("messages:1", "tasks:1", "about"),
                              ("messages:1", "tasks:1", "old_unknown_relation"),
                              ("messages:3", "tasks:1", "about"), ("messages:1", "agents:1", "sent_to")])


@pytest.fixture
def historical_scenario(new_story):
    return Scenario(upgraded_story(new_story, prepare=insert_scenario_links))


@pytest.fixture
def old_release_scenario(new_story):
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
            source_table, source_number = link["source"].split(":")
            target_table, target_number = link["target"].split(":")
            new_source_id, new_target_id = mapping.new_id(source_table, int(source_number)), mapping.new_id(target_table, int(target_number))
            if new_source_id is None or new_target_id is None:
                continue
            new_id = rows.insert("links", {"creator_id": creators.actor_id(link["creator"]), "source_model": models[source_table], "source_id": new_source_id,
                                          "target_model": models[target_table], "target_id": new_target_id, "link_type": link["link_type"],
                                          "created_at": link["created_at"], "updated_at": link["updated_at"] or link["created_at"]})
            mapping.record(MovedRow("links", link["id"], "links", new_id))
        counts = mapping.finished(DocumentsModule.name, DocumentsMove.name)
        counts["moved"]["links"] = 3
        mapping.finish(DocumentsModule.name, DocumentsMove.name, counts)
    return Scenario(story)




def test_historical_refers_to_keeps_its_distinct_type(historical_scenario):
    scenario = historical_scenario
    rows = scenario.links("message:1")
    relations = {row["link_type"] for row in rows if row["target_model"] == "message" and row["target_id"] == 2}
    feature("refers_to" in relations and "mentions" not in relations, "explicit refers_to was lost or relabelled as a mention")




def test_migrated_task_overview_reads_original_conversation(historical_scenario):
    scenario = historical_scenario
    outcome = scenario.story.run("task overview 1")
    scenario.story.expect_rows(outcome.code == 0, detail=outcome.output_text)
    feature("Ship the cart today" in outcome.output_text and "Shipping it" in outcome.output_text, outcome.output_text)










def test_recovery_declares_direct_dependencies_without_a_second_links_claim(historical_scenario):
    modules = ModuleFinder(historical_scenario.story.home).modules()
    historical_scenario.story.expect_rows(MoveCheck().problems(modules) == ())
    claims = [module.name for module in modules for move in module.moves if "links" in (*move.reads, *move.drops)]
    historical_scenario.story.expect_rows(claims == ["journal.core.tasks"])


