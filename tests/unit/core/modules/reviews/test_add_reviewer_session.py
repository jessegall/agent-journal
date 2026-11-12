from datetime import datetime, timezone

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.time.timestamp import Timestamp
from core.modules.reviews.commands.add_reviewer.add_reviewer import AddReviewer
from core.modules.reviews.commands.add_reviewer.add_reviewer_handler import AddReviewerHandler
from core.modules.drivers.support.reviewer_start import ReviewerStart


class FakeSettings:
    def program(self) -> str:
        return "claude"

    def model(self) -> str:
        return "sonnet"


class FakeBus:
    def __init__(self) -> None:
        self.starts: list = []

    def dispatch(self, command, context):
        self.starts.append(command)
        return type("StartedAgent", (), {"id": 9, "program": command.program, "program_model": command.program_model})()


class FakeRepository:
    def save(self, row, context):
        return row


class FakeSandbox:
    def check(self) -> None:
        pass


def added(bus: FakeBus):
    handler = AddReviewerHandler(FakeSettings(), ReviewerStart(bus, FakeRepository()), FakeRepository(), FakeSandbox())
    command = AddReviewer()
    return handler.handle(command, Context(Actor(7, ActorType.AGENT), Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc)), command, environment_id=1))


def test_every_reviewer_gets_a_session_of_its_own_and_the_model_the_setting_names():
    bus = FakeBus()
    reviewer = added(bus)
    added(bus)
    assert bus.starts[0].session != bus.starts[1].session
    assert (reviewer.program, reviewer.model) == ("claude", "sonnet")
    assert bus.starts[0].program_model == "sonnet"
