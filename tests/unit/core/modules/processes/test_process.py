from datetime import datetime, timezone

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.base.timestamp import Timestamp
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process

NOW = Timestamp(datetime(2026, 11, 1, tzinfo=timezone.utc))
ACTOR = Actor(2, ActorType.AGENT)
RUNNING = Process(id=1, version=1, environment_id=1, agent_id=2, creator_id=2, line="make test", folder="/work", shell="zsh", category=CommandCategory.UNKNOWN, limit_seconds=30)


def test_moving_to_the_background_notes_when():
    moved = RUNNING.background(NOW, ACTOR)
    assert (moved.state, moved.moved_at) == (ProcessState.BACKGROUND, NOW)


def test_each_end_keeps_its_state_and_when_and_a_finished_or_failed_one_its_exit_code():
    assert (RUNNING.finish(NOW, ACTOR, 0).state, RUNNING.finish(NOW, ACTOR, 0).exit_code) == (ProcessState.FINISHED, 0)
    assert (RUNNING.fail(NOW, ACTOR, 2).state, RUNNING.fail(NOW, ACTOR, 2).exit_code) == (ProcessState.FAILED, 2)
    assert RUNNING.stop(NOW, ACTOR).state == ProcessState.STOPPED and RUNNING.orphan(NOW, ACTOR).ended_at == NOW
