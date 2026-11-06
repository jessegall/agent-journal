import json

import pytest

from core.base.change.event_log import EventLog
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from server.viewer.event_stream import EventStream
from tests.stories.core.modules.documents.upgrade import old_release_trail
from tests.stories.core.modules.documents.support.trail_fixtures import (
    ApprovedTrailPlan,
    Trail,
    feature,
    linked_trail,
    pending,
    trail,
    viewer_answer,
)


def requested_read(trail, window, words):
    answer = viewer_answer(trail.story, window, words)
    feature(answer.code == 0, f"{window}: {words}: {answer.error}")
    return answer.value


def test_comment_work_and_source_open_through_viewer_routes(trail):
    comment = trail.comment("viewer.shell", "task", 1, "Use whole cents")
    trail.select(comment["id"])
    trail.command('task edit 1 --brief "Whole cents throughout"')
    trail.expect_link(f'message:{comment["id"]}', "task:1", "edited")
    source = next(row for row in trail.person("messages.chat", "message", "feed")["rows"] if row["id"] == comment["id"])
    assert source["commented_row"] == "task:1"
    assert trail.person("viewer.shell", "task", "show", "1")["id"] == 1


@pending(6852)
def test_both_directions_and_all_relations_have_one_counterpart(linked_trail):
    trail = linked_trail
    trail.command('task edit 1 --brief "message 2"')
    incoming = requested_read(trail, "viewer.shell", ["link", "list", "--target", "task:1", "--page", "1", "--page-size", "10"])
    outgoing = requested_read(trail, "viewer.shell", ["link", "list", "--source", "task:1", "--page", "1", "--page-size", "10"])
    feature(incoming["total"] >= 1 and outgoing["total"] >= 1, "the two directions lost their totals")
    feature(any(row["source_id"] == 2 for row in incoming["rows"]), str(incoming))
    feature(any(row["target_id"] == 2 for row in outgoing["rows"]), str(outgoing))


@pytest.mark.parametrize("noun,number", [("task", 1), ("doc", 1)])
@pending(6852)
def test_link_and_comment_pages_are_bounded(trail, noun, number):
    for index in range(4):
        trail.comment("viewer.shell", noun, number, f"Bounded note {index}")
    first = requested_read(trail, "viewer.shell", [noun, "comments", str(number), "--page", "1", "--page-size", "2"])
    second = requested_read(trail, "viewer.shell", [noun, "comments", str(number), "--page", "2", "--page-size", "2"])
    feature(len(first["rows"]) == len(second["rows"]) == 2, "comment page did not obey the bound")
    feature(first["total"] == second["total"] == 4, "comment total lost rows")
    feature(not {row["id"] for row in first["rows"]} & {row["id"] for row in second["rows"]}, "comment pages overlap")
    links = requested_read(trail, "viewer.shell", ["link", "list", "--target", f"{noun}:{number}", "--page", "1", "--page-size", "2"])
    feature(len(links["rows"]) == 2 and links["total"] >= 4, "link response is unbounded")
    clamped = requested_read(trail, "viewer.shell", [noun, "comments", str(number), "--page-size", "999"])
    feature(clamped["page_size"] == 50, str(clamped))
    refused = viewer_answer(trail.story, "viewer.shell", [noun, "comments", str(number), "--page", "0"])
    feature(refused.code == 1 and bool(refused.error), "an invalid comment page became an empty success")


@pending(6852)
def test_type_filter_precedes_paging(linked_trail):
    trail = linked_trail
    trail.comment("viewer.shell", "task", 1, "A later comment")
    answer = requested_read(trail, "viewer.shell", ["link", "list", "--target", "task:1", "--type", "comments_on", "--page", "1", "--page-size", "1"])
    feature(len(answer["rows"]) == 1 and answer["total"] == 1, "filter counted unrelated relations")
    feature(answer["rows"][0]["link_type"] == "comments_on", str(answer))


@pending(6852)
def test_counterpart_pages_keep_all_relation_types_once(linked_trail):
    trail = linked_trail
    trail.command('task edit 1 --brief "message:2 and doc:1"')
    trail.story.run_listeners()
    words = ["link", "list", "--row", "task:1", "--group-counterparts", "--page-size", "1"]
    first = requested_read(trail, "viewer.shell", words)
    pages = [first, *(requested_read(trail, "viewer.shell", [*words, "--page", str(page)]) for page in range(2, first["total"] + 1))]
    counterparts = [entry for page in pages for entry in page["counterparts"]]
    keys = [(entry["endpoint"]["model"], entry["endpoint"]["id"]) for entry in counterparts]
    feature(len(keys) == len(set(keys)) == first["total"], str(pages))
    message = next(entry for entry in counterparts if entry["endpoint"]["model"] == "message" and entry["endpoint"]["id"] == 2)
    feature({"about", "edited", "mentions"} <= set(message["relations"]), str(message))


@pending(6852)
def test_counterpart_priority_survives_page_boundaries(linked_trail):
    trail = linked_trail
    trail.command('task edit 1 --brief "The design is doc:1"')
    trail.story.run_listeners()
    words = ["link", "list", "--row", "task:1", "--group-counterparts", "--first-counterpart", "doc:1", "--page-size", "1"]
    first = requested_read(trail, "viewer.shell", words)
    feature(first["counterparts"][0]["endpoint"]["model"] == "doc", str(first))
    rest = [requested_read(trail, "viewer.shell", [*words, "--page", str(number)]) for number in range(2, first["total"] + 1)]
    keys = [(entry["endpoint"]["model"], entry["endpoint"]["id"]) for page in [first, *rest] for entry in page["counterparts"]]
    feature(len(keys) == len(set(keys)) == first["total"], str(keys))


@pending(6852)
def test_log_and_phase_endpoint_metadata_names_parent(trail):
    trail.command('task log 1 "Audit totals doc:1"')
    trail.command('phase make --plan 1 "Audit phase doc:1" --goal "Review totals"')
    trail.story.run_listeners()
    answer = requested_read(trail, "viewer.shell", ["link", "list", "--target", "doc:1"])
    endpoints = {entry["source_model"]: entry["source"] for entry in answer["rows"]}
    feature(endpoints["task_log"]["title"] == "Audit totals doc:1" and endpoints["task_log"]["open_ref"] == "tasks:1", str(endpoints))
    feature(endpoints["phase"]["title"] == "Audit phase doc:1" and endpoints["phase"]["open_ref"] == "plans:1", str(endpoints))


class MissingLinkEndpoint(StoryFixture):
    parent = ApprovedTrailPlan

    def steps(self, story):
        database = story.container.get(Database)
        now = story.clock.timestamp().text
        with database.transaction():
            database.insert(Statement("INSERT INTO links (creator_id, source_model, source_id, target_model, target_id, link_type, created_at, updated_at) VALUES (?, 'message', 2, 'doc', 999, 'mentions', ?, ?)", (story.agent.id, now, now)))


@pending(6852)
def test_missing_endpoints_return_unavailable_metadata(new_story):
    trail = Trail(new_story(fixture=MissingLinkEndpoint))
    answer = requested_read(trail, "viewer.shell", ["link", "list", "--source", "message:2"])
    missing = next(entry["target"] for entry in answer["rows"] if entry["target_id"] == 999)
    feature(not missing["exists"] and missing["open_ref"] is None and "unavailable" in missing["title"], str(missing))


@pending(6895)
def test_receipt_refresh_targets_only_changed_sources(linked_trail):
    log = linked_trail.story.container.get(EventLog)
    events = [event for event in log.events_past(0) if event.event == "link.create"]
    assert events, "fixture did not create an actual link event"
    value = json.loads(EventStream.message(events[-1], "main").split("data: ", 1)[1])
    feature("source_model" in value and "source_id" in value, f"receipt cannot identify its event source: {value}")
    feature(value["source_model"] == events[-1].data["source_model"][1], str(value))
    about = next(event for event in events if event.data.get("link_type", (None, None))[1] == "about" and event.data.get("source_model", (None, None))[1] == "message")
    cursor = log.newest_id()
    requested_read(linked_trail, "viewer.shell", ["link", "remove", str(about.row_id)])
    deleted = next(event for event in log.events_past(cursor) if event.event == "link.delete")
    removed = json.loads(EventStream.message(deleted, "main").split("data: ", 1)[1])
    feature(removed["source_model"] == "message" and removed["source_id"] == about.data["source_id"][1], str(removed))


@pending(6852)
def test_task_inspector_can_read_its_link_page(trail):
    trail.comment("viewer.shell", "task", 1, "A task-window comment")
    answer = requested_read(trail, "tasks.tasks", ["link", "list", "--target", "task:1", "--page", "1", "--page-size", "10"])
    feature(any(row["source_model"] == "message" for row in answer["rows"]), str(answer))


def test_deleting_the_selected_message_clears_its_source(trail):
    trail.person("messages.chat", "message", "send", "Remove this request")
    trail.switch(3)
    trail.person("messages.chat", "message", "delete", "3")
    feature(trail.source_ids(trail.story.agent.id) == (), "viewer deletion left a selected message")
    trail.make_task()
    trail.expect_no_link("message:3", "task:2")


@pending(6853)
def test_migrated_comment_opens_original_target(old_release_trail):
    trail = old_release_trail
    message = next(row for row in trail.person("messages.chat", "message", "feed")["rows"] if row["id"] == 1)
    feature(message.get("commented_row") == "doc:1", str(message))
    assert trail.person("viewer.shell", "doc", "show", "1")["id"] == 1


def test_plan_start_pointer_is_read_before_work(new_story):
    trail = Trail(new_story(fixture=ApprovedTrailPlan))
    trail.person("viewer.shell", "plan", "start", "1")
    trail.tick()
    notice = "\n".join(trail.story.hook("s-1", HookSamples.tool_use("Read", ToolType.READ, [], None)).lines)
    feature("plan context 1" in notice, notice)
    context = trail.context("plan")
    feature("messages" in context, str(context))


def test_link_removal_does_not_reappear_on_retry(linked_trail):
    trail = linked_trail
    edge = next(row for row in trail.links("message:2") if row["link_type"] == "about")
    words = ["link", "remove", str(edge["id"])]
    requested_read(trail, "viewer.shell", words)
    requested_read(trail, "viewer.shell", words)
    trail.story.run_listeners()
    trail.expect_no_link("message:2", "task:1")


def test_refused_comment_does_not_write_a_message(trail):
    before = trail.person("messages.chat", "message", "feed")["rows"]
    answer = viewer_answer(trail.story, "messages.chat", ["task", "comment", "999", "Keep my unsent draft"])
    assert answer.code == 1
    after = trail.person("messages.chat", "message", "feed")["rows"]
    assert after == before
