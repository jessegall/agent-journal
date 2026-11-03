from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import AgentStarted, UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_agents_window_is_a_page_window_of_the_environment(new_story):
    window_story(new_story).expect_declared_window("agents.agents", "component", "pane")


def test_the_agents_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("agents.agents", "agent list")
    window.expect_window_allowed("agents.agents", "agent show 1")


def test_the_subagents_window_is_a_page_window_of_one_agent(new_story):
    window_story(new_story).expect_declared_window("agents.subagents", "component", "pane", "one-agent")


def test_the_subagents_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("agents.subagents", "agent list")


def test_the_transcript_window_is_a_page_window_of_one_agent_that_reads_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_declared_window("agents.transcript", "component", "pane", "one-agent")
    window.expect_window_allowed("agents.transcript", "agent transcript 1")


def test_the_environments_with_a_running_main_agent_are_listed_until_it_ends(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_text("agent environments", "1", actor=story.user)
    story.run(f"agent end {story.agent.id}", actor=story.user)
    story.expect_text("agent environments", "no environment has an agent", actor=story.user)
