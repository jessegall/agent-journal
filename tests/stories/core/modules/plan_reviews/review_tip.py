import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.documents.models.report import Report
from tests.stories.core.modules.plan_reviews.review_rounds import CRITIQUE_COMMAND, REPORT, CritiquePlanReady, start_helper
from tests.stories.server.support.server_client import server_story

PLANS_WINDOW = "plans.plans"
TIP_LINE = ["plan", "review-tip", "1"]


def tip_lines(story) -> list[str]:
    return json.loads(story.run("plan review-tip 1 --json", actor=story.user).output_text)["lines"]


def test_the_tip_of_a_plan_under_review_says_who_still_reads_and_who_reported_with_the_report_number(new_story):
    story = new_story(fixture=CritiquePlanReady)
    story.expect_success(CRITIQUE_COMMAND, actor=story.user)
    first, second = start_helper(story, "Give plan 1 a thorough review"), start_helper(story, "Read plan:1 for risks")
    story.expect_rows(tip_lines(story)[0] == "2 reviewers: 0 reported, 2 still reading")
    story.expect_success(REPORT.format(title="First critique"), actor=Actor(first.id, ActorType.AGENT))
    report = max(row.id for row in story.container.get(Queries).query(Report).all_rows())
    lines = tip_lines(story)
    name = first.given_name or first.profile or first.role
    alternate = second.given_name or second.profile or second.role
    story.expect_rows(lines == ["2 reviewers: 1 reported, 1 still reading", f"{name}: report {report}", f"{alternate}: still reading"])


def test_the_tip_says_so_when_no_reviewer_has_started(new_story):
    story = new_story(fixture=CritiquePlanReady)
    story.expect_success(CRITIQUE_COMMAND, actor=story.user)
    story.expect_rows(tip_lines(story) == ["No reviewer has started reading yet"])


def test_the_viewer_reads_the_declared_tip_from_any_window_and_is_refused_a_read_nobody_declared(new_story):
    with server_story(new_story(fixture=CritiquePlanReady), listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.story.expect_success(CRITIQUE_COMMAND, actor=server.story.user)
        server.expect_viewer_status("/api/states", 200, cookie, text="plan review-tip {row_id}")
        read = server.viewer_line_value(cookie, {"window": PLANS_WINDOW, "line": TIP_LINE, "environment": "main"})
        server.story.expect_rows(read["lines"] == ["No reviewer has started reading yet"])
        server.expect_viewer_line(cookie, {"window": "skills.skills", "line": ["plan", "rounds", "1"], "environment": "main"}, 200, "does not declare plan rounds")
