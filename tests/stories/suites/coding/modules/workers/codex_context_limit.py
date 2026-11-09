from datetime import timedelta

import pytest

from core.base.provider.context_window import ContextWindow
from core.modules.codex.providers.codex_provider import CodexProvider
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ACTION
from core.testing.hook_samples import HookSamples
from tests.stories.suites.coding.modules.workers.context_limit import LIMIT_TOKENS, CLEAR_START, LimitEnabled, set_value, typing_recorded

CODEX_SESSION = "s-codex"


@pytest.fixture
def codex_agent(new_story, monkeypatch):
    story = typing_recorded(new_story(fixture=LimitEnabled))
    story.expect_success(f"agent start {CODEX_SESSION} codex worker --parent {story.agent.id} --environment main", actor=story.user)
    monkeypatch.setattr(CodexProvider, "context_window", lambda provider, home, session: ContextWindow(None, LIMIT_TOKENS))
    return story


def stops(story):
    story.advance(timedelta(minutes=10))
    story.hook(CODEX_SESSION, HookSamples.stop())


def test_a_codex_agent_past_the_limit_gets_the_compact_line_typed_at_its_stop(codex_agent):
    stops(codex_agent)
    codex_agent.expect_rows(codex_agent.typing.typed == ["/compact"], detail=str(codex_agent.typing.typed))


def test_with_clear_chosen_a_codex_agent_gets_the_clear_line_and_the_same_wake_as_a_claude_agent(codex_agent):
    set_value(codex_agent, CONTEXT_LIMIT_ACTION, "clear")
    stops(codex_agent)
    codex_agent.expect_rows(codex_agent.typing.typed == ["/clear"], detail=str(codex_agent.typing.typed))
    codex_agent.hook(CODEX_SESSION, CLEAR_START)
    codex_agent.run_listeners()
    codex_agent.expect_rows(len(codex_agent.typing.typed) == 2 and "compacted" in codex_agent.typing.typed[1], detail=str(codex_agent.typing.typed))
