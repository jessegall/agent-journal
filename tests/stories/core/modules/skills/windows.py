from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_skills_window_is_a_component_window_of_one_agent(new_story):
    window_story(new_story).expect_declared_window("skills.skills", "component", "agent")


def test_the_skills_window_reads_the_loaded_skills_the_catalogue_and_one_skills_text(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("skills.skills", "agent-skill list --agent 1")
    window.expect_window_allowed("skills.skills", "skill list")
    window.expect_window_allowed("skills.skills", "skill show journal-notes")


def test_the_skills_window_runs_nothing(new_story):
    window = window_story(new_story)
    window.expect_window_refusal("skills.skills", "skill write", "skills.skills")
