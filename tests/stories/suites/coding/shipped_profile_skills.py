import json

import pytest

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.driver.command_category import CommandCategory
from core.base.registry.registry import Registry
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.skills.support.profile_skills import ProfileSkills
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from suites.coding.support.coding_helper_role import CodingHelperRole
from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_PROFILES
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask

SHIPPED_PROFILES = (*HELPER_PROFILES, *WORKER_PROFILES)
PLANNING = "journal-planning"
WORKERS = "journal-workers"
DESIGN = "journal-functional-design"
RESEARCHER_SESSION = "s-researcher"
PLAN_LIST = HookSamples.shell("journal plan list", ShellPart("journal", CommandCategory.JOURNAL, ["plan", "list"], subcommand="plan"))


def given(story, name):
    profile = Registry.read(story.container.get(Database)).profile(name).profile
    return story.container.get(ProfileSkills).folders(profile)


@pytest.mark.parametrize("name, has, has_not", [
    ("journal-worker", WORKERS, PLANNING), ("journal-medior", WORKERS, PLANNING), ("journal-senior", WORKERS, PLANNING),
    ("journal-planner", PLANNING, WORKERS), ("journal-plan-reviewer", PLANNING, WORKERS),
    ("journal-functional-designer", DESIGN, PLANNING), ("journal-merger", WORKERS, PLANNING),
    ("journal-researcher", "journal-helpers", PLANNING), ("journal-debugger", "journal-helpers", WORKERS),
    ("journal-designer", "journal-helpers", WORKERS), ("journal-code-reviewer", "journal-helpers", PLANNING),
])
def test_each_shipped_profile_gets_the_skills_of_its_job_and_not_those_of_another(new_story, name, has, has_not):
    story = new_story(fixture=OrchestratorWithOpenTask)
    skills = given(story, name)
    story.expect_rows(has in skills, has_not not in skills, detail=str(skills))


def test_every_skill_a_shipped_profile_names_exists_and_every_profile_names_some(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    known = {skill.folder for skill in story.container.get(SkillCatalogue).skills()}
    unknown = {profile.name: set(profile.skills) - known for profile in SHIPPED_PROFILES if set(profile.skills) - known}
    unnamed = [profile.name for profile in SHIPPED_PROFILES if not profile.skills]
    story.expect_rows(not unknown, not unnamed, detail=f"{unknown} {unnamed}")


def test_a_command_of_a_skill_the_profile_leaves_out_does_not_wait_for_that_skill(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.container.get(Bus).run(StartAgent(RESEARCHER_SESSION, "claude", CodingHelperRole.HELPER, story.agent.id, profile="journal-researcher"), Actor.core(), environment_id=1)
    story.expect_hook_allowed(RESEARCHER_SESSION, PLAN_LIST)


def test_the_skill_list_names_the_agent_groups_that_have_each_skill(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    rows = {row["folder"]: row["groups"] for row in json.loads(story.run("skill list --json").output_text)["rows"]}
    story.expect_rows("Workers" in rows[WORKERS], "Merger" in rows[WORKERS], "Helpers" not in rows[WORKERS], "Helpers" in rows[PLANNING], "Workers" not in rows[PLANNING], rows["journal-dumps"] == [], detail=str(rows))
