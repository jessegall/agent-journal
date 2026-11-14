import json
import stat
import tomllib
from pathlib import Path

from engine.provider.launch import Launch
from engine.provider.providers import Providers
from engine.provider.session_start import SessionStart
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


def installed_story(played, *names: str):
    story = played(UserJoined)
    for name in names:
        story.expect_success(f"mcp install {name}", actor=story.user)
    return story








def test_a_key_is_kept_outside_the_project_and_never_in_a_row(played, private_folder):
    story = played(ServersInstalled)
    story.expect_success(f"mcp key github {KEY}", "key kept for github, outside the project", actor=story.user)
    keys_file = next(private_folder.glob("*.keys.json"))
    story.expect_rows(json.loads(keys_file.read_text()) == {GITHUB_VARIABLE: KEY}, stat.S_IMODE(keys_file.stat().st_mode) == 0o600,
                      KEY.encode() not in story.home.database.read_bytes())










def test_the_real_key_is_given_to_the_agent_program_at_its_launch(played):
    story = played(ServersInstalled)
    story.expect_success(f"mcp key github {KEY}", actor=story.user)
    launch = Launch(story.home.project_folder, story.home.project_folder, "sonnet", "", SessionStart("s-9"), {})
    providers = story.container.get(Providers)
    story.expect_rows(providers.provider("claude").session_command(launch).variables[GITHUB_VARIABLE] == KEY,
                      providers.provider("codex").session_command(launch).variables[GITHUB_VARIABLE] == KEY)








