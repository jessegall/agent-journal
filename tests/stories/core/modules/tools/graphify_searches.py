from datetime import timedelta

import pytest

from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

SESSION = "s-1"
BLOCK_AFTER = "journal.core.tools.graphify.block-after"
NUDGE_AFTER = "journal.core.tools.graphify.nudge-after"
SEARCH = HookSamples.tool_use("Grep", ToolType.SEARCH, [], None)
LOG_SEARCH = HookSamples.tool_use("Grep", ToolType.SEARCH, ["/var/log/system.log"], None)
SHELL_SEARCH = HookSamples.shell("grep -rn cart src", ShellPart("grep", CommandCategory.SEARCH, ["-rn", "cart", "src"]))
GRAPHIFY_QUERY = HookSamples.shell('graphify query "the cart"', ShellPart("graphify", CommandCategory.SEARCH, ["query", "the cart"], subcommand="query"))
USE_GRAPHIFY = "searches without Graphify: graphify query 2 to 4 code names, then explain one"


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
def graphify_enabled(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("tool on graphify", actor=story.user)
    return story


@pytest.fixture
def nine_searched(graphify_enabled):
    searched(graphify_enabled, 9)
    return graphify_enabled


@pytest.fixture
def blocked(graphify_enabled):
    searched(graphify_enabled, 25)
    return graphify_enabled


def test_twenty_five_searches_deliver_at_most_three_graphify_lines_and_other_tool_uses_and_prompts_none(graphify_enabled):
    story = graphify_enabled
    others = [story.hook(SESSION, HookSamples.prompt("go on")), story.hook(SESSION, HookSamples.edit("src/cart.py"))]
    graphify_lines = [line for _ in range(25) for line in search(story, SHELL_SEARCH).lines if "graphify" in line.lower()]
    others.append(story.hook(SESSION, HookSamples.edit("src/cart.py")))
    story.expect_rows(len(graphify_lines) <= 3, detail=str(graphify_lines))
    story.expect_rows(not any("graphify" in line.lower() for reply in others for line in reply.lines), detail=str([reply.lines for reply in others]))


def test_after_twenty_five_searches_every_search_that_is_not_graphify_is_refused_and_other_tools_still_pass(blocked):
    story = blocked
    story.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    reply = search(story)
    expect_value("graphify query 2 to 4 code names" in reply.refusal, True)
    expect_value(bool(search(story, SHELL_SEARCH).refusal), True)


def test_a_search_outside_the_code_does_not_count(graphify_enabled):
    story = graphify_enabled
    for _ in range(30):
        reply = search(story, LOG_SEARCH)
        expect_value(bool(not reply.refusal and not is_nudged(reply)), True)


def test_the_numbers_are_settings_and_shell_searches_count_too(graphify_enabled):
    story = graphify_enabled
    story.expect_success(f"setting set {BLOCK_AFTER} 3 --project", actor=story.user)
    story.expect_success(f"setting set {NUDGE_AFTER} 2 --project", actor=story.user)
    expect_value(bool(is_nudged(search(story, SHELL_SEARCH))), False)
    expect_value(bool(is_nudged(search(story, SHELL_SEARCH))), True)
    searched(story, 1, SHELL_SEARCH)
    expect_value(bool(search(story, SHELL_SEARCH).refusal), True)


def test_the_graphify_settings_show_in_the_settings_tree_only_while_the_tool_is_on(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_absent("setting tree", NUDGE_AFTER, actor=story.user)
    story.expect_success("tool on graphify", actor=story.user)
    story.expect_text("setting tree", NUDGE_AFTER, BLOCK_AFTER, actor=story.user)
    story.expect_success("tool off graphify", actor=story.user)
    story.expect_absent("setting tree", BLOCK_AFTER, actor=story.user)
