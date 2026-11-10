import json

import pytest

from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.documents.models.report import Report
from core.testing.fake_launcher import FakeLauncher
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.support.story_checks import expect_value

ROUNDS_WINDOW = "plan_reviews.rounds"
REPORT = 'report make "{title}" --abstract "What the review found" --body "Fine" --about plan:1 --environment main'
CRITIQUE_COMMAND = 'template send 1 --on=plan:1 --set=agents=2 --set=size="a normal read" --environment main'


class CritiquePlanReady(StoryFixture):
    """Plan 1, made by the main agent, is ready, and a person has a critique template."""

    parent = UserBuilder

    def steps(self, story) -> None:
        story.expect_success('template make "Read it" --brief "Say what is wrong" --applies-to plan --purpose critique', actor=story.user)
        story.expect_success('plan make "Cart plan" --environment main', actor=story.agent)
        story.expect_success("plan ready 1", actor=story.agent)

    def expect(self, story) -> None:
        story.expect_text("plan show 1", "state: ready")


@pytest.fixture
def rounds(new_story):
    with server_story(new_story(fixture=CritiquePlanReady), listener_thread_started=False) as server:
        yield server


@pytest.fixture
def cookie(rounds):
    return rounds.expect_viewer_login(rounds.viewer_key("Ada"))


def press(server, cookie, *line: str) -> None:
    server.viewer_line_value(cookie, {"window": "messages.chat", "line": list(line), "environment": "main"})


def request_critique(server, cookie) -> None:
    press(server, cookie, "template", "send", "1", "--on=plan:1", "--set=agents=2 agents", "--set=size=a normal read")


def file_report(server, title: str) -> int:
    server.story.expect_success(REPORT.format(title=title), actor=server.story.agent)
    server.story.run_listeners()
    return max(report.id for report in server.story.container.get(Queries).query(Report).all_rows())


class TwoFinishedRounds(StoryFixture):
    """Plan 1 had two critiques, each ended by a report filed by the main agent."""

    parent = CritiquePlanReady

    def steps(self, story) -> None:
        for title in ("First critique", "Second critique"):
            story.expect_success(CRITIQUE_COMMAND, actor=story.user)
            story.expect_success(REPORT.format(title=title), actor=story.agent)
            story.run_listeners()

    def expect(self, story) -> None:
        story.expect_text("plan show 1", "state: ready")


def read_rounds(server, cookie) -> list[dict]:
    return server.viewer_line_value(cookie, {"window": ROUNDS_WINDOW, "line": ["plan", "rounds", "1"], "environment": "main"})["rows"]


@pytest.fixture
def two_rounds(new_story):
    with server_story(new_story(fixture=TwoFinishedRounds), listener_thread_started=False) as server:
        yield server


def test_two_critiques_each_ended_by_a_report_show_as_two_rounds_with_their_reports(two_rounds):
    listed = read_rounds(two_rounds, two_rounds.expect_viewer_login(two_rounds.viewer_key("Ada")))
    reports = [report.id for report in two_rounds.story.container.get(Queries).query(Report).oldest().all_rows() if report.title.endswith("critique")]
    two_rounds.story.expect_rows([round_row["number"] for round_row in listed] == [1, 2],
                                 [[report["id"] for report in round_row["reports"]] for round_row in listed] == [[reports[0]], [reports[1]]],
                                 all(round_row["started_at"] and round_row["ended_at"] for round_row in listed))


def test_a_person_presses_request_critique_and_the_round_runs(rounds, cookie):
    request_critique(rounds, cookie)
    rounds.story.expect_text("plan show 1", "state: reviewing")
    rounds.story.expect_rows(len(read_rounds(rounds, cookie)) == 1)


def test_the_person_sees_two_rounds_newest_first_opens_a_report_and_ends_a_running_one(two_rounds, tmp_path):
    expect_browser(two_rounds, "inspectorSections.browser.mjs", ["rounds", str(two_rounds.socket_path), str(tmp_path / "review-rounds.png")])


def test_a_running_round_has_no_end_and_says_who_asked(rounds, cookie):
    request_critique(rounds, cookie)
    running = read_rounds(rounds, cookie)[0]
    rounds.story.expect_rows(running["ended_at"] is None, running["asked_by"] == rounds.story.user.id, running["reports"] == [])


def test_the_end_the_review_button_closes_the_round_with_no_report(rounds, cookie):
    request_critique(rounds, cookie)
    press(rounds, cookie, "plan", "reviewed", "1")
    ended = read_rounds(rounds, cookie)[0]
    rounds.story.expect_rows(ended["ended_at"] is not None, ended["reports"] == [])


def start_helper(story, brief: str) -> Agent:
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_success(f'helper start journal-researcher --brief "{brief}" --environment main', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    return max(story.container.get(Queries).query(Agent).filter(role="helper").all_rows(), key=lambda agent: agent.id)


def test_helpers_whose_brief_names_the_plan_in_the_round_are_its_reviewers(rounds, cookie):
    prior_helper = start_helper(rounds.story, "Give plan 1 a first read")
    rounds.story.expect_success(CRITIQUE_COMMAND, actor=rounds.story.user)
    selected_helpers = [start_helper(rounds.story, "Give plan 1 a thorough review"), start_helper(rounds.story, "Read plan:1 for risks")]
    start_helper(rounds.story, "Give plan 10 a thorough review")
    reviewers = read_rounds(rounds, cookie)[0]["reviewers"]
    expect_value(sorted(reviewer["agent_id"] for reviewer in reviewers), sorted(agent.id for agent in selected_helpers))
    rounds.story.expect_rows(prior_helper.id not in [reviewer["agent_id"] for reviewer in reviewers], all(reviewer["name"] for reviewer in reviewers))


def test_a_report_says_who_filed_it(two_rounds):
    report = read_rounds(two_rounds, two_rounds.expect_viewer_login(two_rounds.viewer_key("Ada")))[0]["reports"][0]
    agent = two_rounds.story.container.get(Queries).query(Agent).find(two_rounds.story.agent.id)
    expect_value(report["filed_by"], agent.given_name or agent.profile or agent.role)


def test_reports_filed_outside_a_round_are_not_in_it(rounds, cookie):
    file_report(rounds, "Before the round")
    request_critique(rounds, cookie)
    internal = file_report(rounds, "Inside the round")
    file_report(rounds, "After the round")
    rounds.story.expect_rows([report["id"] for report in read_rounds(rounds, cookie)[0]["reports"]] == [internal])


def test_a_plan_with_no_rounds_lists_none(rounds, cookie):
    rounds.story.expect_rows(read_rounds(rounds, cookie) == [])


def test_rounds_of_a_plan_in_another_environment_are_refused(rounds):
    rounds.story.expect_success("environment make elsewhere /work/elsewhere", actor=rounds.story.user)
    rounds.story.expect_success('plan make "Elsewhere plan" --environment elsewhere', actor=rounds.story.user)
    rounds.story.expect_refusal("plan rounds 2 --environment main", "no plan", actor=rounds.story.user)


def test_rounds_read_the_log_of_a_plan_reviewed_before_the_section_existed(rounds, cookie):
    rounds.story.expect_success("plan review 1", actor=rounds.story.user)
    rounds.story.expect_success("plan reviewed 1", actor=rounds.story.user)
    rounds.story.expect_rows(len(read_rounds(rounds, cookie)) == 1)


def test_a_person_reads_rounds_as_json_and_text(rounds, cookie):
    request_critique(rounds, cookie)
    rounds.story.expect_text("plan rounds 1", "round 1", actor=rounds.story.user)
    rows = json.loads(rounds.story.run("plan rounds 1 --json", actor=rounds.story.user).output_text)["rows"]
    rounds.story.expect_rows(len(rows) == 1)
