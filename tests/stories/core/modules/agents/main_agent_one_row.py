import json

import pytest

from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.engine.driver.support.hook_agents import hook_agent

REPLACED_REPLY = "A newer session of agent 1 replaced this one"
REPLACED_REASON = "replaced_by_person"
MEMORY_TEXT = "The till is counted every evening"
CLEAR_START = HookSamples.session_start().with_raw({"source": "clear"})


def main_rows(story) -> list[dict]:
    return json.loads(story.run("agent list --role main --environment main --json", actor=story.user).output_text)["rows"]


def expect_single_main_row(story) -> None:
    rows = main_rows(story)
    story.expect_rows([(row["id"], row["number"]) for row in rows] == [(story.agent.id, 1)], detail=str(rows))


@pytest.fixture
def main_with_memory(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=story.agent)
    return story


def test_a_new_claude_session_of_a_person_is_agent_one_on_the_same_row_with_its_memories(main_with_memory):
    story = main_with_memory
    started = hook_agent(story, story.hook("s-2", HookSamples.session_start()))
    story.expect_rows(started.id == story.agent.id)
    expect_single_main_row(story)
    story.expect_text("memory list", MEMORY_TEXT, actor=started)


def test_a_codex_session_takes_agent_one_over_from_claude_and_the_claude_session_is_marked_replaced(new_story):
    story = new_story(fixture=UserBuilder)
    story.hook("s-2", HookSamples.session_start().with_fields(program="codex"))
    story.expect_text("agent show 1 --environment main", "program: codex", "session: s-2", actor=story.user)
    story.expect_text("agent sessions 1 --environment main", "s-1", "claude", REPLACED_REASON, actor=story.user)


def test_a_second_main_session_stops_the_first_and_is_agent_one(new_story):
    story = new_story(fixture=UserBuilder)
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"stopped\n")
    started_id = story.new_row_id("agent start s-2 claude main --environment main", actor=story.user)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(started_id == story.agent.id, any(request.get("stop") for request in launcher.requests), detail=str(launcher.requests))
    expect_single_main_row(story)
    story.expect_text("agent sessions 1 --environment main", "s-1", REPLACED_REASON, actor=story.user)


def test_the_old_terminal_of_a_replaced_session_is_answered_replaced_and_makes_no_agent(new_story):
    story = new_story(fixture=UserBuilder)
    story.hook("s-2", HookSamples.session_start())
    story.expect_hook_refusal("s-1", HookSamples.edit("a.py"), REPLACED_REPLY)
    expect_single_main_row(story)
    story.expect_text("agent show 1 --environment main", "session: s-2", actor=story.user)


def test_a_worker_that_starts_a_main_beside_the_running_one_is_refused_and_nothing_changes(new_story):
    story = new_story(fixture=UserBuilder)
    worker = Actor(story.new_row_id(f"agent start w-1 claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_refusal("agent start s-9 claude main --environment main", "an agent does not replace it", actor=worker)
    expect_single_main_row(story)
    story.expect_text("agent show 1 --environment main", "session: s-1", actor=story.user)


def test_a_clear_in_the_main_session_keeps_agent_one_and_its_session(new_story):
    story = new_story(fixture=UserBuilder)
    cleared = hook_agent(story, story.hook("s-1", CLEAR_START))
    story.expect_rows(cleared.id == story.agent.id)
    story.expect_absent("agent sessions 1 --environment main", REPLACED_REASON, actor=story.user)
    story.expect_text("agent show 1 --environment main", "session: s-1", actor=story.user)
    expect_single_main_row(story)


def test_of_two_terminals_started_within_seconds_the_last_is_agent_one_and_neither_makes_agent_two(new_story):
    story = new_story(fixture=UserBuilder)
    story.hook("s-2", HookSamples.session_start())
    last = hook_agent(story, story.hook("s-3", HookSamples.session_start()))
    story.expect_rows(last.id == story.agent.id)
    expect_single_main_row(story)
    story.expect_hook_refusal("s-2", HookSamples.edit("a.py"), REPLACED_REPLY)
    story.expect_text("agent sessions 1 --environment main", "s-2", REPLACED_REASON, actor=story.user)
