from engine.database.database import Database
from engine.registry.registry import Registry
from engine.skill.skill_digest import SkillDigest
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from engine.testing.expectations.expect_row import expect_row

MODULES = (f"{PATH}:GoodSkillsModule", f"{PATH}:PlanSkillsModule")




def test_api_skills_lists_the_skills_of_two_modules_behind_the_login(new_story):
    with server_story(new_story(*MODULES, fixture=UserJoined)) as story:
        story.expect_viewer_status("/api/skills", 401)
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_status("/api/skills", 200, cookie, text='"folder": "journal-roadmaps"')
        story.expect_viewer_status("/api/skills", 200, cookie, text='"folder": "journal-notes"')


def expect_module_journal_roadmaps(skills, expected) -> None:
    actual = skills['journal-roadmaps'].module
    assert actual == expected, actual


def expect_absent_journal_roadmaps(skills) -> None:
    actual = skills['journal-roadmaps'].shipped
    assert not actual, actual


def expect_journal_flowcharts_messages_limit(text, text_2, text_3, text_4, text_5, text_6, expected) -> None:
    actual = {text, text_2, text_3, text_4, text_5, text_6}
    assert actual <= expected, actual
