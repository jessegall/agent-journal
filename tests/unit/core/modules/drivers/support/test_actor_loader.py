from types import SimpleNamespace

from core.modules.drivers.support.actor_loader import ActorLoader
from engine.driver.agent_hook import AgentHook
from engine.driver.open_row import OpenRow
from engine.enums.agent_kind import AgentKind
from engine.profile.agent_profile import AgentProfile
from engine.registry.default_state_entry import DefaultStateEntry
from engine.time.timestamp import Timestamp

CREATED = Timestamp.parsed("2026-11-14T05:00:00+00:00")
STARTED = Timestamp.parsed("2026-11-14T06:00:00+00:00")
LAUNCHED = Timestamp.parsed("2026-11-14T07:00:00+00:00")
CHOICE = SimpleNamespace(suite=lambda: SimpleNamespace(name="coding"), driver=lambda role: SimpleNamespace(name=f"coding.{role}"))


class Switches:
    def __init__(self, off=()) -> None:
        self.off = off

    def enabled(self, name: str) -> bool:
        return name not in self.off


class Defaults:
    def default_states(self, suite_name, role, driver, helper_type):
        given = [DefaultStateEntry("coding.main-default", AgentKind.ROLE, "main"), DefaultStateEntry("coding.worker-default", AgentKind.HELPER_TYPE, "worker"),
                 DefaultStateEntry("coding.helper-default", AgentKind.ROLE, "helper", removed_while="coding.review-overlay")]
        return tuple(default for default in given if default.matches(role, driver, helper_type))


class Profiles:
    def effective(self, name):
        return AgentProfile(name, removed_states=tuple(["coding.worker-default"]) if name == "quiet-worker" else ())


def loader(off=()) -> ActorLoader:
    return ActorLoader(CHOICE, Defaults(), Switches(off), Profiles())


def agent(launched_at=None, process_started_at=None, role="worker", profile=""):
    return SimpleNamespace(id=7, environment_id=5, role=role, access="writing", launched_at=launched_at, process_started_at=process_started_at,
                           creation_timestamp=lambda: CREATED, profile=profile)


def test_the_actor_carries_its_suite_driver_and_launch():
    actor = loader().loaded(agent(launched_at=LAUNCHED, process_started_at=STARTED))
    assert (actor.suite, actor.driver, actor.anchor) == ("coding", "coding.worker", OpenRow("agent", 7, LAUNCHED))


def test_the_anchor_falls_back_to_the_process_start_then_the_creation():
    assert loader().loaded(agent(process_started_at=STARTED)).anchor.opened_at == STARTED
    assert loader().loaded(agent()).anchor.opened_at == CREATED


def test_a_hook_of_the_actor_has_its_agent_suite_and_driver():
    actor = loader().loaded(agent())
    hook = AgentHook.of_actor(SimpleNamespace(), actor, LAUNCHED)
    assert (hook.agent_id, hook.environment_id, hook.role, hook.driver, hook.suite, hook.access) == (7, 5, "worker", "coding.worker", "coding", "writing")


def test_a_worker_carries_the_worker_and_helper_defaults_and_the_main_agent_its_own():
    assert loader().loaded(agent()).defaults == ("coding.worker-default", "coding.helper-default")
    assert loader().loaded(agent(role="main")).defaults == tuple(["coding.main-default"])


def test_a_default_switched_off_is_removed_from_the_actor():
    assert loader(off=("coding.worker-default",)).loaded(agent()).defaults == ("coding.helper-default",)


def test_a_hook_of_the_actor_carries_its_anchor_and_defaults():
    actor = loader().loaded(agent(launched_at=LAUNCHED))
    hook = AgentHook.of_actor(SimpleNamespace(), actor, LAUNCHED)
    assert (hook.anchor, hook.defaults) == (OpenRow("agent", 7, LAUNCHED), ("coding.worker-default", "coding.helper-default"))


def test_a_default_named_in_the_profiles_removed_states_is_removed_from_the_actor():
    assert loader().loaded(agent(profile="quiet-worker")).defaults == ("coding.helper-default",)
    assert loader().loaded(agent(profile="journal-worker")).defaults == ("coding.worker-default", "coding.helper-default")


def test_a_hook_of_the_actor_carries_the_state_that_removes_each_default_while_open():
    hook = AgentHook.of_actor(SimpleNamespace(), loader().loaded(agent()), LAUNCHED)
    assert hook.removed_while == {"coding.helper-default": "coding.review-overlay"}
