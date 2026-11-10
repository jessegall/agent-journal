from engine.database.database import Database
from core.base.registry.registry import Registry
from core.modules.agents.models.agent import Agent
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def read_registry(story):
    registry = Registry.read(story.container.get(Database))
    return registry, next(entry.declaration for entry in registry.inspectors if entry.declaration.model is Agent)


def conditions(registry) -> dict[str, tuple[str, tuple[str, ...]]]:
    return {entry.declaration.name: (entry.declaration.condition.field, tuple(entry.declaration.condition.values)) for entry in registry.buttons if "row.agent" in entry.declaration.slots}


def test_a_working_agent_offers_pause_and_stop(new_story):
    registry, declaration = read_registry(new_story(fixture=MainEnvironment))
    matched = conditions(registry)
    expect_value(matched["agents.pause"], ("activity", tuple(["working"])))
    expect_value(matched["agents.stop"], ("activity", ("working", "paused", "at usage limit")))
    expect_value({action.name: action.confirm for action in declaration.actions}["agents.stop"], "Stop the agent? It stops what it is doing.")


def test_a_paused_agent_offers_resume(new_story):
    registry, declaration = read_registry(new_story(fixture=MainEnvironment))
    expect_value(conditions(registry)["agents.resume"], ("activity", tuple(["paused"])))
    expect_value(bool(next(action for action in declaration.actions if action.name == "agents.resume").primary), True)


def test_an_ended_agent_offers_nothing(new_story):
    registry, declaration = read_registry(new_story(fixture=MainEnvironment))
    matched = conditions(registry)
    expect_value(bool(all("ended" not in values for _, values in matched.values())), True)
    expect_value(matched["workers.merge"], ("working_role", tuple(["worker"])))


def test_a_worker_offers_send_merge_and_release(new_story):
    registry, declaration = read_registry(new_story(fixture=MainEnvironment))
    labels = {entry.declaration.name: entry.declaration.label for entry in registry.buttons if "row.agent" in entry.declaration.slots}
    expect_value((labels["workers.send-job"], labels["workers.merge"], labels["workers.release"]), ("Send the worker a job", "Merge the work of the worker", "Release the worker from its task"))
    expect_value(bool(any("worker" in action.runs for action in declaration.actions)), False)


def test_the_agent_inspector_declares_the_detail_component(new_story):
    registry, declaration = read_registry(new_story(fixture=MainEnvironment))
    expect_value(([component.window for component in declaration.components], declaration.links, declaration.width.value), (["agents.agent-detail"], None, "medium"))
    window = next(window for window in registry.windows if window.name == "agents.agent-detail")
    expect_value((window.place, "usage inspector" in window.reads), ("section", True))
