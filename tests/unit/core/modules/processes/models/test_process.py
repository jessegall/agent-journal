from datetime import datetime, timezone

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process

FIXED_TIME = Timestamp(datetime(2026, 11, 1, tzinfo=timezone.utc))
ACTOR = Actor(2, ActorType.AGENT)
RUNNING = Process(id=1, version=1, environment_id=1, session_agent_id=2, creator_id=2, line="make test", folder="/work", category=CommandCategory.UNKNOWN, limit_seconds=30)


def test_moving_to_the_background_notes_when():
    moved = RUNNING.background(FIXED_TIME, ACTOR)
    assert (moved.state, moved.moved_at) == (ProcessState.BACKGROUND, FIXED_TIME)


def test_each_end_keeps_its_state_and_when_and_a_finished_or_failed_one_its_exit_code():
    assert (RUNNING.finish(FIXED_TIME, ACTOR, 0).state, RUNNING.finish(FIXED_TIME, ACTOR, 0).exit_code) == (ProcessState.FINISHED, 0)
    assert (RUNNING.fail(FIXED_TIME, ACTOR, 2).state, RUNNING.fail(FIXED_TIME, ACTOR, 2).exit_code) == (ProcessState.FAILED, 2)
    assert RUNNING.stop(FIXED_TIME, ACTOR).state == ProcessState.STOPPED and RUNNING.orphan(FIXED_TIME, ACTOR).ended_at == FIXED_TIME


def test_a_run_that_finishes_reads_100_percent_whatever_it_last_reported_and_a_failed_one_keeps_its_percent():
    reported = Process(id=1, version=1, environment_id=1, session_agent_id=2, creator_id=2, line="make test", folder="/work", category=CommandCategory.UNKNOWN, limit_seconds=30, progress=96)
    assert reported.finish(FIXED_TIME, ACTOR, 0).progress == 100
    assert reported.fail(FIXED_TIME, ACTOR, 2).progress == 96
