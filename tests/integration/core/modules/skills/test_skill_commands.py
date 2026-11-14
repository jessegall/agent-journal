import pytest

from engine.command.bus import Bus
from engine.registry.registry import Registry
from engine.database.database import Database
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.commands.reset_skills.reset_skills import ResetSkills
from tests.stories.core.modules.skills.agent_skills import GOOD
from tests.stories.core.support.coding_fixtures import BuilderStartedWithoutPlainWords


def started(played):
    return played(BuilderStartedWithoutPlainWords, GOOD)


def current_digest(story, skill: str) -> str:
    return next(entry.digest for entry in Registry.read(story.container.get(Database)).skills if entry.folder == skill)








def test_a_second_load_of_the_same_digest_changes_nothing(played):
    story = started(played)
    bus, command = story.container.get(Bus), LoadSkill(story.agent.id, "journal-notes", "abc123")
    bus.run(command, story.agent)
    bus.run(command, story.agent)
    story.expect_success("agent-skill show 1", "state: loaded", "version: 2", "digest: abc123")




@pytest.fixture
def required_notes_skill(played):
    story = started(played)
    story.run(f"skill require {story.agent.id} journal-notes")
    return story
