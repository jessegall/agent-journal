import pytest

from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, expect_mark_count, expect_marks_text
from tests.stories.core.modules.skills.agent_skills import read_row
from tests.stories.core.modules.skills.due import environment, start

SKILLS = ("journal", "journal-etiquette", "journal-messages", "journal-notes")


def empty_due(new_story):
    story = environment(new_story)
    story.run("setting make journal.core.skills.session-start '[]'")
    start(story)
    return story


def read_skill(story, folder: str) -> None:
    read_row(story, f".claude/skills/{folder}/SKILL.md")
    story.run_listeners()


def test_a_skill_read_shows_one_mark_in_the_agents_chat(cleared_skill_requirements):
    story = cleared_skill_requirements
    read_skill(story, "journal-notes")
    expect_mark_count(story, 1)
    expect_marks_text(story, "Skill journal-notes loaded")
    story.expect_success("chat-mark show 1", f"session_agent_id: {story.agent.id}", "type: skills.skill")


def test_four_loaded_skills_show_four_marks_which_the_group_label_folds_into_one_line(cleared_skill_requirements):
    story = cleared_skill_requirements
    for folder in SKILLS:
        read_skill(story, folder)
    expect_mark_count(story, 4)
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "skills.skill")
    expect_family_mark_grouping(mark, 4, ("skills.skills", "family", "4 skills loaded"))


def test_a_skill_read_twice_shows_once(cleared_skill_requirements):
    story = cleared_skill_requirements
    read_skill(story, "journal-notes")
    read_skill(story, "journal-notes")
    expect_mark_count(story, 1)


@pytest.fixture
def cleared_skill_requirements(new_story):
    return empty_due(new_story)


def expect_family_mark_grouping(mark, number, expected) -> None:
    actual = (mark.family, mark.grouping, mark.group_label.format(count=number))
    assert actual == expected, actual
