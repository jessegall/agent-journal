import json

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.drivers.models.helper_job import HelperJob
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import read_jobs, resumable_session
from tests.stories.core.modules.helpers.program_split import helper_split_story, helper_viewer
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.modules.workers.support.program_split import set_split
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE
from core.modules.helpers.support.helper_settings import HELPER_PROFILE_LIMITS

TEST_ROWS_REASON = "the test reads every row it checks"

__all__ = ["helper_split_story", "helper_viewer"]

REVIEWER = f"{PLAN_REVIEWER_PROFILE.name}"
START_REVIEW = f"helper start {PLAN_REVIEWER_PROFILE.name} --plan {{plan}} --brief 'Review plan {{plan}}' --environment main"
NEW_AGENT_REASON = "A second view of the plan"
LIMITS = f"setting set {HELPER_PROFILE_LIMITS} '[\"{PLAN_REVIEWER_PROFILE.name}:8:3\"]' --project"
REVIEW_MEMORY = "Plan 5 lacked a phase for the migration"


def launches(story, *lines: str, actor=None) -> list[dict]:
    """Runs each line with a launcher listening and returns what the launcher was asked to start."""
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"started 701\n", request_count=len(lines))
    for line in lines:
        story.expect_success(line, actor=actor or story.agent)
        story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    return [request for request in launcher.requests if "command" in request]


def refusal_text(story, line: str) -> str:
    """Runs a line that must be refused, with a launcher listening, and returns what the refusal printed."""
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    outcome = story.run(line, actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_rows(outcome.code == 1, detail=outcome.output_text)
    return outcome.output_text


def reviewers(story) -> list[Agent]:
    return sorted(story.container.get(Queries).query(Agent).filter(profile=REVIEWER).every_row(TEST_ROWS_REASON), key=lambda reviewer: reviewer.number)


def review_job(story, reviewer: Agent, plan: int) -> str:
    return f'helper send {agent_number(story, reviewer.id)} "Review plan {plan}" --plan {plan}'


class StartedReviewer(StoryFixture):
    """A main agent with a user beside it and one plan reviewer whose review of plan 5 still runs."""

    parent = UserBuilder

    def steps(self, story):
        launches(story, START_REVIEW.format(plan=5))


class EndedReviewer(StoryFixture):
    """A plan reviewer that ended after its review of plan 5."""

    parent = StartedReviewer

    def steps(self, story):
        story.expect_success(f"agent end {reviewers(story)[0].id}", actor=story.user)
        story.run_listeners()


@pytest.fixture
def idle_reviewer(new_story, monkeypatch):
    story = new_story(fixture=EndedReviewer)
    resumable_session(story, reviewers(story)[0], monkeypatch)
    return story


def test_a_steering_line_to_a_reviewer_whose_job_runs_is_added_to_the_open_job(new_story):
    story = new_story(fixture=StartedReviewer)
    reviewer = reviewers(story)[0]
    story.expect_success(f'helper send {agent_number(story, reviewer.id)} "Also read phase 2" --steer', actor=story.agent)
    jobs = read_jobs(story, reviewer)
    story.expect_rows(len(jobs) == 1, "Also read phase 2" in jobs[0].brief, reviewers(story)[0].session == reviewer.session)


def test_a_person_retires_an_ended_reviewer_and_the_next_start_makes_a_new_agent_with_no_memories(idle_reviewer):
    story = idle_reviewer
    retired = reviewers(story)[0]
    story.expect_success(f'memory make "{REVIEW_MEMORY}" --weight 5', actor=Actor(retired.id, ActorType.AGENT))
    story.expect_success(f'agent retire {agent_number(story, retired.id)} --reason "Its reviews are done" --environment main', actor=story.user)
    launches(story, START_REVIEW.format(plan=6))
    current = reviewers(story)
    story.expect_rows(len(current) == 2, current[0].retired_at is not None, current[1].retired_at is None, current[1].number > retired.number, detail=str(current))
    story.expect_absent("memory list", REVIEW_MEMORY, actor=Actor(current[1].id, ActorType.AGENT))


def test_a_reviewer_start_with_no_idle_reviewer_makes_an_agent_with_the_next_number_and_a_new_session(new_story):
    story = new_story(fixture=UserBuilder)
    command = launches(story, START_REVIEW.format(plan=5))[0]["command"]
    current = reviewers(story)
    story.expect_rows(len(current) == 1, current[0].number == 2, current[0].session in command, "--resume" not in command, detail=str(command[:4]))
    story.expect_text("agent show 2 --environment main", f"profile: {REVIEWER}", f"session: {current[0].session}", actor=story.user)


def test_a_reviewer_start_while_one_is_idle_names_its_send_line_and_the_send_runs_on_it_under_a_new_session(idle_reviewer):
    story = idle_reviewer
    reviewer = reviewers(story)[0]
    refusal = refusal_text(story, START_REVIEW.format(plan=6))
    story.expect_rows(f'journal helper send {reviewer.number} "<job>"' in refusal, detail=refusal)
    command = launches(story, review_job(story, reviewer, 6))[0]["command"]
    current = reviewers(story)
    story.expect_rows(len(current) == 1, current[0].id == reviewer.id, current[0].session != reviewer.session, current[0].session in command, detail=str(command[:4]))


def test_the_second_job_of_a_reviewer_starts_a_new_conversation_and_its_profile_says_to_write_no_memories(idle_reviewer):
    story = idle_reviewer
    reviewer = reviewers(story)[0]
    story.expect_text(f"profile show {REVIEWER} --json", "Write no memories", actor=story.agent)
    command = launches(story, review_job(story, reviewer, 6))[0]["command"]
    story.expect_rows("--resume" not in command, reviewer.session not in command, detail=str(command[:4]))


def test_a_second_job_sent_to_an_ended_reviewer_is_accepted_and_ends_its_session_as_each_launch(idle_reviewer):
    story = idle_reviewer
    reviewer = reviewers(story)[0]
    launches(story, review_job(story, reviewer, 6))
    history = json.loads(story.run(f"agent sessions {reviewer.number} --environment main --json", actor=story.user).output_text)["rows"]
    story.expect_rows([(row["session"], row["end_reason"]) for row in history] == [(reviewers(story)[0].session, None), (reviewer.session, "each_launch")],
                      len(read_jobs(story, reviewer)) == 2, detail=str(history))


def test_a_second_review_of_the_same_plan_by_one_reviewer_is_refused_and_names_another_idle_reviewer_or_fresh(idle_reviewer, monkeypatch):
    story = idle_reviewer
    first = reviewers(story)[0]
    launches(story, f"{START_REVIEW.format(plan=6)} --fresh '{NEW_AGENT_REASON}'")
    second = reviewers(story)[1]
    story.expect_success(f"agent end {second.id}", actor=story.user)
    story.run_listeners()
    resumable_session(story, second, monkeypatch)
    refusal = refusal_text(story, review_job(story, first, 5))
    story.expect_rows("reviewed plan 5" in refusal, f"journal helper send {second.number}" in refusal, "--fresh" in refusal, detail=refusal)


def test_three_reviews_at_once_run_on_three_reviewers_and_a_fourth_is_refused_at_the_kept_limit(new_story):
    story = new_story(fixture=StartedReviewer)
    story.expect_success(LIMITS, actor=story.user)
    launches(story, START_REVIEW.format(plan=6), START_REVIEW.format(plan=7))
    current = reviewers(story)
    story.expect_rows(len(current) == 3, all(reviewer.ended_at is None for reviewer in current), detail=str(current))
    refusal = refusal_text(story, START_REVIEW.format(plan=8))
    story.expect_rows(f"3 of {REVIEWER} exist" in refusal, "wait for a report" in refusal, len(reviewers(story)) == 3, detail=refusal)


def test_a_reviewer_start_at_the_kept_limit_names_the_idle_reviewer_to_send_to(idle_reviewer):
    story = idle_reviewer
    story.expect_success(LIMITS.replace(":8:3", ":8:1"), actor=story.user)
    refusal = refusal_text(story, START_REVIEW.format(plan=6))
    story.expect_rows(f'journal helper send {reviewers(story)[0].number} "<job>"' in refusal, len(reviewers(story)) == 1, detail=refusal)


def test_many_reviews_one_after_another_leave_one_reviewer_agent_with_its_number(idle_reviewer):
    story = idle_reviewer
    reviewer = reviewers(story)[0]
    for plan in range(6, 12):
        launches(story, review_job(story, reviewer, plan))
        story.expect_success(f"agent end {reviewer.id}", actor=story.user)
        story.run_listeners()
    current = reviewers(story)
    story.expect_rows(len(current) == 1, current[0].number == reviewer.number, len(read_jobs(story, reviewer)) == 7, detail=str(current))


def test_a_reviewer_with_no_program_follows_the_program_split_at_each_launch_under_one_number(helper_split_story, helper_viewer):
    story = helper_split_story
    set_split(story, "claude 100,codex 0", viewer=helper_viewer)
    first = launches(story, START_REVIEW.format(plan=5))[0]["command"][0]
    reviewer = reviewers(story)[0]
    story.expect_success(f"agent end {reviewer.id}", actor=story.user)
    story.run_listeners()
    set_split(story, "claude 0,codex 100", viewer=helper_viewer)
    second = launches(story, review_job(story, reviewer, 6))[0]["command"][0]
    current = reviewers(story)
    story.expect_rows((first, second) == ("claude", "codex"), len(current) == 1, current[0].number == reviewer.number, current[0].program == "codex", detail=f"{first} / {second}")


def test_fresh_with_a_reason_while_a_reviewer_is_idle_makes_a_second_agent_and_keeps_the_reason(idle_reviewer):
    story = idle_reviewer
    launches(story, f"{START_REVIEW.format(plan=6)} --fresh '{NEW_AGENT_REASON}'")
    current = reviewers(story)
    job = story.container.get(Queries).query(HelperJob).filter(helper_id=current[1].id).first()
    story.expect_rows(len(current) == 2, current[1].number > current[0].number, job.new_agent_reason == NEW_AGENT_REASON, detail=str(current))
