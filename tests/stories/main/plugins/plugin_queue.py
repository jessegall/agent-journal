from journal.features.tasks.states.ready import Ready
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.main.installed_plugin import InstalledPlugin
from tests.stories.fixtures.main.working_agent import WorkingAgent


@story(InstalledPlugin, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_queued_run_streams_its_output_and_passes_on_its_exit_code(story):
    checkout = story.project_root()
    result = story.agent_runs(story.agents.subject, f"plugin queue {story.plugins.first} --kind judge --checkout {checkout} -- sh -c 'echo found; echo $JOURNAL_PLUGIN; exit 3'")
    result.expect_command_text("found")
    result.expect_command_text("echo")
    result.expect_command_refused()
    assert result.command.code == 3
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_queued_run_of_a_plugin_that_is_not_installed_is_refused(story):
    result = story.agent_runs(story.agents.subject, f"plugin queue nothing --kind judge --checkout {story.project_root()} -- true")
    result.expect_command_refused()
    story.expect_stack(story.agents.subject, Ready)
