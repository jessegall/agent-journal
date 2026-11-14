import pytest

from engine.viewer.window_key import WindowKey


@pytest.mark.parametrize("state,expected", [({}, []), ({"numbers.costliest": "false"}, []), ({"numbers.costliest": "true"}, ["--costliest"])])
def test_switches_become_bare_flags_only_when_enabled(state, expected):
    key = WindowKey("numbers", "developer numbers", switches=["costliest"])
    assert key.line(state) == ["developer", "numbers", *expected]


def test_a_key_switch_overrides_global_state_and_keeps_value_arguments():
    key = WindowKey("numbers", "developer numbers", arguments=["limit"], switches=["costliest"])
    assert key.line({"costliest": "true", "numbers.costliest": "false", "numbers.limit": "1"}) == ["developer", "numbers", "--limit", "1"]


def test_a_key_with_named_ids_takes_a_name_and_never_a_flag():
    key = WindowKey("plugin.*", "plugin show {id}", name_ids=True)
    assert key.with_id("plugin.tidy-worktrees").read == "plugin show tidy-worktrees"
    assert key.with_id("plugin.--help") is None
    assert WindowKey("run.*", "process card {id}").with_id("run.name") is None
    assert WindowKey("plugin-preview", "plugin preview {source}").line({"plugin-preview.source": "/a folder/plugin"}) == ["plugin", "preview", "/a folder/plugin"]
