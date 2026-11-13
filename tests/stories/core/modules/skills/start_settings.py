from engine.scope.scopes import Scopes
from core.modules.skills.support.start_skills import JOURNAL_SKILLS, StartSkills

DEFAULT_SKILLS = list(JOURNAL_SKILLS)
from tests.stories.core.modules.skills.due import DUE
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from core.modules.skills.support.start_skills import AFTER_COMPACTION_KEY
from core.modules.skills.support.start_skills import SESSION_START_KEY


def skills(new_story) -> tuple:
    story = new_story(DUE, fixture=CodingEnvironment)
    return story, story.container.get(StartSkills)


def test_both_start_settings_default_to_the_journals_own_skills(new_story):
    story, start = skills(new_story)
    expect_session_start(start, 1, DEFAULT_SKILLS)
    expect_after_compaction_start(start, 1, DEFAULT_SKILLS)


def test_a_changed_setting_is_used_by_the_next_start_and_leaves_the_other_alone(new_story):
    story, start = skills(new_story)
    story.use_fixture_environment(None)
    story.run(f"setting make {SESSION_START_KEY} '[\"journal-notes\"]'")
    start = story.container.get(StartSkills)
    expect_session_start(start, 1, ["journal-notes"])
    expect_after_compaction_start(start, 1, DEFAULT_SKILLS)


def test_an_environment_setting_wins_over_the_projects(new_story):
    story, _ = skills(new_story)
    story.use_fixture_environment(None)
    story.run(f"setting make {AFTER_COMPACTION_KEY} '[\"journal\"]'")
    story.run(f"setting make {AFTER_COMPACTION_KEY} '[\"journal-chores\"]' --environment main")
    expect_after_compaction(story, 1, ["journal-chores"])


def expect_after_compaction(story, number, expected) -> None:
    with story.container.get(Scopes).opened(None, number):
        actual = story.container.get(StartSkills).after_compaction()
    assert actual == expected, actual


def expect_session_start(start, number, expected) -> None:
    actual = start.session_start()
    assert actual == expected, actual


def expect_after_compaction_start(start, number, expected) -> None:
    actual = start.after_compaction()
    assert actual == expected, actual
