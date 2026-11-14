from types import SimpleNamespace

from core.modules.drivers.support.actor_loader import ActorLoader
from core.modules.tasks.tasks_module import TasksModule
from engine.module.suite_funnel import SuiteFunnel
from engine.module.suite_list import SuiteList
from suites.coding.coding_suite import CodingSuite
from suites.coding.modules.workers.workers_module import WorkersModule


def coding_defaults():
    states = [state.name for module in (TasksModule, WorkersModule) for state in module.agent_states]
    return SuiteFunnel(SuiteList([CodingSuite]), states, ["coding.main", "coding.worker"], ["worker"]).entries(CodingSuite)


class Defaults:
    def default_states(self, suite_name, role, driver, helper_type):
        return tuple(default for default in coding_defaults() if default.matches(role, driver, helper_type))


def loaded(role: str):
    choice = SimpleNamespace(suite=lambda: SimpleNamespace(name="coding"), driver=lambda agent_role: SimpleNamespace(name=f"coding.{agent_role}"))
    agent = SimpleNamespace(id=7, environment_id=5, role=role, access="writing", launched_at=None, process_started_at=None, creation_timestamp=lambda: None)
    return ActorLoader(choice, Defaults(), SimpleNamespace(enabled=lambda name: True)).loaded(agent)


def test_the_coding_suite_syncs_with_its_two_default_states():
    assert [(default.state, default.kind.value, default.value) for default in coding_defaults()] == [("tasks.where-you-stand", "role", "main"),
                                                                                                   ("workers.worker-log-due", "helper-type", "worker")]


def test_a_main_agent_loads_with_where_you_stand_and_a_worker_with_its_log_default():
    assert loaded("main").defaults == tuple(["tasks.where-you-stand"])
    assert loaded("worker").defaults == tuple(["workers.worker-log-due"])
