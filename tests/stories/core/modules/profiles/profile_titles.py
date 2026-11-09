from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder, UserBuilder
from tests.stories.server.support.server_client import server_story


def test_a_person_saves_and_reads_a_profile_title_through_the_viewer(new_story):
    story = new_story(fixture=UserBuilder)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        window = "profiles.profiles"
        def line(*parts):
            return server.viewer_line_value(cookie, {"window": window, "environment": "main", "line": list(parts)})
        line("profile", "save", "critic", "--title", "Critic", "--description", "Reads", "--body", "Read.")
        rows = line("profile", "list")["rows"]
        story.expect_rows(next(row for row in rows if row["name"] == "critic")["title"] == "Critic")
        line("profile", "save", "critic", "--title", "Reviewer", "--description", "Reads", "--body", "Read.")
        rows = line("profile", "list")["rows"]
        story.expect_rows(next(row for row in rows if row["name"] == "critic")["title"] == "Reviewer")


def test_agent_facts_and_filter_options_show_profile_titles_through_the_viewer(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.run('actor make user "Ada"')
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.run('helper start journal-researcher --model sonnet --name "Madame Curie" --brief "Read the cart" --environment main', actor=story.agent)
    launcher.server.close()
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        def line(*parts):
            return server.viewer_line_value(cookie, {"window": "agents.agents", "environment": "main", "line": list(parts)})
        facts = line("usage", "agents", "--closed")["rows"]
        story.expect_rows(next(row for row in facts if row["profile"] == "journal-researcher")["profile_title"] == "Researcher")
        options = line("agent", "cards", "--options")
        story.expect_rows({"name": "journal-researcher", "title": "Researcher"} in options["profiles"])


def test_agents_window_picture(new_story):
    from pathlib import Path
    from core.base.driver.command_category import CommandCategory
    from core.testing.hook_samples import HookSamples
    from core.testing.shell_part import ShellPart
    from tests.stories.server.support.browser_story import expect_browser

    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    worker = story.new_row_id(f"agent start filter-worker codex worker --parent {story.agent.id} --environment main")
    story.new_row_id(f"agent start filter-helper claude helper --parent {story.agent.id} --environment main")
    story.expect_hook_allowed("filter-worker", HookSamples.shell("ls worker", ShellPart("ls", CommandCategory.READ, ["worker"])))
    story.expect_hook_allowed("filter-helper", HookSamples.shell("ls helper", ShellPart("ls", CommandCategory.READ, ["helper"])))
    folder = Path("/tmp/pictures-profile-title")
    folder.mkdir(exist_ok=True)
    with server_story(story) as server:
        expect_browser(server, "agentFilters.browser.mjs", [str(worker), str(folder / "agents")])
