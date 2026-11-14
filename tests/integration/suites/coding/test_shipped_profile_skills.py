from core.modules.helpers.types.helper import Helper
import json

import pytest

from engine.actor.actor import Actor
from engine.database.database import Database
from engine.enums.command_category import CommandCategory
from engine.registry.registry import Registry
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.skills.support.profile_skills import ProfileSkills
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
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
WORKERS = "journal-dispatching-workers"
DESIGN = "journal-functional-design"
RESEARCHER_SESSION = "s-researcher"
WORKER_SKILL = f"{WORKER_PROFILE.name}"
HELPER_SKILL = "journal-helper"
SKILL_GROUPS = {"WORKER_SKILLS": WORKER_SKILLS, "HELPER_SKILLS": HELPER_SKILLS, "PLANNER_SKILLS": PLANNER_SKILLS, "DESIGN_SKILLS": DESIGN_SKILLS, "PLAN_REVIEW_SKILLS": PLAN_REVIEW_SKILLS}
PLAN_LIST = HookSamples.shell("journal plan list", ShellPart("journal", CommandCategory.JOURNAL, ["plan", "list"], subcommand="plan"))


def given(story, name):
    profile = Registry.read(story.container.get(Database)).profile(name).profile
    return story.container.get(ProfileSkills).folders(profile)




def test_every_skill_a_shipped_profile_names_exists_and_every_profile_names_some(played):
    story = played(OpenTaskOrchestrator)
    recorded = {skill.folder for skill in story.container.get(SkillCatalogue).skills()}
    registry = Registry.read(story.container.get(Database))
    shipped = [registry.profile(profile.name).profile for profile in SHIPPED_PROFILES]
    unknown = {profile.name: set(profile.skills) - recorded for profile in shipped if set(profile.skills) - recorded}
    anonymous = [profile.name for profile in shipped if not profile.skills]
    story.expect_rows(not unknown, not anonymous, detail=f"{unknown} {anonymous}")








