from datetime import datetime, timezone

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.time.timestamp import Timestamp
from core.modules.reviews.commands.add_reviewer.add_reviewer import AddReviewer
from core.modules.reviews.commands.add_reviewer.add_reviewer_handler import AddReviewerHandler

REVIEWERS_PER_ENVIRONMENT = {1: 3, 2: 1}


class FakeReviewers:
    def __init__(self, environment_id: int | None = None) -> None:
        self.environment_id = environment_id

    def in_environment(self, environment_id: int) -> "FakeReviewers":
        return FakeReviewers(environment_id)

    def count(self) -> int:
        return REVIEWERS_PER_ENVIRONMENT[self.environment_id]


class FakeSettings:
    def program(self) -> str:
        return "claude"

    def model(self) -> str:
        return ""


class FakeBus:
    def __init__(self) -> None:
        self.sessions: list[str] = []

    def dispatch(self, command, context):
        self.sessions.append(command.session)
        return type("StartedAgent", (), {"id": 9})()


class FakeRepository:
    def save(self, row, context):
        return row


class FakeSandbox:
    def check(self) -> None:
        pass


def next_session(environment_id: int) -> str:
    bus = FakeBus()
    handler = AddReviewerHandler(FakeReviewers(), FakeSettings(), bus, FakeRepository(), FakeSandbox())
    command = AddReviewer()
    handler.handle(command, Context(Actor(7, ActorType.AGENT), Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc)), command, environment_id=environment_id))
    return bus.sessions[0]


def test_the_next_reviewer_session_counts_the_reviewers_of_its_own_environment():
    assert next_session(1) == "reviewer-4"
    assert next_session(2) == "reviewer-2"
