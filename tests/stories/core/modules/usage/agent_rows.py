import pytest
import json
from datetime import timedelta
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.agents.models.agent import UPGRADE_RETIREMENT_REASON
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, helper_agent, resumable_session
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.browser_story import expect_browser

from tests.stories.core.support.coding_fixtures import BuilderWithUser


def cards(story, state: str) -> list[dict[str, object]]:
    return json.loads(story.run(f"agent cards --environment main --show {state} --json", actor=story.user).output_text)["rows"]


def expect_card_order(story, state: str, *agent_ids: int) -> None:
    listed = [row["id"] for row in cards(story, state)]
    assert listed == list(agent_ids), listed


def expect_listed(story, state: str, *agent_ids: int) -> None:
    listed = {row["id"] for row in cards(story, state)}
    assert set(agent_ids) <= listed, listed


def expect_unlisted(story, *agent_ids: int) -> None:
    listed = {row["id"] for row in cards(story, "all")}
    assert not set(agent_ids) & listed, listed


def test_agent_rows_keep_creation_order_when_states_and_activity_change(new_story):
    story = new_story(fixture=BuilderWithUser)
    oldest = story.new_row_id("agent start oldest claude helper --environment main")
    story.advance(timedelta(seconds=1))
    middle = story.new_row_id("agent start middle codex worker --environment main")
    story.advance(timedelta(seconds=1))
    newest = story.new_row_id("agent start newest claude reviewer --environment main")
    story.run(f"agent end {middle}")
    story.run(f"agent edit {oldest} --paused-at {story.clock.timestamp().text}")
    expect_card_order(story, "all", oldest, middle, newest)
    expect_card_order(story, "running", oldest, newest)


def test_agent_rows_filter_search_and_page_before_answering(new_story):
    story = new_story(fixture=BuilderWithUser)
    for session in ("first", "second", "third"):
        story.run(f"agent start {session} claude helper --environment main")
        story.advance(timedelta(seconds=1))
    rows = json.loads(story.run("agent cards --environment main --show all --limit 1 --page 2 --json", actor=story.user).output_text)["rows"]
    expect_session_matching(rows, ["second"])
    matching_rows = json.loads(story.run("agent cards --environment main --search third --json", actor=story.user).output_text)["rows"]
    expect_session_matching(matching_rows, ["third"])


def test_agent_filters_leave_out_main_agents_and_include_finished_helpers(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-journal" / "helper-session.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text(json.dumps({"type": "assistant", "message": {"content": "The review is complete"}}) + "\n")
    story = new_story(fixture=BuilderWithUser)
    main = story.new_row_id("agent start main-session claude main --environment main")
    helper = story.new_row_id("agent start helper-session claude helper --environment main")
    reviewer = story.new_row_id("agent start review-session claude reviewer --environment main")
    worker = story.new_row_id("agent start worker-session codex worker --environment main")
    running_helper = story.new_row_id("agent start running-helper claude helper --environment main")
    running_worker = story.new_row_id("agent start running-worker codex worker --environment main")
    retired_main = story.new_row_id("agent start retired-main claude main --environment main")
    story.run(f"agent end {helper}")
    story.run(f"agent end {reviewer}")
    story.run(f"agent end {worker}")
    story.run(f"agent end {retired_main}")
    expect_listed(story, "running", running_helper, running_worker)
    expect_listed(story, "idle", helper, reviewer, worker)
    story.expect_success(f'agent retire {worker} --reason "Its work is finished"', actor=story.user)
    expect_listed(story, "retired", worker)
    expect_listed(story, "all", helper, reviewer, worker, running_helper, running_worker)
    expect_unlisted(story, main, retired_main)
    states = {row["id"]: row["state"] for row in cards(story, "all")}
    expect_states_2(states, helper, "idle")
    expect_states_2(states, worker, "retired")
    story.expect_text(f"agent transcript {helper}", "The review is complete", actor=story.user)
    story.expect_text(f"agent transcript {helper} --before-id 2", "The review is complete", actor=story.user)


def expect_states_2(states, worker, expected) -> None:
    actual = states[worker]
    assert actual == expected, actual


def expect_session_matching(matching_rows, expected) -> None:
    actual = [row['session'] for row in matching_rows]
    assert actual == expected, actual


class AgentsWithStates(StoryFixture):
    parent = EndedHelper

    def steps(self, story):
        story.expect_success("setting set journal.core.viewer.tour-completed true --project", actor=story.user)
        story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=story.user)
        worker = story.new_row_id(f"agent start idle-worker codex worker --parent {story.agent.id} --environment main")
        story.expect_success('worker report "The worker found a repeated calculation."', actor=Actor(worker, ActorType.AGENT))
        story.expect_success(f"agent end {worker}", actor=story.user)
        retired = story.new_row_id("agent start retired-reviewer claude reviewer --environment main")
        story.expect_success(f"agent end {retired}", actor=story.user)
        story.expect_success(f'agent retire {retired} --reason "{UPGRADE_RETIREMENT_REASON}"', actor=story.user)
        story.expect_success("agent start working-reviewer claude reviewer --environment main")


@pytest.fixture
def agents_window_server(new_story):
    story = new_story(fixture=AgentsWithStates)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        yield server, cookie


def test_agent_tabs_read_working_idle_and_retired_through_the_viewer(agents_window_server, monkeypatch):
    server, cookie = agents_window_server
    helper = helper_agent(server.story)
    resumable_session(server.story, helper, monkeypatch)
    def read(*arguments):
        return server.viewer_line_value(cookie, {"window": "agents.agents", "environment": "main", "line": ["agent", "cards", *arguments]})
    options = read("--options")
    server.story.expect_rows([state["label"] for state in options["states"]] == ["Working", "Idle", "Retired", "All"])
    server.story.expect_rows(options["upgrade_retired"] == 1)
    working = read("--show", "running")["rows"]
    server.story.expect_rows([row["session"] for row in working] == ["working-reviewer"])
    idle = read("--show", "idle")["rows"]
    server.story.expect_rows({row["role"] for row in idle} == {"helper", "worker"})
    helper_row = next(row for row in idle if row["id"] == helper.id)
    server.story.expect_rows(helper_row["resume_reason"] is None)
    server.story.expect_rows(isinstance(helper_row["facts"]["tasks"], list))
    server.story.expect_rows(helper_row["facts"]["helper_job"] == "Read src/cart.py")
    server.story.expect_rows(helper_row["facts"]["profile_title"] == "Researcher")
    server.story.expect_rows(helper_row["facts"]["job_returned"])
    server.story.expect_rows("cannot resume" in next(row for row in idle if row["role"] == "worker")["resume_reason"])
    server.story.expect_rows(next(row for row in idle if row["role"] == "worker")["facts"]["job_returned"] == "The worker found a repeated calculation.")
    retired = read("--show", "retired")["rows"]
    server.story.expect_rows(len(retired) == 1 and retired[0]["retirement_reason"] == UPGRADE_RETIREMENT_REASON)
    server.story.expect_rows(retired[0]["retired_at"] and retired[0]["state"] == "retired")
    server.story.expect_rows(len(read("--show", "all")["rows"]) == 4)


def test_agent_tabs_keep_old_agents_details_on_later_pages(agents_window_server):
    server, cookie = agents_window_server
    story = server.story
    helper = helper_agent(story)
    for number in range(51):
        agent = story.new_row_id(f"agent start later-{number} claude reviewer --environment main")
        story.expect_success(f"agent end {agent}", actor=story.user)
    answer = server.viewer_line_value(cookie, {"window": "agents.agents", "environment": "main", "line": ["agent", "cards", "--show", "all", "--limit", "1"]})
    row = answer["rows"][0]
    server.story.expect_rows(row["id"] == helper.id and answer["total"] == 55)
    server.story.expect_rows(row["facts"]["given_name"] and row["facts"]["profile_title"] == "Researcher")
    server.story.expect_rows(row["facts"]["helper_job"] == "Read src/cart.py" and row["facts"]["job_returned"])


def test_agent_tabs_in_light_and_dark(agents_window_server):
    server, _ = agents_window_server
    expect_browser(server, "agentStates.browser.mjs", [str(helper_agent(server.story).id), "/tmp/worker-675-agent-states"])


@pytest.mark.parametrize(("role", "job_enabled"), [("worker", True), ("main", False), ("helper", False)])
def test_the_suite_selects_which_agent_cards_show_their_job(new_story, role, job_enabled):
    story = new_story(fixture=BuilderWithUser)
    agent_id = story.new_row_id(f"agent start policy-session codex {role} --environment main")
    rows = json.loads(story.run("usage agents --environment main --json", actor=story.user).output_text)["rows"]
    facts = next(row for row in rows if row["id"] == agent_id)
    story.expect_rows(facts["job_enabled"] is job_enabled)


def test_agent_card_filters_combine_before_paging(new_story):
    story = new_story(fixture=BuilderWithUser)
    worker = story.new_row_id("agent start filter-worker codex worker --environment main")
    story.new_row_id("agent start filter-helper claude helper --environment main")
    rows = json.loads(story.run("agent cards --environment main --show all --role worker --program codex --limit 1 --json", actor=story.user).output_text)
    story.expect_rows([row["id"] for row in rows["rows"]] == [worker], rows["total"] == 1)
    options = json.loads(story.run("agent cards --options --environment main --json", actor=story.user).output_text)
    story.expect_rows("worker" in options["roles"], "helper" in options["roles"])
    main = json.loads(story.run("agent cards --include-main --role main --show all --environment main --json", actor=story.user).output_text)
    story.expect_rows(any(row["id"] == story.agent.id for row in main["rows"]))
