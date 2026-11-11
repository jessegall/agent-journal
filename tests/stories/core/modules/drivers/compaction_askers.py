import pytest

from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from tests.stories.core.modules.drivers.context_compactions import compactions
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.context_limit import LIMIT_TOKENS, PRE_COMPACT, SESSION, LimitEnabled, has_context, stops, typing_recorded
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

SHELL_WINDOW = "viewer.shell"
OPEN_REFUSAL = "a compact is requested since"


@pytest.fixture
def agent(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


def control(story, value: str) -> list[str]:
    return ["agent", "control", str(agent_number(story, story.agent.id)), "context", value]


def test_d2_d8_a_person_asks_in_the_viewer_once_and_a_second_compact_or_a_clear_is_refused_naming_the_open_one(agent):
    FakeLauncher.listening(agent.home.socket("launcher"))
    with viewer_client(agent) as person:
        person.value(SHELL_WINDOW, control(agent, "compact"))
        with pytest.raises(AssertionError, match=OPEN_REFUSAL):
            person.value(SHELL_WINDOW, control(agent, "compact"))
        with pytest.raises(AssertionError, match=OPEN_REFUSAL):
            person.value(SHELL_WINDOW, control(agent, "clear"))
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, rows[0].reason is CompactionReason.PERSON, rows[0].state is CompactionState.REQUESTED, rows[0].line == COMPACT_LINE, detail=str(rows))
    agent.expect_text("context-compaction list", "requested", actor=agent.user)


def test_d3_a_stop_over_the_limit_right_after_a_person_asked_types_no_second_compaction(agent):
    has_context(agent, LIMIT_TOKENS)
    agent.expect_success(" ".join(["agent", "control", str(agent_number(agent, agent.agent.id)), "context", "compact", "--environment", "main"]), actor=agent.user)
    stops(agent)
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, rows[0].reason is CompactionReason.PERSON, agent.typing.typed.count(COMPACT_LINE) == 1, detail=str(rows))


@pytest.mark.parametrize("trigger, reason", [("auto", CompactionReason.AUTO), ("manual", CompactionReason.TERMINAL_PERSON)], ids=["c1-d4-the-program-compacts-by-itself", "c1-d5-a-person-types-it-at-the-terminal"])
def test_a_compaction_the_journal_did_not_send_is_recorded_with_who_began_it_and_the_next_stop_sends_none(agent, trigger, reason):
    has_context(agent, LIMIT_TOKENS)
    agent.hook(SESSION, PRE_COMPACT.with_raw({"trigger": trigger}))
    agent.hook(SESSION, HookSamples.stop())
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, rows[0].state is CompactionState.STARTED, rows[0].reason is reason, rows[0].started_at is not None, agent.typing.typed.count(COMPACT_LINE) == 0, detail=str(rows))


def test_d7_an_agent_that_compacts_itself_is_recorded_and_refused_a_second_time_while_the_first_is_open(agent):
    line = " ".join(control(agent, "compact"))
    agent.expect_success(line, actor=agent.agent)
    agent.expect_refusal(line, OPEN_REFUSAL, actor=agent.agent)
    rows = compactions(agent)
    agent.expect_rows(len(rows) == 1, agent.typing.typed.count(COMPACT_LINE) == 1, detail=str(rows))
