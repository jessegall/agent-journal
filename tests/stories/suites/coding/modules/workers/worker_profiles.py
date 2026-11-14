from core.modules.agents.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.support.worker_command import WORK_STEPS
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_MEDIOR_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_SENIOR_PROFILE


def dispatched_brief(new_story, line):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_success(line, actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    return story, " ".join(launcher.requests[0]["command"])


def test_a_worker_gets_its_profile_s_body_before_its_task(new_story):
    story, brief = dispatched_brief(new_story, f"worker dispatch --test-command python=pytest 1 --model opus --profile {WORKER_SENIOR_PROFILE.name}")
    story.expect_rows("You are a senior worker" in brief, brief.index("You are a senior worker") < brief.index("Your task is 1"))


def test_the_required_steps_reach_a_worker_of_any_profile(new_story):
    story, brief = dispatched_brief(new_story, f"worker dispatch --test-command python=pytest 1 --profile {WORKER_MEDIOR_PROFILE.name}")
    story.expect_rows(WORK_STEPS in brief)


def test_a_profile_of_another_type_and_a_base_profile_are_refused(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_refusal(f"worker dispatch --test-command python=pytest 1 --model sonnet --profile {RESEARCHER_PROFILE.name}", "journal helper start", actor=story.agent)
    base_line = f"worker dispatch --test-command python=pytest 1 --model sonnet --profile {WORKER_PROFILE.name}"
    story.expect_refusal(base_line, f"{WORKER_PROFILE.name} is a base profile", actor=story.agent)
    story.expect_refusal(base_line, f"{WORKER_MEDIOR_PROFILE.name}, {WORKER_SENIOR_PROFILE.name}", actor=story.agent)


def test_a_dispatch_with_no_profile_goes_to_the_medior_profile(new_story):
    story, brief = dispatched_brief(new_story, "worker dispatch --test-command python=pytest 1")
    story.expect_rows("You are a medium worker" in brief)
