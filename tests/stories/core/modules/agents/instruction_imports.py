from core.base.journal_home import JournalHome
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.support.fixtures import UserJoined


def test_a_main_agent_hears_of_an_instruction_file_that_imports_a_file_twice(new_story):
    story = new_story(fixture=UserJoined)
    project = story.container.get(JournalHome).project_folder
    (project / "AGENTS.md").write_text("# Rules\n")
    (project / "CLAUDE.md").write_text("@AGENTS.md\n\n@AGENTS.md\n")
    agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {agent.id}", "CLAUDE.md imports AGENTS.md 2 times")
