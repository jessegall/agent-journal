from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment


def dispatched_brief(new_story, line):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_success(line, actor=story.agent)
    story.run_listeners()
    launcher.wait_for_requests()
    return story, " ".join(launcher.requests[0]["command"])


def test_a_worker_with_no_profile_starts_from_journal_worker(new_story):
    story, brief = dispatched_brief(new_story, "worker dispatch 1 --model sonnet")
    story.expect_rows("Work on the assigned task." in brief, "journal proof make" in brief)
    story.expect_text("agent list --environment main", "journal-worker")


def test_a_worker_gets_its_profile_s_body_before_its_task(new_story):
    story, brief = dispatched_brief(new_story, "worker dispatch 1 --model opus --profile journal-senior")
    story.expect_rows("You are a senior worker" in brief, brief.index("You are a senior worker") < brief.index("Your task is 1"))


def test_the_required_steps_reach_a_worker_of_any_profile(new_story):
    story, brief = dispatched_brief(new_story, "worker dispatch 1 --profile journal-medior")
    story.expect_rows("journal worker deliver" in brief)


def test_with_no_model_the_profile_s_model_is_used(new_story):
    story, brief = dispatched_brief(new_story, "worker dispatch 1 --profile journal-medior")
    story.expect_text("agent list --environment main", "journal-medior")
    story.expect_rows("sonnet" in brief)


def test_a_profile_of_another_type_is_refused(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.expect_refusal("worker dispatch 1 --model sonnet --profile journal-researcher", "journal helper start", actor=story.agent)
