from dataclasses import dataclass
from types import SimpleNamespace
from typing import ClassVar

from engine.driver.agent_state import AgentState
from engine.event.system_event import SystemEvent
from engine.listener.commit.agent_state_openness import AgentStateOpenness
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from engine.listener.commit.state_listener import StateListener

LOGGED = SimpleNamespace(environment_id=5)


class Reviewing(AgentState):
    name = "samples.reviewing"


@dataclass(frozen=True)
class ReviewAsked(SystemEvent):
    """A review was asked of an agent, or of no agent."""

    name: ClassVar[str] = "samples.review-asked"
    agent_id: int | None


class ReviewCounter(StateListener[ReviewAsked]):
    """Hears events about an agent while that agent is reviewing; an event naming no agent is about no agent."""

    name = "samples.review-count"
    state = Reviewing

    def agent_of(self, event: ReviewAsked) -> int | None:
        return event.agent_id


class PlainCounter(CommitListener[ReviewAsked]):
    name = "samples.plain-count"


class Openness(AgentStateOpenness):
    """Agent 7 is reviewing and no other, each read counted; agent 9's opener raises."""

    def __init__(self) -> None:
        self.reads: list[int] = []

    def is_open(self, agent_id: int, state: type[AgentState]) -> bool:
        self.reads.append(agent_id)
        if agent_id == 9:
            raise RuntimeError("opener broke")
        return agent_id == 7 and state is Reviewing


def runner(openness: Openness, reported: list[list[str]] | None = None) -> CommitListenerRunner:
    errors = SimpleNamespace(reported=lambda argv, error, environment_id=None: (reported if reported is not None else []).append(argv))
    container = SimpleNamespace(get=lambda class_type: openness)
    unused = SimpleNamespace()
    return CommitListenerRunner(unused, unused, container, errors, unused, unused, unused, unused, unused)


def about(agent_id: int | None) -> ReviewAsked:
    return ReviewAsked(agent_id)


def test_a_state_listener_hears_an_event_about_an_agent_in_its_state():
    assert runner(Openness()).is_heard_in_state(ReviewCounter(), about(7), LOGGED)


def test_a_state_listener_passes_by_an_event_about_an_agent_outside_its_state():
    assert not runner(Openness()).is_heard_in_state(ReviewCounter(), about(8), LOGGED)


def test_an_event_about_no_agent_and_a_plain_listener_are_heard_ungated():
    openness = Openness()
    made = runner(openness)
    assert made.is_heard_in_state(ReviewCounter(), about(None), LOGGED) and made.is_heard_in_state(PlainCounter(), about(8), LOGGED)
    assert openness.reads == []


def test_an_opener_that_raises_lets_the_listener_run():
    reported: list[list[str]] = []
    made = runner(Openness(), reported)
    assert made.is_heard_in_state(ReviewCounter(), about(9), LOGGED) and made.is_heard_in_state(ReviewCounter(), about(9), LOGGED)
    assert reported == [["agent state", "samples.reviewing", "agent", "9"]]


def test_ten_events_about_one_agent_in_a_round_read_its_state_once():
    openness = Openness()
    made = runner(openness)
    assert all(made.is_heard_in_state(ReviewCounter(), about(7), LOGGED) for _ in range(10))
    assert openness.reads == [7]
    made.round_states = {}
    made.is_heard_in_state(ReviewCounter(), about(7), LOGGED)
    assert openness.reads == [7, 7]
