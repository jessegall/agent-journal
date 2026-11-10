import pytest

from engine.testing.examples.hook_samples import HookSamples
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from tests.stories.core.modules.drivers.context_compactions import compactions
from tests.stories.suites.coding.modules.workers.context_limit import COMPACTION_START, LIMIT_TOKENS, PRE_COMPACT, SESSION, LimitEnabled, has_context, typing_recorded

RESUMED_START = HookSamples.session_start().with_raw({"source": "resume"})


@pytest.fixture
def agent(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


def requested_at_a_stop(story):
    """A compaction the journal asked for at a stop over the limit, whose line the program has not started."""
    has_context(story, LIMIT_TOKENS)
    story.hook(SESSION, HookSamples.stop())
    story.expect_rows([row.state for row in compactions(story)] == [CompactionState.REQUESTED], detail=str(compactions(story)))


@pytest.mark.parametrize("trigger, reason", [("manual", CompactionReason.TERMINAL_PERSON), ("auto", CompactionReason.AUTO)], ids=["c1-typed-by-a-person", "c1-begun-by-the-program"])
def test_a_compaction_the_journal_did_not_ask_for_gets_its_row_when_it_starts_with_who_began_it(agent, trigger, reason):
    agent.hook(SESSION, PRE_COMPACT.with_raw({"trigger": trigger}))
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, rows[0].state is CompactionState.STARTED, rows[0].reason is reason, rows[0].started_at is not None, detail=str(rows))


def test_c2_c3_the_start_of_a_requested_compaction_moves_its_row_and_a_second_start_hook_makes_no_second_row(agent):
    requested_at_a_stop(agent)
    agent.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    agent.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, rows[0].state is CompactionState.STARTED, rows[0].reason is CompactionReason.STOP_LIMIT, detail=str(rows))


def test_c4_a_compaction_whose_start_was_never_seen_gets_an_ended_row_with_no_start_time_and_only_one(agent):
    agent.hook(SESSION, COMPACTION_START)
    agent.hook(SESSION, COMPACTION_START)
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, rows[0].state is CompactionState.ENDED, rows[0].started_at is None, rows[0].ended_at is not None, detail=str(rows))


@pytest.mark.parametrize("closing_hook", [RESUMED_START, HookSamples.sample("session_end")], ids=["c6-the-session-starts-anew", "c11-the-session-ends"])
def test_a_requested_compaction_is_given_up_when_the_session_of_its_program_ends_or_starts_anew(agent, closing_hook):
    requested_at_a_stop(agent)
    agent.hook(SESSION, closing_hook)
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, rows[0].state is CompactionState.ABANDONED, agent.typing.typed.count(COMPACT_LINE) == 1, detail=str(rows))
