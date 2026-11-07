from tests.stories.core.support.coding_fixtures import BuilderWithUser, HelperUnderBuilder, OrchestratorWithOpenTask
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.profiles.support.job_commands import expect_published_commands, expect_helper_commands, expect_worker_commands


def test_every_profile_publishes_its_job_commands_for_each_program(new_story):
    story = new_story(fixture=BuilderWithUser)
    expect_published_commands(story)


def test_the_planner_and_researcher_can_file_work_and_readers_can_use_the_journal(new_story):
    story = install_runner(new_story(fixture=HelperUnderBuilder))
    expect_helper_commands(story)


def test_each_worker_profile_can_read_its_task_log_work_and_make_a_proof(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    expect_worker_commands(story)
