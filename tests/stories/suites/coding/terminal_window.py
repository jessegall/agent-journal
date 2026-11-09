from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_the_terminal_reads_its_agents_calls_then_requests_older_calls_and_output(new_story):
    story = new_story(fixture=UserBuilder)
    story.hook("s-1", HookSamples.stop().with_fields(firing="terminal-stop"))
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        query = f"environment=main&calls.session-agent-id={story.agent.id}&calls.limit=1"
        status, answer = window_data(server, cookie, window="coding.terminal", query=query)
        newest = answer["keys"]["calls"]["value"]["rows"][0]
        story.expect_rows(status == 200, set(answer["keys"]) == {"calls"}, newest["session_agent_id"] == story.agent.id,
                          newest["hook"] == "stop", answer["declared"]["calls"]["page_size"] == 200)
        status, older = window_data(server, cookie, keys="calls", window="coding.terminal", query=f"{query}&calls.before-id={newest['id']}")
        story.expect_rows(status == 200, set(older["keys"]) == {"calls"}, older["keys"]["calls"]["value"]["rows"][0]["id"] < newest["id"])
        key = f"terminal-calls.{story.agent.id}"
        status, embedded = window_data(server, cookie, keys=key, window="agents.agents")
        story.expect_rows(status == 200, set(embedded["keys"]) == {key},
                          all(row["session_agent_id"] == story.agent.id for row in embedded["keys"][key]["value"]["rows"]))
        key = f"terminal-output.{newest['id']}"
        status, output = window_data(server, cookie, keys=key, window="coding.terminal")
        story.expect_rows(status == 200, set(output["keys"]) == {key}, output["keys"][key]["code"] == 0,
                          output["keys"][key]["value"]["lines"] == [])


def test_the_card_of_a_journal_line_shows_what_that_line_printed(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    reply = story.hook("s-1", HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"], subcommand="task")))
    process = story.container.get(Queries).query(Process).newest().first()
    story.container.get(OutputFolder).write_output(process.id, 1, "10 passed\n")
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        key = f"terminal-output.{reply.hook_call_id}"
        status, output = window_data(server, cookie, keys=key, window="agents.agents")
        story.expect_rows(status == 200, output["keys"][key]["code"] == 0, output["keys"][key]["value"]["lines"] == ["10 passed"], detail=str(output["keys"][key]))
