from datetime import timedelta

import pytest

from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.fixtures import UserJoined

SESSION = "s-1"
BLOCK_AFTER = "journal.core.tools.graphify.block-after"
NUDGE_AFTER = "journal.core.tools.graphify.nudge-after"
SEARCH = HookSamples.tool_use("Grep", ToolType.SEARCH, [], None)
LOG_SEARCH = HookSamples.tool_use("Grep", ToolType.SEARCH, ["/var/log/system.log"], None)
SHELL_SEARCH = HookSamples.shell("grep -rn cart src", ShellPart("grep", CommandCategory.SEARCH, ["-rn", "cart", "src"]))
GRAPHIFY_QUERY = HookSamples.shell('graphify query "the cart"', ShellPart("graphify", CommandCategory.SEARCH, ["query", "the cart"], subcommand="query"))
USE_GRAPHIFY = "searches of the code without Graphify: use graphify query, path or explain"


def search(story, sample=SEARCH):
    story.advance(timedelta(seconds=1))
    return story.hook(SESSION, sample)


def searched(story, count: int, sample=SEARCH) -> None:
    for _ in range(count):
        reply = search(story, sample)
        assert not reply.refusal, reply.refusal


def is_nudged(reply) -> bool:
    return any(USE_GRAPHIFY in line for line in reply.lines)


@pytest.fixture
def graphify_on(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("tool on graphify", actor=story.user)
    return story


@pytest.fixture
def nine_searched(graphify_on):
    searched(graphify_on, 9)
    return graphify_on


@pytest.fixture
def blocked(graphify_on):
    searched(graphify_on, 25)
    return graphify_on


def test_searches_without_graphify_are_nudged_at_ten_and_again_at_twenty(nine_searched):
    story = nine_searched
    assert is_nudged(search(story))
    assert not any(is_nudged(search(story)) for _ in range(9))
    assert is_nudged(search(story))


def test_after_twenty_five_searches_every_search_that_is_not_graphify_is_refused_and_other_tools_still_pass(blocked):
    story = blocked
    story.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    reply = search(story)
    assert "use graphify query, path or explain first" in reply.refusal, reply.refusal
    assert search(story, SHELL_SEARCH).refusal


def test_using_graphify_lifts_the_block_and_starts_the_count_again(blocked):
    story = blocked
    assert not search(story, GRAPHIFY_QUERY).refusal
    searched(story, 25)
    assert search(story).refusal


def test_with_the_tool_off_nothing_is_nudged_or_refused(new_story):
    story = new_story(fixture=UserJoined)
    for _ in range(30):
        reply = search(story, SHELL_SEARCH)
        assert not reply.refusal and not is_nudged(reply)


def test_a_search_outside_the_code_does_not_count(graphify_on):
    story = graphify_on
    for _ in range(30):
        reply = search(story, LOG_SEARCH)
        assert not reply.refusal and not is_nudged(reply)


def test_the_numbers_are_settings_and_shell_searches_count_too(graphify_on):
    story = graphify_on
    story.expect_success(f"setting set {BLOCK_AFTER} 3 --project", actor=story.user)
    story.expect_success(f"setting set {NUDGE_AFTER} 2 --project", actor=story.user)
    assert not is_nudged(search(story, SHELL_SEARCH))
    assert is_nudged(search(story, SHELL_SEARCH))
    searched(story, 1, SHELL_SEARCH)
    assert search(story, SHELL_SEARCH).refusal


def test_the_graphify_settings_show_in_the_settings_tree_only_while_the_tool_is_on(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_absent("setting tree", NUDGE_AFTER, actor=story.user)
    story.expect_success("tool on graphify", actor=story.user)
    story.expect_text("setting tree", NUDGE_AFTER, BLOCK_AFTER, actor=story.user)
    story.expect_success("tool off graphify", actor=story.user)
    story.expect_absent("setting tree", BLOCK_AFTER, actor=story.user)
