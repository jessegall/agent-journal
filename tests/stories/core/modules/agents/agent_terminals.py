from tests.stories.core.support.fixtures import AgentStarted

TERMINAL_LINES = "1\tready\n2\tReading cart.py\n3\tThe total is in cents now\n"


def test_an_agents_terminal_lines_are_read_from_the_launchers_log_and_after_a_line_only_the_newer_ones(new_story):
    story = new_story(fixture=AgentStarted)
    terminal_file = story.home.terminal_file(story.agent.id)
    terminal_file.parent.mkdir(parents=True)
    terminal_file.write_text(TERMINAL_LINES)
    story.expect_success(f"agent terminal {story.agent.id}", "1  ready", "2  Reading cart.py", "3  The total is in cents now")
    story.expect_success(f"agent terminal {story.agent.id} --after 2", "3  The total is in cents now")
    story.expect_absent(f"agent terminal {story.agent.id} --after 2", "1  ready", "2  Reading cart.py")


def test_an_agent_the_launcher_never_ran_has_no_terminal_lines(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success(f"agent terminal {story.agent.id}", "nothing found")
