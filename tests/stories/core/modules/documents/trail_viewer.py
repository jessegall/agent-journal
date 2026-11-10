import json

import pytest

from engine.change.event_log import EventLog
from engine.database.database import Database
from engine.database.statement import Statement
from engine.enums.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from server.viewer.event_stream import EventStream
from tests.stories.core.modules.documents.upgrade import old_release_scenario
from tests.stories.core.modules.documents.support.trail_fixtures import (
    ApprovedTrailPlan,
    Scenario,
    feature,
    linked_scenario,
    scenario,
    viewer_answer,
)


def requested_read(scenario, window, arguments):
    answer = viewer_answer(scenario.story, window, arguments)
    feature(answer.code == 0, f"{window}: {arguments}: {answer.error}")
    return answer.value


def test_comment_work_and_source_open_through_viewer_routes(scenario):
    comment = scenario.comment("viewer.shell", "task", 1, "Use whole cents")
    scenario.select(comment["id"])
    scenario.command('task edit 1 --brief "Whole cents throughout"')
    scenario.expect_link(f'message:{comment["id"]}', "task:1", "edited")
    source = next(row for row in scenario.person("messages.chat", "message", "feed")["rows"] if row["id"] == comment["id"])
    scenario.story.expect_rows(source["commented_row"] == "task:1")
    scenario.story.expect_rows(scenario.person("viewer.shell", "task", "show", "1")["id"] == 1)


def test_both_directions_and_all_relations_have_one_counterpart(linked_scenario):
    scenario = linked_scenario
    scenario.command('task edit 1 --brief "message 2"')
    incoming = requested_read(scenario, "viewer.shell", ["link", "list", "--target", "task:1", "--page", "1", "--page-size", "10"])
    outgoing = requested_read(scenario, "viewer.shell", ["link", "list", "--source", "task:1", "--page", "1", "--page-size", "10"])
    feature(incoming["total"] >= 1 and outgoing["total"] >= 1, "the two directions lost their totals")
    feature(any(row["source_id"] == 2 for row in incoming["rows"]), str(incoming))
    feature(any(row["target_id"] == 2 for row in outgoing["rows"]), str(outgoing))


@pytest.mark.parametrize("row_type,number", [("task", 1), ("doc", 1)])
def test_link_and_comment_pages_are_bounded(scenario, row_type, number):
    for index in range(4):
        scenario.comment("viewer.shell", row_type, number, f"Bounded note {index}")
    first = requested_read(scenario, "viewer.shell", [row_type, "comments", str(number), "--page", "1", "--page-size", "2"])
    second = requested_read(scenario, "viewer.shell", [row_type, "comments", str(number), "--page", "2", "--page-size", "2"])
    feature(len(first["rows"]) == len(second["rows"]) == 2, "comment page did not obey the bound")
    feature(first["total"] == second["total"] == 4, "comment total lost rows")
    feature(not {row["id"] for row in first["rows"]} & {row["id"] for row in second["rows"]}, "comment pages overlap")
    links = requested_read(scenario, "viewer.shell", ["link", "list", "--target", f"{row_type}:{number}", "--page", "1", "--page-size", "2"])
    feature(len(links["rows"]) == 2 and links["total"] >= 4, "link response is unbounded")
    clamped = requested_read(scenario, "viewer.shell", [row_type, "comments", str(number), "--page-size", "999"])
    feature(clamped["page_size"] == 50, str(clamped))
    refused = viewer_answer(scenario.story, "viewer.shell", [row_type, "comments", str(number), "--page", "0"])
    feature(refused.code == 1 and bool(refused.error), "an invalid comment page became an empty success")


def test_type_filter_precedes_paging(linked_scenario):
    scenario = linked_scenario
    scenario.comment("viewer.shell", "task", 1, "A later comment")
    answer = requested_read(scenario, "viewer.shell", ["link", "list", "--target", "task:1", "--type", "comments_on", "--page", "1", "--page-size", "1"])
    feature(len(answer["rows"]) == 1 and answer["total"] == 1, "filter counted unrelated relations")
    feature(answer["rows"][0]["link_type"] == "comments_on", str(answer))


def test_plan_links_exclude_its_tasks_and_phases_before_counting_and_filtering(scenario):
    scenario.command('phase make --plan 1 "Build" --goal "Finish the cart"')
    scenario.command('phase place 1 --phase 1')
    scenario.command('task make "External work" --environment main')
    scenario.command('doc make "Second design" --abstract "Details" --body "Notes"')
    scenario.command('plan edit 1 --brief "task:1 phase:1 task:2 doc:1 doc:2"')
    scenario.story.run_listeners()
    base = ["link", "list", "--row", "plan:1", "--group-counterparts"]
    all_links = requested_read(scenario, "viewer.shell", base)
    external = requested_read(scenario, "viewer.shell", [*base, "--outside-plan", "--page-size", "1"])
    feature(external["total"] == all_links["total"] - 2, str((all_links, external)))
    feature(external["categories"].get("task") == 1 and "phase" not in external["categories"], str(external))
    documents = requested_read(scenario, "viewer.shell", [*base, "--outside-plan", "--kind", "doc", "--page-size", "1"])
    feature(documents["total"] == 2 and documents["categories"] == external["categories"], str(documents))
    feature("--outside-plan" in documents["next_command"] and "--kind doc" in documents["next_command"], str(documents))
    task_links = requested_read(scenario, "viewer.shell", ["link", "list", "--row", "task:1", "--group-counterparts"])
    feature(any(row["endpoint"]["model"] == "plan" for row in task_links["counterparts"]), str(task_links))
    refused = viewer_answer(scenario.story, "viewer.shell", ["link", "list", "--row", "task:1", "--outside-plan"])
    feature(refused.code == 1, str(refused))


def test_log_and_phase_endpoint_metadata_names_parent(scenario):
    scenario.command('task log 1 "Audit totals doc:1"')
    scenario.command('phase make --plan 1 "Audit phase doc:1" --goal "Review totals"')
    scenario.story.run_listeners()
    answer = requested_read(scenario, "viewer.shell", ["link", "list", "--target", "doc:1"])
    endpoints = {entry["source_model"]: entry["source"] for entry in answer["rows"]}
    feature(endpoints["task_log"]["title"] == "Audit totals doc:1" and endpoints["task_log"]["open_ref"] == "tasks:1", str(endpoints))
    feature(endpoints["phase"]["title"] == "Audit phase doc:1" and endpoints["phase"]["open_ref"] == "plans:1", str(endpoints))


class MissingLinkEndpoint(StoryFixture):
    parent = ApprovedTrailPlan

    def steps(self, story):
        database = story.container.get(Database)
        row_created_at = story.clock.timestamp().text
        with database.transaction():
            database.insert(Statement("INSERT INTO links (creator_id, source_model, source_id, target_model, target_id, link_type, created_at, updated_at) VALUES (?, 'message', 2, 'doc', 999, 'mentions', ?, ?)", (story.agent.id, row_created_at, row_created_at)))


def test_missing_endpoints_return_unavailable_metadata(new_story):
    scenario = Scenario(new_story(fixture=MissingLinkEndpoint))
    answer = requested_read(scenario, "viewer.shell", ["link", "list", "--source", "message:2"])
    missing = next(entry["target"] for entry in answer["rows"] if entry["target_id"] == 999)
    feature(not missing["exists"] and missing["open_ref"] is None and "unavailable" in missing["title"], str(missing))


def test_receipt_refresh_targets_only_changed_sources(linked_scenario):
    log = linked_scenario.story.container.get(EventLog)
    events = [event for event in log.events_after(0) if event.event == "link.create"]
    linked_scenario.story.expect_rows(events, detail="fixture did not create an actual link event")
    value = json.loads(EventStream.message(events[-1], "main").split("data: ", 1)[1])
    feature("source_model" in value and "source_id" in value, f"receipt cannot identify its event source: {value}")
    feature(value["source_model"] == events[-1].data["source_model"][1], str(value))
    link_event = next(event for event in events if event.data.get("link_type", (None, None))[1] == "about" and event.data.get("source_model", (None, None))[1] == "message")
    cursor = log.newest_id()
    requested_read(linked_scenario, "viewer.shell", ["link", "remove", str(link_event.row_id)])
    deleted = next(event for event in log.events_after(cursor) if event.event == "link.delete")
    removed = json.loads(EventStream.message(deleted, "main").split("data: ", 1)[1])
    feature(removed["source_model"] == "message" and removed["source_id"] == link_event.data["source_id"][1], str(removed))


def test_task_inspector_can_read_its_link_page(scenario):
    scenario.comment("viewer.shell", "task", 1, "A task-window comment")
    answer = requested_read(scenario, "tasks.tasks", ["link", "list", "--target", "task:1", "--page", "1", "--page-size", "10"])
    feature(any(row["source_model"] == "message" for row in answer["rows"]), str(answer))


def test_deleting_the_selected_message_clears_its_source(scenario):
    scenario.person("messages.chat", "message", "send", "Remove this request")
    scenario.switch(3)
    scenario.person("messages.chat", "message", "delete", "3")
    feature(scenario.source_ids(scenario.story.agent.id) == (), "viewer deletion left a selected message")
    scenario.make_task()
    scenario.expect_no_link("message:3", "task:2")


def test_migrated_comment_opens_original_target(old_release_scenario):
    scenario = old_release_scenario
    message = next(row for row in scenario.person("messages.chat", "message", "feed")["rows"] if row["id"] == 1)
    feature(message.get("commented_row") == "doc:1", str(message))
    scenario.story.expect_rows(scenario.person("viewer.shell", "doc", "show", "1")["id"] == 1)


def test_plan_start_pointer_is_read_before_work(new_story):
    scenario = Scenario(new_story(fixture=ApprovedTrailPlan))
    scenario.person("viewer.shell", "plan", "start", "1")
    scenario.tick()
    notice = "\n".join(scenario.story.hook("s-1", HookSamples.tool_use("Read", ToolType.READ, [], None)).lines)
    feature("plan 1 started" in notice, notice)
    context = scenario.context("plan")
    feature("messages" in context, str(context))


def test_refused_comment_does_not_write_a_message(scenario):
    initial_feed = scenario.person("messages.chat", "message", "feed")["rows"]
    answer = viewer_answer(scenario.story, "messages.chat", ["task", "comment", "999", "Keep my unsent draft"])
    scenario.story.expect_rows(answer.code == 1)
    after = scenario.person("messages.chat", "message", "feed")["rows"]
    scenario.story.expect_rows(after == initial_feed)
