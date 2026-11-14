from datetime import timedelta

import pytest

from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.agents.support.terminal_typing import LAUNCHER_MISSING, TerminalTyping
from core.modules.drivers.models.enums.compaction_notice_type import CompactionNoticeType
from core.modules.drivers.models.enums.compaction_state import CompactionState
from core.modules.drivers.ticks.compaction_faults_tick import CompactionFaultsTick
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.drivers.compaction_askers import SHELL_WINDOW, control
from tests.stories.core.modules.drivers.context_compactions import compactions
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.compaction_never_twice import MissingLauncherTyping, compacted, expect_compaction_count, backdate_context
from tests.stories.suites.coding.modules.workers.context_limit import LIMIT_TOKENS, PRE_COMPACT, SESSION, LimitEnabled, has_context, stops, typing_recorded
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client
from core.modules.drivers.support.driver_nudges import COMPACTION_NOTICE

FAULT_WAIT = timedelta(seconds=601)
NOTICES = "context-compaction-notice list --json"
MARKS = "chat-mark list --json"


class RequestedCompaction(StoryFixture):
    """An agent at its context limit stopped, so the journal asked for its compaction once."""

    parent = LimitEnabled

    def steps(self, story):
        typing_recorded(story)
        has_context(story, LIMIT_TOKENS)
        stops(story)


@pytest.fixture
def limited(new_story):
    story = typing_recorded(new_story(fixture=RequestedCompaction))
    has_context(story, LIMIT_TOKENS)
    return story


def faults_reported(story) -> None:
    CompactionFaultsTick()(story.container)
    story.run_listeners()


def notice_count(story, notice: CompactionNoticeType) -> int:
    return story.run(NOTICES, actor=story.user).output_text.count(f'"notice": "{notice.value}"')


def states(story) -> list[CompactionState]:
    return [compaction.state for compaction in compactions(story)]


def main_agent_lines(story) -> str:
    return story.run(f"agent-line list --agent {story.agent.id}", actor=story.user).output_text


def test_f1_a_line_that_never_starts_fails_after_ten_minutes_and_the_person_and_the_main_agent_are_told_once(limited):
    limited.advance(FAULT_WAIT)
    faults_reported(limited)
    faults_reported(limited)
    stops(limited)
    expect_compaction_count(limited, 0)
    lines = main_agent_lines(limited)
    limited.expect_rows(states(limited) == [CompactionState.FAILED], notice_count(limited, CompactionNoticeType.UNSTARTED) == 1,
                        lines.count(COMPACTION_NOTICE.nudge(agent=agent_number(limited, limited.agent.id), notice=1).text) == 1, detail=f"{states(limited)} {lines}")


def test_f9_after_a_request_that_failed_a_person_sends_the_compaction_by_hand_and_it_takes_the_place_of_the_failed_row(limited):
    limited.advance(FAULT_WAIT)
    faults_reported(limited)
    FakeLauncher.accepting(limited.home.socket("launcher"))
    with viewer_client(limited) as person:
        person.value(SHELL_WINDOW, control(limited, "compact"))
    limited.expect_rows(states(limited)[-1] is CompactionState.REQUESTED, len(states(limited)) == 2, detail=str(states(limited)))


def test_f2_a_missing_launcher_fails_the_request_with_its_cause_and_the_person_is_told_once(new_story):
    story = new_story(fixture=LimitEnabled)
    story.typing = MissingLauncherTyping()
    story.bind(TerminalTyping, story.typing)
    has_context(story, LIMIT_TOKENS)
    stops(story)
    story.run_listeners()
    stops(story)
    failed = compactions(story)
    story.expect_rows(len(failed) == 1, failed[0].state is CompactionState.FAILED, failed[0].failure == LAUNCHER_MISSING, notice_count(story, CompactionNoticeType.FAILED) == 1,
                      LAUNCHER_MISSING in story.run(MARKS, actor=story.user).output_text, detail=str(failed))


def test_f3_a_compaction_whose_size_is_never_reported_is_told_once_and_asks_for_no_second_compaction(limited):
    compacted(limited, "manual")
    backdate_context(limited, LIMIT_TOKENS)
    limited.advance(FAULT_WAIT)
    limited.hook(SESSION, HookSamples.prompt("go on"))
    faults_reported(limited)
    faults_reported(limited)
    stops(limited)
    expect_compaction_count(limited, 0)
    limited.expect_rows(notice_count(limited, CompactionNoticeType.UNMEASURED) == 1, detail=limited.run(NOTICES, actor=limited.user).output_text)


def test_f6_a_compaction_whose_program_ends_before_it_finished_is_given_up(limited):
    limited.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    limited.hook(SESSION, HookSamples.sample("session_end"))
    limited.expect_rows(states(limited) == [CompactionState.ABANDONED], detail=str(states(limited)))


def test_f10_an_open_request_of_a_paused_agent_is_given_up_and_nothing_more_is_typed_to_it(limited):
    limited.expect_success(f"agent pause {agent_number(limited, limited.agent.id)}", actor=limited.user)
    limited.advance(FAULT_WAIT)
    faults_reported(limited)
    expect_compaction_count(limited, 0)
    limited.expect_rows(states(limited) == [CompactionState.ABANDONED], notice_count(limited, CompactionNoticeType.UNSTARTED) == 0, detail=str(states(limited)))
