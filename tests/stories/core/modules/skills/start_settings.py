from core.modules.skills.support.start_skills import JOURNAL_SKILLS, StartSkills

DEFAULT_SKILLS = list(JOURNAL_SKILLS)
from tests.stories.core.modules.skills.due import DUE
from tests.stories.core.support.coding_fixtures import CodingEnvironment


def skills(new_story) -> tuple:
    story = new_story(DUE, fixture=CodingEnvironment)
    return story, story.container.get(StartSkills)


def test_both_start_settings_default_to_the_journals_three_skills(new_story):
    story, start = skills(new_story)
    assert start.session_start(1) == DEFAULT_SKILLS and start.after_compaction(1) == DEFAULT_SKILLS


def test_a_changed_setting_is_used_by_the_next_start_and_leaves_the_other_alone(new_story):
    story, start = skills(new_story)
    story.run("setting make journal.core.skills.session-start '[\"journal-notes\"]'")
    start = story.container.get(StartSkills)
    assert start.session_start(1) == ["journal-notes"] and start.after_compaction(1) == DEFAULT_SKILLS


def test_an_environment_setting_wins_over_the_projects(new_story):
    story, _ = skills(new_story)
    story.run("setting make journal.core.skills.after-compaction '[\"journal\"]'")
    story.run("setting make journal.core.skills.after-compaction '[\"journal-tasks\"]' --environment main")
    assert story.container.get(StartSkills).after_compaction(1) == ["journal-tasks"]
