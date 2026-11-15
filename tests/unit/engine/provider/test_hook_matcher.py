import pytest

from engine.provider.enums.matcher_style import MatcherStyle
from engine.provider.hook_matcher import HookMatcher

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


def test_a_claude_matcher_with_a_list_of_names_matches_each_name():
    assert all(HookMatcher("Edit,Write", NAMES).matches(name) for name in ("Edit", "Write"))


def test_a_claude_matcher_with_one_name_does_not_cover_a_longer_tool_name():
    assert not HookMatcher("Edit", NAMES).matches("MultiEdit")


def test_a_codex_matcher_is_a_regex_search():
    assert HookMatcher("Edit", REGEX).matches("MultiEdit") and HookMatcher("^apply", REGEX).matches("apply_patch")


