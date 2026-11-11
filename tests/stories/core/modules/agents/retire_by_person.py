import pytest

from core.modules.agents.models.agent import Agent
from core.modules.approvals.models.approval_request import ApprovalRequest
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, StartedHelper, helper_agent
from tests.stories.core.modules.helpers.lifetime_reviewers import launches
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

RETIRE = 'agent retire {number} --reason "Its reading is done" --environment main'
MEMORY_TEXT = "The cart rounds each line before it adds them"
TAX_START = 'helper start journal-researcher --brief "Read src/tax.py" --environment main'


@pytest.fixture
def ended(new_story):
    return new_story(fixture=EndedHelper)


def approval_requests(story) -> list[ApprovalRequest]:
    return list(story.story_rows(ApprovalRequest))


def helper_rows(story) -> list[Agent]:
    return sorted(story.container.get(Queries).query(Agent).filter(role="helper").all_rows(), key=lambda helper: helper.id)


def test_the_main_agent_that_retires_its_helper_asks_a_person_and_the_helper_stays_when_the_person_refuses(ended):
    helper = helper_agent(ended)
    ended.expect_refusal(RETIRE.format(number=helper.number), "A person was asked in the dock", actor=ended.agent)
    requested = approval_requests(ended)
    ended.expect_rows(len(requested) == 1, helper_agent(ended).retired_at is None, detail=str(requested))
    ended.expect_text(f"approval show {requested[0].id}", f"helper {helper.number}", actor=ended.user)
    ended.expect_success(f"approval refuse {requested[0].id}", actor=ended.user)
    ended.expect_rows(helper_agent(ended).retired_at is None)


def test_a_helper_the_main_agent_asked_to_retire_is_retired_once_a_person_accepts(ended):
    helper = helper_agent(ended)
    ended.expect_refusal(RETIRE.format(number=helper.number), "A person was asked in the dock", actor=ended.agent)
    ended.expect_success(f"approval accept {approval_requests(ended)[0].id} --environment main", actor=ended.user)
    ended.expect_rows(helper_agent(ended).retired_at is not None)


def test_a_person_retires_an_ended_helper_in_the_viewer_and_its_number_and_memories_stay(ended):
    helper = helper_agent(ended)
    ended.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=Actor(helper.id, ActorType.AGENT))
    with viewer_client(ended) as person:
        person.value("agents.agents", ["agent", "retire", str(helper.number), "--reason", "Its reading is done", "--environment", "main"])
    launches(ended, TAX_START)
    kept = helper_rows(ended)
    ended.expect_rows(len(kept) == 2, kept[0].retired_at is not None, kept[1].retired_at is None, kept[1].number > helper.number, detail=str(kept))
    ended.expect_text("memory list", MEMORY_TEXT, actor=Actor(helper.id, ActorType.AGENT))


def test_a_person_who_retires_a_running_helper_is_told_to_stop_it_first(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_refusal(RETIRE.format(number=helper.number), "is still running", actor=story.user)
    story.expect_rows(helper_agent(story).retired_at is None)


def test_a_person_who_deletes_an_agent_is_refused_naming_the_retirement_and_its_record_stays(ended):
    helper = helper_agent(ended)
    ended.expect_refusal(f"agent delete {helper.number} --environment main", f"its record stays: journal agent retire {helper.number}", actor=ended.user)
    kept = helper_rows(ended)
    ended.expect_rows(len(kept) == 1, kept[0].id == helper.id, kept[0].retired_at is None, detail=str(kept))


def test_a_person_who_deletes_a_retired_agent_is_refused_and_its_record_stays(ended):
    helper = helper_agent(ended)
    ended.expect_success(RETIRE.format(number=helper.number), actor=ended.user)
    ended.expect_refusal(f"agent delete {helper.number} --environment main", "is retired, and its record stays", actor=ended.user)
    ended.expect_rows(len(helper_rows(ended)) == 1, helper_agent(ended).retired_at is not None)
