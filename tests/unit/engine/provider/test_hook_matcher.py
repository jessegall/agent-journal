import pytest

from engine.enums.hook_event_name import HookEventName
from engine.enums.tool_type import ToolType
from engine.provider.enums.hook_effect import HookEffect
from engine.provider.enums.matcher_style import MatcherStyle
from engine.provider.hook_matcher import HookMatcher
from engine.provider.hook_tool_rule import HookToolRule
from engine.provider.managed_hook import ManagedHook
from tests.unit.engine.samples.program_sample import SampleProgram

NAMES = MatcherStyle.NAMES_OR_REGEX
REGEX = MatcherStyle.REGEX

# the same table as matcherCases in tools/journal-hook/managed_test.go: matcher, name, names_or_regex, regex
MATCHER_CASES = [
    ("Edit", "Edit", True, True),
    ("Edit", "MultiEdit", False, True),
    ("Edit", "NotebookEdit", False, True),
    ("Edit,Write", "Edit", True, False),
    ("Edit,Write", "Write", True, False),
    ("Edit, Write", "Write", True, False),
    ("Edit|Write", "Edit", True, True),
    ("Edit|Write", "Write", True, True),
    ("Edit|Write", "MultiEdit", False, True),
    ("mcp__.*", "mcp__x__y", True, True),
    ("(", "Edit", False, False),
    ("", "Edit", True, True),
    ("*", "Edit", True, True),
]


@pytest.mark.parametrize(("text", "name", "under_names", "under_regex"), MATCHER_CASES)
def test_the_cases_table_matches_as_the_go_hook_program_does(text, name, under_names, under_regex):
    assert (HookMatcher(text, NAMES).matches(name), HookMatcher(text, REGEX).matches(name)) == (under_names, under_regex)


def test_an_exact_name_matches_only_itself():
    assert HookMatcher("Edit", NAMES).matches("Edit")
    assert not HookMatcher("Edit", NAMES).matches("Write")


def test_edit_does_not_match_multiedit():
    assert not HookMatcher("Edit", NAMES).matches("MultiEdit")
    assert not HookMatcher("Edit", NAMES).matches("NotebookEdit")


def test_a_comma_list_matches_each_name():
    assert all(HookMatcher("Edit, Write", NAMES).matches(name) for name in ("Edit", "Write"))


def test_a_bar_list_matches_each_name():
    assert all(HookMatcher("Edit|Write", NAMES).matches(name) for name in ("Edit", "Write"))
    assert not HookMatcher("Edit|Write", NAMES).matches("MultiEdit")


def test_a_regex_matches_by_search():
    assert HookMatcher("mcp__.*", NAMES).matches("mcp__x__y")
    assert HookMatcher("Edit$", NAMES).matches("MultiEdit")


def test_an_invalid_regex_matches_nothing():
    assert not HookMatcher("(", NAMES).matches("Edit")
    assert not HookMatcher("(", REGEX).matches("Edit")


def test_empty_and_star_match_all():
    assert HookMatcher("", NAMES).matches("Anything") and HookMatcher("*", REGEX).matches("Anything")


def test_the_regex_style_keeps_a_search_for_a_plain_name():
    assert HookMatcher("Edit", REGEX).matches("MultiEdit")


class WriteRule(HookToolRule):
    hook = HookEventName.PRE_TOOL_USE
    tools = (ToolType.NEW_FILE,)


def test_effects_use_the_programs_matcher_style(monkeypatch):
    monkeypatch.setattr(SampleProgram, "tool_categories", {"Write": ToolType.NEW_FILE})
    hook = ManagedHook.found("sample", "BeforeTool", "Edit,Write", {"command": "check"}, "settings.json", True, 600)
    monkeypatch.setattr(SampleProgram, "matcher_style", NAMES)
    assert HookEffect.OVERLAPS in HookEffect.detected(hook, SampleProgram, HookEventName.PRE_TOOL_USE, [WriteRule])
    monkeypatch.setattr(SampleProgram, "matcher_style", REGEX)
    assert HookEffect.OVERLAPS not in HookEffect.detected(hook, SampleProgram, HookEventName.PRE_TOOL_USE, [WriteRule])
