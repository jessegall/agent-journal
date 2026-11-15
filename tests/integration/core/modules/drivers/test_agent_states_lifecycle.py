import pytest
from pathlib import Path

from engine.enums.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from core.modules.skills.rules.skill_read_first_rule import SkillReadFirstRule
from core.modules.skills.states.skill_load_required import SkillLoadRequired
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.skills.support.skill_requirement import SkillRequirement
from tests.stories.core.modules.skills.due import DUE, JOURNAL_TASK_LIST, due_lines, start
from tests.stories.core.support.coding_fixtures import CodingEnvironmentWithoutPlainWords
from tests.integration.core.modules.drivers.support.walk_only import walk_only


# the old walk's own machinery, tested with no slice of the new driver live until task 10324 deletes it with the walk
@pytest.fixture
def played(played):
    return lambda *arguments, **fields: walk_only(played(*arguments, **fields))


class SkillsDueAgent(StoryFixture):
    """The coding environment with skills required, and a main agent that has just started, so its first
    skills are due."""

    parent = CodingEnvironmentWithoutPlainWords

    def steps(self, story):
        story.replace(SkillRequirement, SkillRequirement())
        story.run("skill write")
        start(story)


class Calls:
    """How often the skill state's opener ran and the read-first rule was asked, counted while hooks run."""

    def __init__(self, monkeypatch) -> None:
        self.opened, self.asked = 0, 0
        opener, rule = SkillLoadRequired.open_rows, SkillReadFirstRule.answer

        def counted_opener(state, hook):
            self.opened += 1
            return opener(state, hook)

        def counted_answer(read_first, hook):
            self.asked += 1
            return rule(read_first, hook)

        monkeypatch.setattr(SkillLoadRequired, "open_rows", counted_opener)
        monkeypatch.setattr(SkillReadFirstRule, "answer", counted_answer)


def read_every_due_skill(story) -> None:
    listed = due_lines(story)
    for skill in story.container.get(SkillCatalogue).skills():
        if f"  {skill.folder}  due" in listed:
            story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [str(Path(skill.path))], "diff": None}))
    story.run_listeners()


def test_an_agent_with_a_skill_due_has_the_load_state_open_and_its_rule_is_asked_once(played, monkeypatch):
    story = played(SkillsDueAgent, DUE)
    calls = Calls(monkeypatch)
    story.hook("s-1", JOURNAL_TASK_LIST)
    story.expect_rows((calls.opened, calls.asked) == (1, 1), detail=f"{calls.opened}, {calls.asked}")


def test_with_every_due_skill_read_the_state_closes_and_the_rule_is_not_asked(played, monkeypatch):
    story = played(SkillsDueAgent, DUE)
    read_every_due_skill(story)
    calls = Calls(monkeypatch)
    story.hook("s-1", JOURNAL_TASK_LIST)
    story.expect_rows((calls.opened, calls.asked) == (1, 0), detail=f"{calls.opened}, {calls.asked}, {due_lines(story)}")
