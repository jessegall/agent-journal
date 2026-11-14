import json
from types import MappingProxyType

from engine.event.logged_event import LoggedEvent
from engine.time.timestamp import Timestamp
from server.viewer.event_stream import EventStream


def read_message(data):
    event = LoggedEvent(id=1, event="dump_item.create", row_table="dump_items", row_id=3, environment_id=1, actor_id=2, command="", cause_id=None,
                        skipped_guards=frozenset(), timestamp=Timestamp.parsed("2026-11-08T09:00:00.000000+00:00"), data=MappingProxyType(data))
    return json.loads(EventStream.message(event, "main").split("data: ")[1])


def test_a_viewer_event_names_the_ids_its_row_changed_so_a_dock_can_tell_whose_child_it_is():
    message = read_message({"dump_id": (None, 5), "text": (None, "Buy milk"), "phase_id": (4, 6)})
    assert message["changed_ids"] == {"dump_id": [5], "phase_id": [4, 6]}
    assert message["row_id"] == 3
