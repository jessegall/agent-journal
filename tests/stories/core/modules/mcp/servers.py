import json
import stat
import tomllib
from pathlib import Path

from core.base.provider.launch import Launch
from core.base.provider.providers import Providers
from core.base.provider.session_start import SessionStart
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.modules.secrets.support.secret_fixtures import ServersInstalled
from tests.stories.core.support.fixtures import UserJoined

__all__ = ["private_folder"]

KEY = "ghp_story_5e4d3c2b1a"
GITHUB_VARIABLE = "GITHUB_PERSONAL_ACCESS_TOKEN"


def claude_file(story) -> Path:
    return story.home.project_folder / ".mcp.json"


def codex_file(story) -> Path:
    return story.home.project_folder / ".codex" / "config.toml"


def installed_story(new_story, *names: str):
    story = new_story(fixture=UserJoined)
    for name in names:
        story.expect_success(f"mcp install {name}", actor=story.user)
    return story


def test_the_suggested_servers_are_listed_with_how_each_is_let_in(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("mcp suggested", f"github  GitHub: Repositories, issues and pull requests. (key: {GITHUB_VARIABLE})",
                      "linear  Linear: Issues, projects and cycles in Linear. (signs in on its own)", actor=story.agent)


def test_a_name_the_catalogue_lacks_is_refused_with_where_the_names_are(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("mcp install nope", "no suggested server is named nope: journal mcp suggested lists them", actor=story.user)


def test_an_installed_server_appears_in_the_mcp_json_with_its_key_only_as_a_variable(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("mcp install github", "installed github: it needs its key, journal mcp key github <value>", actor=story.user)
    servers = json.loads(claude_file(story).read_text())["mcpServers"]
    story.expect_rows(servers["github"] == {"command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "env": {GITHUB_VARIABLE: f"${{{GITHUB_VARIABLE}}}"}})


def test_an_installed_server_appears_in_the_codex_config_naming_its_key_variable(new_story):
    story = installed_story(new_story, "linear", "github")
    servers = tomllib.loads(codex_file(story).read_text())["mcp_servers"]
    story.expect_rows(servers["github"] == {"command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "env_vars": [GITHUB_VARIABLE]},
                      servers["linear"] == {"url": "https://mcp.linear.app/mcp"})


def test_a_server_reached_over_http_is_written_with_its_address(new_story):
    story = installed_story(new_story, "linear")
    story.expect_rows(json.loads(claude_file(story).read_text())["mcpServers"]["linear"] == {"type": "http", "url": "https://mcp.linear.app/mcp"})


def test_the_servers_and_settings_the_project_had_stay_beside_the_journals(new_story):
    story = new_story(fixture=UserJoined)
    claude_file(story).write_text(json.dumps({"mcpServers": {"mine": {"command": "my-server"}}}))
    codex_file(story).parent.mkdir(parents=True, exist_ok=True)
    codex_file(story).write_text('model = "gpt-5"\n')
    story.expect_success("mcp install linear", actor=story.user)
    story.expect_rows(json.loads(claude_file(story).read_text())["mcpServers"]["mine"] == {"command": "my-server"},
                      tomllib.loads(codex_file(story).read_text())["model"] == "gpt-5")


def test_an_older_table_of_a_server_gives_way_to_the_journals_so_codex_can_read_the_file(new_story):
    story = new_story(fixture=UserJoined)
    codex_file(story).parent.mkdir(parents=True, exist_ok=True)
    older = "# Written by the journal: edit it on the viewer's MCP page.\n[mcp_servers.linear]\nurl = \"https://old.example\"\n\n[mcp_servers.mine]\ncommand = \"my-server\"\n"
    codex_file(story).write_text(older)
    story.expect_success("mcp install linear", actor=story.user)
    servers = tomllib.loads(codex_file(story).read_text())["mcp_servers"]
    story.expect_rows(servers["linear"] == {"url": "https://mcp.linear.app/mcp"}, servers["mine"] == {"command": "my-server"})


def test_a_server_installed_already_is_refused(new_story):
    story = installed_story(new_story, "github")
    story.expect_refusal("mcp install github", "github is installed already: journal mcp list shows it", actor=story.user)


def test_a_key_is_kept_outside_the_project_and_never_in_a_row(new_story, private_folder):
    story = new_story(fixture=ServersInstalled)
    story.expect_success(f"mcp key github {KEY}", "key kept for github, outside the project", actor=story.user)
    keys_file = next(private_folder.glob("*.keys.json"))
    story.expect_rows(json.loads(keys_file.read_text()) == {GITHUB_VARIABLE: KEY}, stat.S_IMODE(keys_file.stat().st_mode) == 0o600,
                      KEY.encode() not in story.home.database.read_bytes())


def test_a_key_for_a_server_that_signs_in_a_blank_key_and_a_server_not_installed_are_refused(new_story):
    story = new_story(fixture=ServersInstalled)
    story.expect_refusal("mcp key linear abc", "linear signs in on its own and takes no key", actor=story.user)
    story.expect_refusal('mcp key github " "', "the key for GitHub is blank", actor=story.user)
    story.expect_refusal(f"mcp key slack {KEY}", "no installed server is named slack: journal mcp list shows them", actor=story.user)


def test_the_list_says_how_each_server_stands(new_story):
    story = new_story(fixture=ServersInstalled)
    story.expect_text("mcp list", "github  needs its key  GitHub", "linear  signs in on its own  Linear", "context7  ready  Context7", actor=story.agent)
    story.expect_success(f"mcp key github {KEY}", actor=story.user)
    story.expect_text("mcp list", "github  ready  GitHub", actor=story.agent)


def test_a_removed_server_leaves_both_configs_and_its_key_is_dropped(new_story, private_folder):
    story = installed_story(new_story, "github", "context7")
    story.expect_success(f"mcp key github {KEY}", actor=story.user)
    story.expect_success("mcp remove github", "removed github", actor=story.user)
    story.expect_rows("github" not in json.loads(claude_file(story).read_text())["mcpServers"],
                      "github" not in tomllib.loads(codex_file(story).read_text())["mcp_servers"],
                      json.loads(next(private_folder.glob("*.keys.json")).read_text()) == {})
    story.expect_refusal("mcp remove github", "no installed server is named github", actor=story.user)


def test_the_check_names_what_each_server_still_needs_and_where_it_is_written(new_story):
    story = installed_story(new_story, "github", "linear")
    story.expect_text("mcp check", "github  needs its key: journal mcp key github <value>", "linear  written in .mcp.json and .codex/config.toml", actor=story.agent)
    claude_file(story).write_text("{}")
    story.expect_text("mcp check", "linear  missing from .mcp.json: journal mcp remove linear, then journal mcp install linear", actor=story.agent)


def test_the_real_key_is_given_to_the_agent_program_at_its_launch(new_story):
    story = new_story(fixture=ServersInstalled)
    story.expect_success(f"mcp key github {KEY}", actor=story.user)
    launch = Launch(story.home.project_folder, story.home.project_folder, "sonnet", "", SessionStart("s-9"), {})
    providers = story.container.get(Providers)
    story.expect_rows(providers.provider("claude").session_command(launch).variables[GITHUB_VARIABLE] == KEY,
                      providers.provider("codex").session_command(launch).variables[GITHUB_VARIABLE] == KEY)


def test_a_row_write_holding_a_server_key_is_refused(new_story):
    story = new_story(fixture=ServersInstalled)
    story.expect_success(f"mcp key github {KEY}", actor=story.user)
    story.expect_refusal(f'message send "the token is {KEY}" --environment main', f"a row may not hold the value of {GITHUB_VARIABLE}", actor=story.agent)


def test_a_server_added_by_its_address_is_reached_over_http(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("mcp add shop https://mcp.shop.example/mcp", "added shop", actor=story.user)
    story.expect_rows(json.loads(claude_file(story).read_text())["mcpServers"]["shop"] == {"type": "http", "url": "https://mcp.shop.example/mcp"})
    story.expect_text("mcp list", "shop  ready  shop", actor=story.user)


def test_a_server_added_by_its_command_is_started_with_its_arguments(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('mcp add shop "npx -y shop-server --quiet"', actor=story.user)
    story.expect_rows(json.loads(claude_file(story).read_text())["mcpServers"]["shop"] == {"command": "npx", "args": ["-y", "shop-server", "--quiet"]})


def test_an_added_server_needs_a_usable_name_a_new_name_and_a_target(new_story):
    story = installed_story(new_story, "linear")
    story.expect_refusal("mcp add linear https://other.example", "linear is installed already", actor=story.user)
    story.expect_refusal('mcp add "Bad Name" https://other.example', "Bad Name cannot name a server", actor=story.user)
    story.expect_refusal('mcp add shop " "', "give the server's address", actor=story.user)
    story.expect_refusal("mcp add shop https://other.example", "only a person adds a server", actor=story.agent)


def test_an_added_server_comes_off_like_any_other(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("mcp add shop https://mcp.shop.example/mcp", actor=story.user)
    story.expect_success("mcp remove shop", actor=story.user)
    story.expect_rows("shop" not in json.loads(claude_file(story).read_text())["mcpServers"])

