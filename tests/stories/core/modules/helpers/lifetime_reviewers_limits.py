import json
import shutil
from datetime import timedelta

from core.modules.agents.models.agent import Agent
from engine.query.queries import Queries
from tests.stories.core.modules.helpers.helper_jobs import read_jobs, resumable_session
from tests.stories.core.modules.helpers.lifetime_reviewers import START_REVIEW, StartedReviewer, idle_reviewer, launches, refusal_text, review_job, reviewers
from tests.stories.core.modules.helpers.support.rotating_helper import installed_program_checks, real_program_states
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.profile_storage import boot, profile_path, save_profile_file
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE

TEST_ROWS_REASON = "the test reads every row it checks"

__all__ = ["idle_reviewer"]

DIFF_READER_FILE = "---\nname: diff-reader\ndescription: Reads changes\nkind: helper\nmodel: sonnet\nindependent: true\n---\nRead the diff.\n"
DIFF_READER_START = 'helper start diff-reader --brief "Read the first diff" --environment main'
NEW_AGENT_REASON = "A second view of the plan"
TWO_PROGRAM_SAVE = f"profile save {PLAN_REVIEWER_PROFILE.name} --program claude --fallback-programs claude,codex --program-if-possible --reason needed"


def session_history(story, reviewer: Agent) -> list[dict]:
    return json.loads(story.run(f"agent sessions {reviewer.number} --environment main --json", actor=story.user).output_text)["rows"]


def diff_readers(story) -> list[Agent]:
    return list(story.container.get(Queries).query(Agent).filter(profile="diff-reader").every_row(TEST_ROWS_REASON))


def test_a_personal_profile_with_the_old_independent_line_runs_as_each_launch_and_is_saved_back_so(new_story, monkeypatch):
    story = new_story(fixture=UserBuilder)
    save_profile_file(story, "diff-reader", DIFF_READER_FILE)
    boot(story)
    launches(story, DIFF_READER_START)
    diff_reader = diff_readers(story)[0]
    story.expect_success(f"agent end {diff_reader.id}", actor=story.user)
    story.run_listeners()
    resumable_session(story, diff_reader, monkeypatch)
    refusal = refusal_text(story, DIFF_READER_START)
    command = launches(story, f'helper send {diff_reader.number} "Read the second diff"')[0]["command"]
    story.expect_rows(f'journal helper send {diff_reader.number} "<job>"' in refusal, len(diff_readers(story)) == 1, diff_readers(story)[0].session != diff_reader.session, "--resume" not in command, detail=refusal)
    story.expect_success('profile save diff-reader --description "Reads every change" --reason needed', actor=story.user)
    text = profile_path(story, "diff-reader").read_text()
    story.expect_rows('occupant: "each-launch"' in text, "independent" not in text, detail=text)


def test_a_steering_line_to_a_running_reviewer_changes_neither_its_session_nor_its_session_history(new_story):
    story = new_story(fixture=StartedReviewer)
    reviewer = reviewers(story)[0]
    history = session_history(story, reviewer)
    story.expect_success(f'helper send {reviewer.number} "Also read phase 3" --steer', actor=story.agent)
    jobs = read_jobs(story, reviewer)
    story.expect_rows(len(history) == 1, session_history(story, reviewer) == history, reviewers(story)[0].session == reviewer.session, len(jobs) == 1, "Also read phase 3" in jobs[0].brief)


def test_a_reviewer_whose_program_is_out_runs_on_another_and_with_no_program_left_the_job_is_refused_as_a_start_is(idle_reviewer, monkeypatch):
    story = idle_reviewer
    reviewer = reviewers(story)[0]
    story.expect_success(TWO_PROGRAM_SAVE, actor=story.user)
    real_program_states(story)
    installed_program_checks(story)
    monkeypatch.setattr(shutil, "which", lambda name: name)
    ends_at = (story.clock.timestamp().value + timedelta(minutes=30)).isoformat()
    story.expect_success(f'provider-outage make claude "rate limit" --ends-at {ends_at}', actor=story.agent)
    program = launches(story, review_job(story, reviewer, 6))[0]["command"][0]
    story.expect_success(f"agent end {reviewer.id}", actor=story.user)
    story.run_listeners()
    story.expect_success("provider-outage end claude", actor=story.user)
    history, jobs = session_history(story, reviewer), read_jobs(story, reviewer)
    monkeypatch.setattr(shutil, "which", lambda name: None)
    start_refusal = refusal_text(story, f"{START_REVIEW.format(plan=8)} --fresh '{NEW_AGENT_REASON}'")
    job_refusal = refusal_text(story, review_job(story, reviewer, 7))
    story.expect_rows(program == "codex", reviewers(story)[0].program == "codex", job_refusal.partition(":")[0] == start_refusal.partition(":")[0], len(reviewers(story)) == 1,
                      session_history(story, reviewer) == history, read_jobs(story, reviewer) == jobs, detail=f"{program} / {start_refusal} / {job_refusal}")


def test_the_number_of_a_reviewer_a_person_retired_is_never_given_again(idle_reviewer):
    story = idle_reviewer
    retired = reviewers(story)[0]
    story.expect_success(f'agent retire {retired.number} --reason "Its reviews are done" --environment main', actor=story.user)
    launches(story, START_REVIEW.format(plan=6), f"{START_REVIEW.format(plan=7)} --fresh '{NEW_AGENT_REASON}'")
    numbers = [reviewer.number for reviewer in reviewers(story)]
    story.expect_rows(len(numbers) == 3, len(set(numbers)) == 3, numbers == sorted(numbers), numbers[0] == retired.number, reviewers(story)[0].retired_at is not None, detail=str(numbers))
