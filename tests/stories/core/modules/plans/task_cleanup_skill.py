from engine.database.database import Database
from engine.registry.registry import Registry
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from tests.stories.core.support.coding_fixtures import UserBuilder

SKILL = "journal-task-cleanup"


def test_the_task_cleanup_skill_is_published_with_its_rule_first_and_the_planner_may_read_it(new_story):
    story = new_story(fixture=UserBuilder)
    story.run("skill write")
    story.expect_text("skill list", SKILL)
    story.expect_text(f"skill show {SKILL}", "A later task overrules an earlier one, never the other way round")
    planner = Registry.read(story.container.get(Database)).profile(f"{PLANNER_PROFILE.name}").profile
    story.expect_rows(f"skill {SKILL}" in planner.body, SKILL in planner.skills)
