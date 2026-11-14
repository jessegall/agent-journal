from datetime import timedelta

import pytest

from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from tests.stories.core.modules.drivers.context_compactions import compactions
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.compaction_never_twice import HardLimitEnabled
from tests.stories.suites.coding.modules.workers.context_limit import COMPACTION_START, HARD, LIMIT_TOKENS, PRE_COMPACT, SESSION, LimitEnabled, has_context, stops, typing_recorded

OPEN_REFUSAL = "a compact is requested since"
SLOW_TICK = timedelta(seconds=601)
SECOND_AGENT_SESSION = "side-main"
SECOND_AGENT_TOKENS = LIMIT_TOKENS + 50_000
EDIT = HookSamples.edit("src/cart.py")
HARD_STOP_REFUSAL = "no more tools, stop now"


class TwoMainAgents(StoryFixture):
    """The context limit is on, and a second main agent runs in another environment with its own session."""

    parent = LimitEnabled

    def steps(self, story):
        story.expect_success("environment make elsewhere /work/elsewhere", actor=story.user)
        story.expect_success(f"agent start {SECOND_AGENT_SESSION} claude main --environment elsewhere")


class PromptedWithLimit(StoryFixture):
    """The context limit is on and the agent has a prompt behind it."""

    parent = LimitEnabled

    def steps(self, story):
        story.hook(SESSION, HookSamples.prompt("go on"))


class PromptedWithHardLimit(StoryFixture):
    """Both context limits are on and the agent has a prompt behind it."""

    parent = HardLimitEnabled

    def steps(self, story):
        story.hook(SESSION, HookSamples.prompt("go on"))


@pytest.fixture
def agent(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


@pytest.fixture
def exceeding_limit(new_story):
    return typing_recorded(new_story(fixture=PromptedWithLimit))


@pytest.fixture
def exceeding_hard_limit(new_story):
    return typing_recorded(new_story(fixture=PromptedWithHardLimit))


def expect_single_entered_request(story):
    rows = compactions(story)
    story.expect_rows(len(rows) == 1, rows[0].state is CompactionState.REQUESTED, story.typing.typed == [COMPACT_LINE], detail=f"{rows} {story.typing.typed}")


def test_g1_two_stops_of_one_agent_in_the_same_second_make_one_request_and_type_one_line(exceeding_limit):
    has_context(exceeding_limit, LIMIT_TOKENS)
    exceeding_limit.hook(SESSION, HookSamples.stop())
    exceeding_limit.hook(SESSION, HookSamples.stop())
    expect_single_entered_request(exceeding_limit)


def test_g1_a_second_request_made_in_the_same_second_as_the_first_is_refused_naming_it(exceeding_limit):
    has_context(exceeding_limit, LIMIT_TOKENS)
    exceeding_limit.hook(SESSION, HookSamples.stop())
    with pytest.raises(Refusal, match=OPEN_REFUSAL):
        exceeding_limit.container.get(Bus).run(CompactAgentContext(exceeding_limit.agent.id), exceeding_limit.agent)
    expect_single_entered_request(exceeding_limit)


def test_g2_the_stop_rule_after_the_hard_stop_rule_in_the_same_second_makes_no_second_request(exceeding_hard_limit):
    has_context(exceeding_hard_limit, HARD)
    exceeding_hard_limit.expect_hook_refusal(SESSION, EDIT, HARD_STOP_REFUSAL)
    exceeding_hard_limit.hook(SESSION, HookSamples.stop())
    expect_single_entered_request(exceeding_hard_limit)
    exceeding_hard_limit.expect_rows(compactions(exceeding_hard_limit)[0].reason is CompactionReason.HARD_STOP)


def test_g2_the_hard_stop_rule_after_the_stop_rule_in_the_same_second_makes_no_second_request(exceeding_hard_limit):
    has_context(exceeding_hard_limit, HARD)
    exceeding_hard_limit.hook(SESSION, HookSamples.stop())
    exceeding_hard_limit.expect_hook_refusal(SESSION, EDIT, HARD_STOP_REFUSAL)
    expect_single_entered_request(exceeding_hard_limit)
    exceeding_hard_limit.expect_rows(compactions(exceeding_hard_limit)[0].reason is CompactionReason.STOP_LIMIT)


def test_g3_a_typed_compaction_is_woken_by_the_listener_and_a_tick_after_600_seconds_types_no_second_wake(agent):
    agent.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    agent.hook(SESSION, COMPACTION_START)
    agent.run_listeners()
    agent.expect_rows(len(agent.typing.typed) == 1, "compacted" in agent.typing.typed[0], detail=str(agent.typing.typed))
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, rows[0].resumed_at is not None, detail=str(rows))
    agent.advance(SLOW_TICK)
    agent.tick(SESSION)
    agent.advance(SLOW_TICK)
    agent.tick(SESSION)
    agent.expect_rows(len(agent.typing.typed) == 1, detail=str(agent.typing.typed))


def test_g5_two_main_agents_over_the_limit_together_each_get_their_own_row_and_their_own_reading(new_story):
    story = typing_recorded(new_story(fixture=TwoMainAgents))
    has_context(story, LIMIT_TOKENS)
    save_status_file(story, SECOND_AGENT_SESSION, {"context_window": {"total_input_tokens": SECOND_AGENT_TOKENS}})
    story.hook(SECOND_AGENT_SESSION, HookSamples.prompt("go on"))
    story.hook(SECOND_AGENT_SESSION, HookSamples.stop())
    stops(story)
    rows = compactions(story)
    story.expect_rows(len(rows) == 2, len({row.session_agent_id for row in rows}) == 2, [row.request_tokens for row in rows] == [SECOND_AGENT_TOKENS, LIMIT_TOKENS],
                      all(row.state is CompactionState.REQUESTED for row in rows), story.typing.typed == [COMPACT_LINE, COMPACT_LINE], detail=f"{rows} {story.typing.typed}")


def test_g6_a_person_clicking_compact_twice_has_the_second_click_refused_naming_the_open_one(agent):
    line = " ".join(["agent", "control", str(agent_number(agent, agent.agent.id)), "context", "compact", "--environment", "main"])
    agent.expect_success(line, actor=agent.user)
    agent.expect_refusal(line, OPEN_REFUSAL, actor=agent.user)
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, rows[0].reason is CompactionReason.PERSON, rows[0].state is CompactionState.REQUESTED, agent.typing.typed == [COMPACT_LINE], detail=f"{rows} {agent.typing.typed}")
