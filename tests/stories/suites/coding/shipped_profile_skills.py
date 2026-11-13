import json

import pytest

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.database.database import Database
from engine.enums.command_category import CommandCategory
from engine.registry.registry import Registry
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.skills.support.profile_skills import ProfileSkills
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.support.shipped_profiles import DESIGN_SKILLS, HELPER_PROFILES, HELPER_SKILLS, PLANNER_SKILLS, PLAN_REVIEW_SKILLS, WORKER_PROFILES, WORKER_SKILLS
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.support.story_checks import expect_absent_value
from suites.coding.support.shipped_profiles import CODE_REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import DEBUGGER_PROFILE
from suites.coding.support.shipped_profiles import DESIGNER_PROFILE
from suites.coding.support.shipped_profiles import FUNCTIONAL_DESIGNER_PROFILE
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_MEDIOR_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_SENIOR_PROFILE

SHIPPED_PROFILES = (*HELPER_PROFILES, *WORKER_PROFILES)
PLANNING = "journal-planning"
WORKERS = "journal-workers"
DESIGN = "journal-functional-design"
RESEARCHER_SESSION = "s-researcher"
WORKER_SKILL = f"{WORKER_PROFILE.name}"
HELPER_SKILL = "journal-helper"
SKILL_GROUPS = {"WORKER_SKILLS": WORKER_SKILLS, "HELPER_SKILLS": HELPER_SKILLS, "PLANNER_SKILLS": PLANNER_SKILLS, "DESIGN_SKILLS": DESIGN_SKILLS, "PLAN_REVIEW_SKILLS": PLAN_REVIEW_SKILLS}
PLAN_LIST = HookSamples.shell("journal plan list", ShellPart("journal", CommandCategory.JOURNAL, ["plan", "list"], subcommand="plan"))


def given(story, name):
    profile = Registry.read(story.container.get(Database)).profile(name).profile
    return story.container.get(ProfileSkills).folders(profile)


@pytest.mark.parametrize("name, has, lacks", [
    (f"{WORKER_PROFILE.name}", WORKERS, PLANNING), (f"{WORKER_MEDIOR_PROFILE.name}", WORKERS, PLANNING), (f"{WORKER_SENIOR_PROFILE.name}", WORKERS, PLANNING),
    (f"{PLANNER_PROFILE.name}", PLANNING, WORKERS), (f"{PLAN_REVIEWER_PROFILE.name}", PLANNING, WORKERS),
    (f"{FUNCTIONAL_DESIGNER_PROFILE.name}", DESIGN, PLANNING), (f"{MERGER_PROFILE.name}", WORKERS, PLANNING),
    (f"{RESEARCHER_PROFILE.name}", "journal-helpers", PLANNING), (f"{DEBUGGER_PROFILE.name}", "journal-helpers", WORKERS),
    (f"{DESIGNER_PROFILE.name}", "journal-helpers", WORKERS), (f"{CODE_REVIEWER_PROFILE.name}", "journal-helpers", PLANNING),
])
def test_each_shipped_profile_gets_the_skills_of_its_job_and_not_those_of_another(new_story, name, has, lacks):
    story = new_story(fixture=OpenTaskOrchestrator)
    skills = given(story, name)
    story.expect_rows(has in skills, lacks not in skills, detail=str(skills))


def test_every_skill_a_shipped_profile_names_exists_and_every_profile_names_some(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    recorded = {skill.folder for skill in story.container.get(SkillCatalogue).skills()}
    registry = Registry.read(story.container.get(Database))
    shipped = [registry.profile(profile.name).profile for profile in SHIPPED_PROFILES]
    unknown = {profile.name: set(profile.skills) - recorded for profile in shipped if set(profile.skills) - recorded}
    anonymous = [profile.name for profile in shipped if not profile.skills]
    story.expect_rows(not unknown, not anonymous, detail=f"{unknown} {anonymous}")


@pytest.mark.parametrize("skill, owner", [(WORKER_SKILL, "WORKER_SKILLS"), (HELPER_SKILL, "HELPER_SKILLS")])
def test_a_skill_for_one_audience_is_in_that_group_and_no_other(skill, owner):
    missing = [f"{skill} does not exist in {owner}"] if skill not in SKILL_GROUPS[owner] else []
    expect_absent_value(missing + [f"{name} holds {skill}" for name, group in SKILL_GROUPS.items() if name != owner and skill in group])


@pytest.mark.parametrize("owner, sender_skill", [("WORKER_SKILLS", WORKERS), ("HELPER_SKILLS", "journal-helpers")])
def test_a_group_no_longer_holds_the_skill_of_the_agent_that_sends_it(owner, sender_skill):
    expect_absent_value([f"{owner} still holds {sender_skill}"] if sender_skill in SKILL_GROUPS[owner] else [])


def test_a_command_of_a_skill_the_profile_leaves_out_does_not_wait_for_that_skill(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.container.get(Bus).run(StartAgent(RESEARCHER_SESSION, "claude", CodingHelperRole.HELPER, story.agent.id, profile=f"{RESEARCHER_PROFILE.name}"), Actor.core(), environment_id=1)
    story.expect_hook_allowed(RESEARCHER_SESSION, PLAN_LIST)


def test_the_skill_list_names_the_agent_groups_that_have_each_skill(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    rows = {row["folder"]: row["groups"] for row in json.loads(story.run("skill list --json").output_text)["rows"]}
    story.expect_rows("Workers" in rows[WORKERS], "Merger" in rows[WORKERS], "Helpers" not in rows[WORKERS], "Helpers" in rows[PLANNING], "Workers" not in rows[PLANNING], rows["journal-dumps"] == [], detail=str(rows))
