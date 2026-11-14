from engine.database.database import Database
from engine.registry.registry import Registry
from core.modules.skills.models.agent_skill import AgentSkill
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def test_the_skill_inspector_declares_its_body_component(new_story):
    registry = Registry.read(new_story(fixture=MainEnvironment).container.get(Database))
    declaration = next(entry.declaration for entry in registry.inspectors if entry.declaration.model is AgentSkill)
    expect_value([component.window for component in declaration.components], ["skills.skill-body"])
    expect_value((declaration.links, declaration.width.value), (None, "medium"))
    window = next(window for window in registry.windows if window.name == "skills.skill-body")
    expect_value((window.place, tuple(window.reads) == tuple(next(window for window in registry.windows if window.name == "skills.skills").reads)), ("section", True))
