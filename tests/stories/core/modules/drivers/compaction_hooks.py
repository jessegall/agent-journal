import pytest

from engine.testing.examples.hook_samples import HookSamples
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE
from core.modules.drivers.models.enums.compaction_state import CompactionState
from tests.stories.core.modules.drivers.context_compactions import compactions
from tests.stories.suites.coding.modules.workers.context_limit import LIMIT_TOKENS, SESSION, LimitEnabled, has_context, typing_recorded

RESUMED_START = HookSamples.session_start().with_raw({"source": "resume"})


@pytest.fixture
def agent(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


def requested_at_a_stop(story):
    """A compaction the journal asked for at a stop over the limit, whose line the program has not started."""
    has_context(story, LIMIT_TOKENS)
    story.hook(SESSION, HookSamples.stop())
    story.expect_rows([row.state for row in compactions(story)] == [CompactionState.REQUESTED], detail=str(compactions(story)))


@pytest.mark.parametrize("closing_hook", [RESUMED_START, HookSamples.sample("session_end")], ids=["c6-the-session-starts-anew", "c11-the-session-ends"])
def test_a_requested_compaction_is_given_up_when_the_session_of_its_program_ends_or_starts_anew(agent, closing_hook):
    requested_at_a_stop(agent)
    agent.hook(SESSION, closing_hook)
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, rows[0].state is CompactionState.ABANDONED, agent.typing.typed.count(COMPACT_LINE) == 1, detail=str(rows))
