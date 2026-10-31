from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text
from tests.stories.core.modules.skills.agent_skills import read_of
from tests.stories.core.modules.skills.due import environment, start

SKILLS = ("journal", "journal-etiquette", "journal-messages", "journal-notes")


def nothing_due(new_story):
    story = environment(new_story)
    story.run("setting make skills.session-start '[]'")
    start(story)
    return story


def read_skill(story, folder: str) -> None:
    read_of(story, f".claude/skills/{folder}/SKILL.md")
    story.run_listeners()


def test_a_skill_read_shows_one_mark_in_the_agents_chat(new_story):
    story = nothing_due(new_story)
    read_skill(story, "journal-notes")
    assert mark_count(story) == 1 and "Skill journal-notes loaded" in marks_text(story), marks_text(story)
    story.expect_success("chat-mark show 1", f"agent_id: {story.agent.id}", "type: skills.skill")


def test_four_loaded_skills_show_four_marks_which_the_group_label_folds_into_one_line(new_story):
    story = nothing_due(new_story)
    for folder in SKILLS:
        read_skill(story, folder)
    assert mark_count(story) == 4, marks_text(story)
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "skills.skill")
    assert (mark.family, mark.grouping, mark.group_label.format(count=4)) == ("skills.skills", "family", "4 skills loaded")


def test_a_skill_read_twice_shows_once(new_story):
    story = nothing_due(new_story)
    read_skill(story, "journal-notes")
    read_skill(story, "journal-notes")
    assert mark_count(story) == 1, marks_text(story)
