import socket

from core.modules.agents.agents_module import AgentsModule
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.support.fixtures import UserJoined

SLEEP_SECONDS = 300


class FakeTyping(TerminalTyping):
    """Keeps what would be typed, so a story reaches no launcher."""

    def __init__(self) -> None:
        self.typed: list[tuple[int, str]] = []

    def send_line(self, agent_id: int, line: str) -> None:
        self.typed.append((agent_id, line))


def typing_story(new_story):
    story = new_story(fixture=UserJoined)
    typing = FakeTyping()
    story.replace(TerminalTyping, typing)
    return story, typing


def missing_launcher(story) -> None:
    return None


def stale_launcher_socket(story) -> None:
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as stale_socket:
        stale_socket.bind(str(story.home.socket("launcher")))


def different_program_launcher(story) -> None:
    FakeLauncher.accepting(story.home.socket("launcher"))


def launch_settings_handed(story, program: str, request: dict) -> bool:
    programs = story.home.project_folder / ".journal" / "programs"
    if program == "codex":
        return request["variables"]["CODEX_HOME"] == str(programs / "codex")
    return request["command"][1:5] == ["--settings", str(programs / "claude" / "settings.json"), "--setting-sources", "project"]


def expect_events_agents_declared_with(declared, expected) -> None:
    actual = declared['agents.agents'].events
    assert expected in actual, actual


def expect_events_agents_helpers_with(declared, expected) -> None:
    actual = declared['agents.helpers'].events
    assert expected in actual, actual


def expect_choices_groups_with(groups, expected) -> None:
    actual = groups[0]['choices']
    assert expected in actual, actual


def expect_key_group_groups(groups, expected) -> None:
    actual = [group['key'] for group in groups]
    assert actual == expected, actual


def test_the_agent_windows_hear_task_changes_so_their_cards_update_without_a_refresh():
    declared = {window.name: window for window in AgentsModule.window_declarations()}
    expect_events_agents_declared_with(declared, "task.*")
    expect_events_agents_helpers_with(declared, "task.*")
