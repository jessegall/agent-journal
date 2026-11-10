import pytest

from engine.viewer.window_key import WindowKey


@pytest.mark.parametrize("state,expected", [({}, []), ({"numbers.costliest": "false"}, []), ({"numbers.costliest": "true"}, ["--costliest"])])
def test_switches_become_bare_flags_only_when_enabled(state, expected):
    key = WindowKey("numbers", "developer numbers", switches=["costliest"])
    assert key.line(state) == ["developer", "numbers", *expected]


def test_a_key_switch_overrides_global_state_and_keeps_value_arguments():
    key = WindowKey("numbers", "developer numbers", arguments=["limit"], switches=["costliest"])
    assert key.line({"costliest": "true", "numbers.costliest": "false", "numbers.limit": "1"}) == ["developer", "numbers", "--limit", "1"]
