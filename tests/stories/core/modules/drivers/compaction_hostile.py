import pytest

from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.drivers.context_compactions import compactions
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.compaction_never_twice import compacted, expect_compaction_count, backdate_context
from tests.stories.suites.coding.modules.workers.context_limit import COMPACTION_START, LIMIT_TOKENS, SESSION, LimitEnabled, has_context, stops, typing_recorded

TERMINAL_COMPACTIONS = 10
CHANGED_LINE = "/compact keep the open tasks"


@pytest.fixture
def limited(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


def test_j1_a_helper_that_runs_the_context_control_of_the_main_agent_is_refused_and_no_compaction_is_recorded(limited):
    helper = Actor(limited.new_row_id(f"agent start helper-session claude helper --parent {limited.agent.id} --environment main"), ActorType.AGENT)
    outcome = limited.run(f"agent control {agent_number(limited, limited.agent.id)} context compact", actor=helper)
    expect_compaction_count(limited, 0)
    limited.expect_rows(outcome.code != 0, compactions(limited) == [], detail=outcome.output_text)


def test_c4_j3_a_session_start_that_claims_a_compaction_twice_ends_one_row_with_no_start_time_and_an_older_size_over_the_limit_asks_for_none(limited):
    limited.hook(SESSION, COMPACTION_START)
    limited.hook(SESSION, COMPACTION_START)
    limited.run_listeners()
    backdate_context(limited, LIMIT_TOKENS)
    stops(limited)
    expect_compaction_count(limited, 0)
    ended = compactions(limited)
    limited.expect_rows(len(ended) == 1, ended[0].state is CompactionState.ENDED, ended[0].started_at is None, ended[0].ended_at is not None, detail=str(ended))


def test_j4_ten_compactions_a_person_types_at_the_terminal_are_ten_rows_and_the_journal_types_none(limited):
    for _ in range(TERMINAL_COMPACTIONS):
        compacted(limited, "manual")
    recorded = compactions(limited)
    expect_compaction_count(limited, 0)
    limited.expect_rows(len(recorded) == TERMINAL_COMPACTIONS, {compaction.reason for compaction in recorded} == {CompactionReason.TERMINAL_PERSON},
                        limited.run("context-compaction list", actor=limited.user).output_text.count(CompactionReason.TERMINAL_PERSON.value) == TERMINAL_COMPACTIONS, detail=str(recorded))


def test_j5_a_compaction_keeps_the_line_that_was_typed_when_the_program_line_changes_later(limited, monkeypatch):
    has_context(limited, LIMIT_TOKENS)
    stops(limited)
    monkeypatch.setattr("core.modules.claude_code.providers.claude_code_provider.COMPACT_LINE", CHANGED_LINE)
    limited.expect_rows([compaction.line for compaction in compactions(limited)] == [COMPACT_LINE], limited.typing.typed == [COMPACT_LINE], detail=str(compactions(limited)))
