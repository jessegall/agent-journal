import json

import pytest

from engine.event.event_log import EventLog
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














class MissingLinkEndpoint(StoryFixture):
    parent = ApprovedTrailPlan

    def steps(self, story):
        database = story.container.get(Database)
        row_created_at = story.clock.timestamp().text
        with database.transaction():
            database.insert(Statement("INSERT INTO links (creator_id, source_model, source_id, target_model, target_id, link_type, created_at, updated_at) VALUES (?, 'message', 2, 'doc', 999, 'mentions', ?, ?)", (story.agent.id, row_created_at, row_created_at)))




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










