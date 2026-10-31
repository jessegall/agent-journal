from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.base.skill.skill_digest import SkillDigest
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story

MODULES = (f"{PATH}:GoodSkillsModule", f"{PATH}:PlanSkillsModule")


def test_the_registry_keeps_a_skill_entry_for_every_declaration_of_two_modules(new_story):
    story = new_story(*MODULES, fixture=UserJoined)
    skills = {skill.folder: skill for skill in Registry.read(story.container.get(Database)).skills}
    assert sorted(skills) == ["journal-notes", "journal-plans", "journal-tasks"]
    assert skills["journal-plans"].module == "planskills" and not skills["journal-plans"].shipped
    assert skills["journal-notes"].digest == SkillDigest.of("---\nname: journal-notes\ndescription: How to take notes\n---\n\nWrite a note for every decision.\n")


def test_api_skills_lists_the_skills_of_two_modules_behind_the_login(new_story):
    with server_story(new_story(*MODULES, fixture=UserJoined)) as story:
        story.expect_viewer_status("/api/skills", 401)
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_status("/api/skills", 200, cookie, text='"folder": "journal-plans"')
        story.expect_viewer_status("/api/skills", 200, cookie, text='"folder": "journal-notes"')
