import pytest

from core.base.change.event_pattern_error import EventPatternError
from server.viewer.events_request import EventsRequest


def test_an_omitted_filter_keeps_legacy_streams_unfiltered():
    request = EventsRequest.parsed({"environment": ["main"]}, None)
    assert request.matches("hook_call.prompt")
    assert request.patterns is None


def test_repeated_follow_parameters_match_only_their_events():
    request = EventsRequest.parsed({"follow": ["task.*", "message.create"]}, None)
    assert request.matches("task.start")
    assert request.matches("message.create")
    assert not request.matches("hook_call.prompt")


def test_an_explicit_empty_filter_matches_nothing():
    request = EventsRequest.parsed({"follow": [""]}, None)
    assert not request.matches("task.create")
    assert request.patterns == ()


def test_the_browser_resume_id_takes_precedence_over_the_query_cursor():
    request = EventsRequest.parsed({"cursor": ["12"], "follow": ["task.*"]}, "14")
    assert request.cursor_id == 14


def test_an_invalid_pattern_is_rejected_at_the_request_boundary():
    with pytest.raises(EventPatternError):
        EventsRequest.parsed({"follow": ["wrong"]}, None)
