import json

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.modules.helpers.helper_reports import LINES, helper_report, stop_with_report
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.engine.driver.support.hook_agents import hook_agent

MEMORY_TEXT = "The till is counted every evening"
MEMORIES_LINE = "1 memories to read: load the memory skill as directed, then list them"
TEST_ENVIRONMENT = "environment make story-engine /work/story-engine --test --test-agent-id {agent}"
FAKE_START = "agent start s-9 claude main --environment story-engine"


def new_main_session(story, session: str):
    return hook_agent(story, story.hook(session, HookSamples.session_start()))


def granted_agent_id(story) -> int:
    return json.loads(story.run("environment show 2 --json", actor=story.user).output_text)["test_agent_id"]


def test_agent_one_between_sessions_shows_as_ended_cannot_be_retired_and_keeps_its_memories(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=story.agent)
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    story.expect_text("agent show 1 --environment main", "ended_at: 20", actor=story.user)
    story.expect_refusal('agent retire 1 --reason "No longer needed" --environment main', "main agent", actor=story.user)
    story.expect_text("memory list", MEMORY_TEXT, actor=story.agent)


def test_a_new_main_session_is_given_the_memories_agent_one_holds_also_those_given_before(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=story.agent)
    second = story.hook("s-2", HookSamples.session_start())
    third = story.hook("s-3", HookSamples.session_start())
    story.expect_rows(MEMORIES_LINE in second.lines, MEMORIES_LINE in third.lines, hook_agent(story, third).id == story.agent.id, detail=str(third.lines))
    story.expect_text("memory list", MEMORY_TEXT, actor=hook_agent(story, third))


def test_a_helper_of_agent_one_keeps_its_parent_and_its_report_reaches_the_new_session(new_story):
    story = new_story(fixture=StartedHelper)
    session_agent = new_main_session(story, "s-2")
    story.expect_rows(session_agent.id == story.agent.id, helper_agent(story).parent_id == story.agent.id)
    story.hook(helper_agent(story).session, stop_with_report("The cart adds tax twice."))
    story.expect_text(LINES.format(agent=story.agent.id), f"reported in message:{helper_report(story).id}")
    story.expect_text(f"message read {helper_report(story).id}", "The cart adds tax twice.", actor=session_agent)


def test_a_task_delegated_to_agent_one_stays_delegated_after_a_new_main_session(new_story):
    story = new_story(fixture=UserBuilder)
    task = story.new_row_id('task make "Count the till" --brief "Count it and say the sum" --environment main', actor=story.user)
    story.expect_success(f"task assign {task} --to 1 --environment main", actor=story.user)
    delegated = story.run(f"task info {task} --environment main", actor=story.user).output_text
    session_agent = new_main_session(story, "s-2")
    story.expect_rows(session_agent.id == story.agent.id, story.run(f"task info {task} --environment main", actor=story.user).output_text == delegated, detail=delegated)


def test_the_grant_of_a_test_environment_names_agent_one_after_a_new_main_session(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(TEST_ENVIRONMENT.format(agent=story.agent.id), actor=story.user)
    session_agent = new_main_session(story, "s-2")
    story.expect_rows(granted_agent_id(story) == session_agent.id, session_agent.id == story.agent.id)
    story.expect_success(FAKE_START, "role: main", "environment_id: 2", actor=session_agent)


def test_a_main_takeover_by_a_person_leaves_the_grant_as_it_is(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(TEST_ENVIRONMENT.format(agent=story.agent.id), actor=story.user)
    story.expect_success("agent start s-2 claude main --environment main", actor=story.user)
    story.expect_rows(granted_agent_id(story) == story.agent.id)
    story.expect_text("agent show 1 --environment main", "session: s-2", actor=story.user)
    story.expect_success(FAKE_START, "role: main", "environment_id: 2", actor=story.agent)
