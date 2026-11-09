from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE
from core.modules.agents.agents_module import AgentsModule
import json
import socket
import subprocess

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.leftover_process import LeftoverProcess
from core.modules.agents.support.terminal_typing import TerminalTyping
from tests.stories.core.support.fixtures import UserJoined
from core.testing.fake_launcher import FakeLauncher
from tests.stories.support.story_checks import expect_value, expect_value_with

SLEEP_SECONDS = 300


class FakeTyping(TerminalTyping):
    """Keeps what would be typed, so a story reaches no launcher."""

    def __init__(self) -> None:
        self.typed: list[tuple[int, str]] = []

    def type_line(self, agent_id: int, line: str) -> None:
        self.typed.append((agent_id, line))


def typing_story(new_story):
    story = new_story(fixture=UserJoined)
    typing = FakeTyping()
    story.container.bind(TerminalTyping, typing)
    return story, typing


def test_the_controls_list_the_programs_choices_without_their_lines(new_story):
    story, _ = typing_story(new_story)
    groups = json.loads(story.run(f"agent controls {story.agent.id} --json", actor=story.user).output_text)["groups"]
    expect_key_group_groups(groups, ["model", "effort", "context"])
    expect_choices_groups_with(groups, {"value": "opus", "label": "Opus"})


def test_a_choice_types_the_programs_own_line(new_story):
    story, typing = typing_story(new_story)
    story.expect_success(f"agent control {story.agent.id} model opus", f"applied to agent {story.agent.id}", actor=story.user)
    story.expect_success(f"agent control {story.agent.id} effort high", actor=story.user)
    story.expect_success(f"agent control {story.agent.id} context compact", actor=story.user)
    story.expect_rows(typing.typed == [(story.agent.id, "/model opus"), (story.agent.id, "/effort high"), (story.agent.id, COMPACT_LINE)])


def test_a_choice_the_program_does_not_offer_and_an_ended_agent_are_refused(new_story):
    story, typing = typing_story(new_story)
    story.expect_refusal(f"agent control {story.agent.id} model nope", "model nope is not a choice", actor=story.user)
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    story.expect_refusal(f"agent control {story.agent.id} model opus", "has ended", actor=story.user)
    story.expect_rows(typing.typed == [])


def test_the_programs_are_listed_by_name_and_title(new_story):
    story = new_story(fixture=UserJoined)
    rows = json.loads(story.run("agent programs --json", actor=story.user).output_text)["rows"]
    expect_value(bool(any(row["name"] == "claude" and row["title"] == "Claude Code" for row in rows)), True)


def test_stop_ends_the_program_under_the_agents_pid_and_its_session(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    fake = tmp_path / "claude"
    fake.write_text(f"#!/bin/sh\nsleep {SLEEP_SECONDS} &\ntrap 'kill $!; exit 0' TERM\nwait\n")
    fake.chmod(0o755)
    program = subprocess.Popen([str(fake)], start_new_session=True)
    try:
        agent_id = story.new_row_id(f"agent start s-stand-in claude worker --pid {program.pid} --environment main")
        story.expect_success(f"agent stop {agent_id}", f"stopped agent {agent_id}", actor=story.user)
        story.expect_rows(program.wait(timeout=10) is not None)
        story.expect_text(f"agent show {agent_id}", "ended_at:", actor=story.user)
    finally:
        program.kill()
        program.wait()


def test_stopping_holds_no_write_lock_and_a_session_its_hooks_ended_stays_ended(new_story, monkeypatch):
    story = new_story(fixture=UserJoined)
    database = story.container.get(Database)
    transaction_flags: list[bool] = []
    agent_id = story.new_row_id("agent start s-stopped claude worker --pid 4242 --environment main")

    def stopped(pid: int, program: str) -> bool:
        transaction_flags.append(database.has_transaction)
        story.expect_success(f"agent end {agent_id}", actor=Actor(agent_id, ActorType.AGENT))
        return True

    monkeypatch.setattr(LeftoverProcess, "stop", stopped)
    monkeypatch.setattr(LeftoverProcess, "command_line", staticmethod(lambda pid: "claude" if pid == 4242 and not transaction_flags else ""))
    story.expect_success(f"agent stop {agent_id}", f"stopped agent {agent_id}", actor=story.user)
    story.expect_rows(transaction_flags == [False])
    story.expect_text(f"agent show {agent_id}", "ended_at:", actor=story.user)


def missing_launcher(story) -> None:
    return None


def stale_launcher_socket(story) -> None:
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as stale_socket:
        stale_socket.bind(str(story.home.socket("launcher")))


def different_program_launcher(story) -> None:
    FakeLauncher.listening(story.home.socket("launcher"))


@pytest.fixture(params=[missing_launcher, stale_launcher_socket, different_program_launcher])
def stopped_main_agent(new_story, request):
    story = new_story(fixture=UserJoined)
    request.param(story)
    story.expect_success(f"agent stop {story.agent.id}", f"stopped agent {story.agent.id}", actor=story.user)
    return story


def test_a_main_with_no_process_and_no_launcher_that_answers_ends_when_stopped(stopped_main_agent):
    stopped_main_agent.expect_text(f"agent show {stopped_main_agent.agent.id}", "ended_at:", actor=stopped_main_agent.user)


def test_stopping_an_ended_agent_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    story.expect_refusal(f"agent stop {story.agent.id}", "has ended already", actor=story.user)


def test_launch_hands_the_launcher_the_program_in_the_environments_folder_under_a_new_agent_row(new_story):
    story = new_story(fixture=UserJoined)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_text("agent launch claude --environment main", "started agent", actor=story.user)
    launcher.drain_requests()
    request = launcher.requests[0]
    story.expect_rows(request["environment"] == "main", request["session"].startswith("launch-"), request["command"][0].endswith("claude"), request["variables"]["JOURNAL_LAUNCH"] == request["session"])


def test_launch_with_no_launcher_is_refused_and_keeps_no_row(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("agent launch claude --environment main", "no launcher is running here", actor=story.user)
    story.expect_absent("agent list --environment main", "launch-", actor=story.user)
    story.expect_refusal("agent launch claude --environment main", "an agent does not replace it", actor=story.agent)


def test_the_agent_windows_hear_task_changes_so_their_cards_update_without_a_refresh():
    declared = {window.name: window for window in AgentsModule.windows}
    expect_events_agents_declared_with(declared, "task.*")
    expect_events_agents_helpers_with(declared, "task.*")


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
