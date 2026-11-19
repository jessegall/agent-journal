from journal.features.shell.support.shell_runner import RESTART_HOLD
from journal.features.tasks.states.ready import Ready
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.main.working_agent import WorkingAgent


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_background_command_refused_by_a_waiting_restart_is_never_recorded_and_the_restart_waits_only_on_the_run_before_it(story):
    output = story.agent_has_a_background_run_printing(story.agents.subject, "./scripts/migrate.sh")
    story.user_restarts_the_journal()
    story.expect_restart_waiting_on(output)
    story.agent_runs_a_command(story.agents.subject, "journal worker merge 1")
    story.last_step.expect_shell_text(RESTART_HOLD)
    story.expect_no_new_output()
    story.user_restarts_the_journal()
    story.expect_restart_waiting_on(output)
    story.expect_stack(story.agents.subject, Ready)
