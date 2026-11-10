from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.expect_reply import expect_absent_reply_line, expect_absent_reply_refusal, expect_reply_line, expect_reply_refusal
from core.testing.expect_row import expect_row
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.messages.delivery import KeptTyping, READ_MESSAGE_HOOK
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.support.story_checks import expect_value

READ = HookSamples.shell("cat cart.py", ShellPart("cat", CommandCategory.READ, ["cart.py"]))


class TargetedSession(StoryFixture):
    parent = OpenTaskOrchestrator

    def steps(self, story):
        install_runner(story)
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
        repository_environment(story)
        story.worker = dispatched_worker(story)
        story.worker_session = worker_session(story, story.worker)
        story.helper = Actor(story.new_row_id(f"agent start h-1 claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
        story.run("task overview 1", actor=story.worker)
        story.hook(story.worker_session, HookSamples.prompt("Work"))
        story.hook("h-1", HookSamples.prompt("Read"))
        story.hook("s-1", HookSamples.prompt("[journal] coordinate"))

    def expect(self, story):
        agents = story.container.get(Queries).query(Agent)
        worker = next(iter(agents.filter(role="worker").all_rows()))
        story.worker = Actor(worker.id, ActorType.AGENT)
        story.worker_session = worker.session
        helper = next(iter(agents.filter(session="h-1").all_rows()))
        story.helper = Actor(helper.id, ActorType.AGENT)


class UserEnvironment(StoryFixture):
    parent = MainEnvironment

    def steps(self, story):
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)


@pytest.fixture
def targeted_chat(new_story, monkeypatch):
    story = new_story(fixture=TargetedSession)
    TargetedSession().expect(story)
    install_runner(story)
    typing = KeptTyping()
    monkeypatch.setattr(TerminalTyping, "type_line", typing.type_line)
    with server_story(story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        yield server, cookie, typing


def post_target(server, cookie, target, text):
    return server.viewer_line_value(cookie, {"window": "agents.transcript", "environment": "main", "line": ["message", "send", text, "--target-agent", str(target.id)]})


@pytest.mark.parametrize("role", ["worker", "helper"])
def test_a_message_wakes_its_idle_target(targeted_chat, role):
    server, cookie, typing = targeted_chat
    story = server.story
    story.advance(timedelta(seconds=31))
    target = getattr(story, role)
    message = post_target(server, cookie, target, f"Continue the {role} job")
    story.run_listeners()
    expect_row(typing, typed=[(target.id, f"[journal] new message {message['id']}")])


def test_main_ignores_a_workers_unread_message_and_its_limit(targeted_chat):
    server, cookie, typing = targeted_chat
    story = server.story
    post_target(server, cookie, story.worker, "Check the worker output")
    expect_absent_reply_refusal(story.hook("s-1", HookSamples.stop()), "message 1 is unread")
    expect_reply_refusal(story.hook(story.worker_session, HookSamples.stop()), "message 1 is unread")
    story.hook("s-1", READ)
    story.hook(story.worker_session, READ)
    story.expect_text("process show 1", "limit_seconds: 15")
    story.expect_text("process show 2", "limit_seconds: 10")


def test_a_main_message_leaves_the_worker_limit_unchanged(targeted_chat):
    server, cookie, typing = targeted_chat
    story = server.story
    post_target(server, cookie, story.agent, "Main should answer this")
    expect_absent_reply_line(story.hook(story.worker_session, READ), "new message")
    story.hook("s-1", READ)
    story.expect_text("process show 1", "limit_seconds: 15")
    story.expect_text("process show 2", "limit_seconds: 10")


def test_a_worker_reads_only_its_messages(targeted_chat):
    server, cookie, typing = targeted_chat
    story = server.story
    post_target(server, cookie, story.worker, "Read the worker message")
    post_target(server, cookie, story.agent, "Read the main message")
    story.expect_text("message unread --environment main", "Read the worker message", actor=story.worker)
    story.expect_absent("message unread --environment main", "Read the main message", actor=story.worker)
    expect_absent_reply_line(story.hook("s-1", READ), "new message 1")


def test_a_workers_message_moves_only_its_foreground_run(targeted_chat):
    server, cookie, typing = targeted_chat
    story = server.story
    story.hook("s-1", READ)
    story.hook(story.worker_session, READ)
    post_target(server, cookie, story.worker, "Interrupt the worker command")
    story.run_listeners()
    folder = story.container.get(OutputFolder)
    expect_value(folder.text(1, "move"), "")
    expect_value(folder.text(2, "move"), "1")


def test_main_chat_hides_worker_messages(targeted_chat):
    server, cookie, typing = targeted_chat
    post_target(server, cookie, server.story.worker, "Only in the worker conversation")
    visible = server.viewer_line_value(cookie, {"window": "messages.chat", "environment": "main", "line": ["message", "feed"]})
    expect_value(visible["rows"], [])


def test_a_message_without_a_running_target_waits_for_main(new_story):
    story = new_story(fixture=UserEnvironment)
    with server_story(story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        message = server.viewer_line_value(cookie, {"window": "messages.chat", "environment": "main", "line": ["message", "send", "Read after main starts"]})
        expect_value(message["target_agent_id"], None)
    expect_reply_line(story.hook("s-1", HookSamples.session_start()), "new message 1")


def test_a_read_message_edit_wakes_the_same_worker(targeted_chat):
    server, cookie, typing = targeted_chat
    story = server.story
    post_target(server, cookie, story.worker, "Worker text before editing")
    story.run("message read 1", actor=story.worker)
    story.hook(story.worker_session, READ_MESSAGE_HOOK)
    story.advance(timedelta(seconds=31))
    server.viewer_line_value(cookie, {"window": "messages.chat", "environment": "main", "line": ["message", "edit", "1", "--text", "Worker text after editing"]})
    story.run_listeners()
    expect_row(typing, typed=[(story.worker.id, "[journal] message:1 updated")])
