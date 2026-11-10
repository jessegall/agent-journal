import pytest

from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from tests.stories.core.modules.helpers.helper_jobs import JOB, START, EndedHelper, helper_agent, read_jobs, resumable_session
from tests.stories.core.modules.helpers.lifetime_reviewers import launches, refusal_text

MEMORY_TEXT = "The cart rounds each line before it adds them"
NEW_AGENT_REASON = "A second reader for the tax file"
TAX_START = 'helper start journal-researcher --brief "Read src/tax.py" --environment main'
KEPT_LIMIT = "setting set journal.core.helpers.read-only-helper-profile-limits '[\"journal-researcher:8:2\"]' --project"


@pytest.fixture
def idle_helper(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    resumable_session(story, helper_agent(story), monkeypatch)
    return story


def researchers(story) -> list[Agent]:
    return sorted(story.container.get(Queries).query(Agent).filter(profile="journal-researcher").all_rows(), key=lambda helper: helper.id)


def test_a_job_sent_to_an_idle_helper_runs_on_that_helper_which_still_reads_its_memory(idle_helper):
    story = idle_helper
    helper = helper_agent(story)
    story.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=Actor(helper.id, ActorType.AGENT))
    command = launches(story, f'helper send {helper.number} "{JOB}"')[0]["command"]
    story.expect_rows(len(researchers(story)) == 1, helper_agent(story).session == helper.session, "--resume" in command, len(read_jobs(story, helper)) == 2, detail=str(command[:4]))
    story.expect_text("memory list", MEMORY_TEXT, actor=Actor(helper.id, ActorType.AGENT))


def test_a_start_while_a_helper_of_the_profile_is_idle_is_refused_naming_its_number_and_the_fresh_flag(idle_helper):
    story = idle_helper
    helper = helper_agent(story)
    refusal = refusal_text(story, TAX_START)
    story.expect_rows(f'helper {helper.number} is idle: journal helper send {helper.number} "<job>"' in refusal, '--fresh "<why>"' in refusal, len(researchers(story)) == 1, detail=refusal)


def test_a_start_with_the_fresh_flag_makes_a_second_helper_keeps_the_reason_and_counts_against_the_kept_limit(idle_helper):
    story = idle_helper
    story.expect_success(KEPT_LIMIT, actor=story.user)
    launches(story, f"{TAX_START} --fresh '{NEW_AGENT_REASON}'")
    kept = researchers(story)
    job = story.container.get(Queries).query(HelperJob).filter(helper_id=kept[1].id).first()
    refusal = refusal_text(story, f"{START} --fresh 'A third reader'")
    story.expect_rows(len(kept) == 2, job.new_agent_reason == NEW_AGENT_REASON, "2 of journal-researcher exist" in refusal, len(researchers(story)) == 2, detail=refusal)


def test_an_idle_helper_of_one_environment_is_not_offered_to_a_start_in_another(idle_helper):
    story = idle_helper
    helper = helper_agent(story)
    story.expect_success("environment make staging /work/staging")
    staging_main = Actor(story.new_row_id("agent start s-20 claude main --environment staging"), ActorType.AGENT)
    launches(story, START.replace("--environment main", "--environment staging"), actor=staging_main)
    kept = researchers(story)
    story.expect_rows(len(kept) == 2, kept[1].environment_id != helper.environment_id, len(read_jobs(story, helper)) == 1, helper_agent(story).session == helper.session, detail=str(kept))


def test_a_job_sent_to_a_retired_helper_is_refused_and_nothing_is_made(idle_helper):
    story = idle_helper
    helper = helper_agent(story)
    story.expect_success(f'agent retire {helper.number} --reason "Its reading is done" --environment main', actor=story.user)
    refusal_text(story, f'helper send {helper.number} "{JOB}"')
    story.expect_rows(len(researchers(story)) == 1, len(read_jobs(story, helper)) == 1, helper_agent(story).session == helper.session, helper_agent(story).retired_at is not None)
