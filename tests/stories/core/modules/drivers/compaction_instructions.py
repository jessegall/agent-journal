from datetime import timedelta

import pytest

from core.modules.claude_code.providers.claude_code_provider import COMPACTION_INSTRUCTIONS
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.context_limit import PRE_COMPACT, SESSION, LimitEnabled, stops, typing_recorded

HELPER_SESSION = "s-helper"
CODEX_SESSION = "s-codex"


@pytest.fixture
def agent(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


def started(story, session: str, program: str, role: str) -> None:
    story.expect_success(f"agent start {session} {program} {role} --parent {story.agent.id} --environment main", actor=story.user)
    story.hook(session, HookSamples.session_start().with_fields(program=program))


def test_an_automatic_compaction_gets_the_instructions(agent):
    agent.expect_hook_allowed(SESSION, PRE_COMPACT.with_raw({"trigger": "auto", "custom_instructions": None}), COMPACTION_INSTRUCTIONS)


def test_a_manual_compact_with_no_text_gets_the_instructions(agent):
    agent.expect_hook_allowed(SESSION, PRE_COMPACT.with_raw({"trigger": "manual", "custom_instructions": None}), COMPACTION_INSTRUCTIONS)


def test_a_manual_compact_with_the_persons_text_keeps_it(agent):
    # Claude Code joins the person's /compact text with the hook's output (report 1456), so the reply adds only the journal's
    reply = agent.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual", "custom_instructions": "keep the word BANANA"}))
    agent.expect_rows(reply.refusal == "", list(reply.lines) == [COMPACTION_INSTRUCTIONS], detail=str(reply))


def test_the_compact_button_types_a_plain_compact(agent):
    agent.expect_success(f"agent control {agent_number(agent, agent.agent.id)} context compact --environment main", actor=agent.user)
    stops(agent)
    agent.expect_rows([line for line in agent.typing.typed if line.startswith("/compact")] == ["/compact"], detail=str(agent.typing.typed))


def test_a_helper_that_compacts_headless_gets_the_instructions(agent):
    started(agent, HELPER_SESSION, "claude", "helper")
    agent.expect_hook_allowed(HELPER_SESSION, PRE_COMPACT.with_raw({"trigger": "auto", "custom_instructions": None}), COMPACTION_INSTRUCTIONS)


def test_a_codex_compaction_is_unchanged(agent):
    started(agent, CODEX_SESSION, "codex", "helper")
    reply = agent.hook(CODEX_SESSION, PRE_COMPACT.with_fields(program="codex").with_raw({"trigger": "auto"}))
    agent.expect_rows(reply.refusal == "", COMPACTION_INSTRUCTIONS not in reply.lines, detail=str(reply))


POST_COMPACT = HookSamples.sample("compact_end").with_fields(accepts_lines=False).with_raw({"trigger": "manual", "compact_summary": "The summary."})


def test_a_compaction_ends_at_its_post_compact_hook(new_story):
    from core.modules.agents.support.terminal_typing import TerminalTyping
    from core.modules.drivers.ticks.agent_wake_delivery import AgentWakeDelivery
    from tests.stories.core.modules.messages.delivery import KeptTyping, StoppedMessagingTurn, post_message
    from tests.stories.engine.driver.support.samples import SAMPLES
    story = new_story(SAMPLES, fixture=StoppedMessagingTurn)
    typing = KeptTyping()
    story.replace(TerminalTyping, typing)
    story.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    post_message(story, "Are you there")
    story.run_listeners()
    story.expect_rows(typing.typed == [], detail=str(typing.typed))
    story.hook(SESSION, POST_COMPACT)
    story.advance(timedelta(seconds=11))
    story.tick(SESSION)
    story.run_listeners()
    story.tick_handler_points(AgentWakeDelivery())
    story.run_listeners()
    story.expect_rows(any("New message 1" in line for _, line in typing.typed), detail=str(typing.typed))
