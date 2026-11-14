from types import SimpleNamespace

from core.modules.drivers.support.actor_loader import ActorLoader
from engine.driver.agent_hook import AgentHook
from engine.driver.open_row import OpenRow
from engine.time.timestamp import Timestamp

CREATED = Timestamp.parsed("2026-11-14T05:00:00+00:00")
STARTED = Timestamp.parsed("2026-11-14T06:00:00+00:00")
LAUNCHED = Timestamp.parsed("2026-11-14T07:00:00+00:00")
CHOICE = SimpleNamespace(suite=lambda: SimpleNamespace(name="coding"), driver=lambda role: SimpleNamespace(name=f"coding.{role}"))


def agent(launched_at=None, process_started_at=None):
    return SimpleNamespace(id=7, environment_id=5, role="worker", access="writing", launched_at=launched_at, process_started_at=process_started_at,
                           creation_timestamp=lambda: CREATED)


def test_the_actor_carries_its_suite_driver_and_launch():
    actor = ActorLoader(CHOICE).loaded(agent(launched_at=LAUNCHED, process_started_at=STARTED))
    assert (actor.suite, actor.driver, actor.anchor) == ("coding", "coding.worker", OpenRow("agent", 7, LAUNCHED))


def test_the_anchor_falls_back_to_the_process_start_then_the_creation():
    assert ActorLoader(CHOICE).loaded(agent(process_started_at=STARTED)).anchor.opened_at == STARTED
    assert ActorLoader(CHOICE).loaded(agent()).anchor.opened_at == CREATED


def test_a_hook_of_the_actor_has_its_agent_suite_and_driver():
    actor = ActorLoader(CHOICE).loaded(agent())
    hook = AgentHook.of_actor(SimpleNamespace(), actor, LAUNCHED)
    assert (hook.agent_id, hook.environment_id, hook.role, hook.driver, hook.suite, hook.access) == (7, 5, "worker", "coding.worker", "coding", "writing")
