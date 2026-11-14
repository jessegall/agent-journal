from engine.enums.occupant import Occupant
import json

import pytest

from core.modules.profiles.support.profile_files import ProfileFiles
from tests.stories.core.support.fixtures import UserJoined
from suites.coding.support.shipped_profiles import CODE_REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import DEBUGGER_PROFILE
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_MEDIOR_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_SENIOR_PROFILE

MODULES = "tests.stories.core.modules.profiles.support.profile_modules"




def test_a_third_party_module_brings_a_type_a_driver_and_a_profile(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_sync_success(f"{MODULES}:ClerkModuleJoining")
    story.expect_text("profile list", "sample-clerk", "clerk")


