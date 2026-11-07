import json

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.server.support.server_client import server_story

SUITE_KEY = "journal.core.drivers.suite"
APPROVE = "Yes, approve"
REQUEST_LINE = f"setting request {SUITE_KEY} samples --reason 'it fits the work' --environment main"


class MainWithPerson(StoryFixture):
    """A main agent in main with a person, Ada, beside it, and the suite setting left to its default."""

    parent = SampleSuiteChoice

    def steps(self, story: Story) -> None:
        story.run("setting delete 1")
        story.agent = Actor(story.new_row_id("agent start s-1 claude main --environment main"), ActorType.AGENT)
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)


def suite_setting(story) -> dict[str, object]:
    return json.loads(story.run(f"setting show {SUITE_KEY} --environment main --json").output_text)


def viewer_answer(answer: str) -> dict[str, object]:
    return {"window": "questions.questions", "line": ["question", "answer", "1", "--answer", answer], "environment": "main"}


@pytest.fixture
def plain_story(new_story):
    return new_story(SAMPLES, fixture=MainWithPerson)


@pytest.fixture
def requested(plain_story):
    plain_story.expect_success(REQUEST_LINE, "question 1 waits for the user's answer", actor=plain_story.agent)
    with server_story(plain_story) as server:
        yield server


def test_an_agents_write_of_a_person_set_setting_is_refused(plain_story):
    plain_story.expect_refusal(f"setting set {SUITE_KEY} samples --environment main", "setting request", actor=plain_story.agent)


def test_choosing_the_driver_or_the_suite_is_refused_to_an_agent(plain_story):
    plain_story.expect_refusal("driver choose samples.lead --environment main", "only a person changes", actor=plain_story.agent)
    plain_story.expect_refusal("suite choose samples --environment main", "only a person changes", actor=plain_story.agent)


def test_a_person_set_refusal_has_no_skip(plain_story):
    plain_story.expect_refusal("refusal skip settings.person-set --reason 'it is fine'", "safety refusal", actor=plain_story.agent)


def test_a_worker_is_refused_the_request(plain_story):
    worker = Actor(plain_story.new_row_id(f"agent start w-1 claude worker --parent {plain_story.agent.id} --environment main"), ActorType.AGENT)
    plain_story.expect_refusal(REQUEST_LINE, "nobody can answer", actor=worker)


def test_a_setting_an_agent_may_set_needs_no_request(plain_story):
    plain_story.expect_refusal("setting request journal.core.settings.backup-count 3 --reason 'more' --project", "may set", actor=plain_story.agent)


def test_the_question_names_the_setting_its_old_and_new_value_and_the_reason(requested):
    requested.story.expect_text("question show 1", SUITE_KEY, "to samples", "it fits the work", APPROVE)


def test_only_a_person_answers_the_question(requested):
    requested.story.expect_refusal(f"question answer 1 --answer '{APPROVE}'", "only a person answers", actor=requested.story.agent)


def test_a_person_approves_through_the_viewer_and_the_setting_changes_as_the_person(requested):
    story = requested.story
    cookie = requested.expect_viewer_login(requested.viewer_key("Ada"))
    requested.expect_viewer_line(cookie, viewer_answer(APPROVE), 200, '"code": 0')
    requested.expect_eventually(f"setting show {SUITE_KEY} --environment main", "from: environment")
    story.expect_rows(suite_setting(story)["value"] == "samples")
    rows = json.loads(story.run("setting list --environment main --json").output_text)["rows"]
    story.expect_rows([row["creator_id"] for row in rows if row["key"] == SUITE_KEY] == [story.user.id])


def test_a_person_refuses_through_the_viewer_and_the_setting_stays(requested):
    story = requested.story
    cookie = requested.expect_viewer_login(requested.viewer_key("Ada"))
    requested.expect_viewer_line(cookie, viewer_answer("No"), 200, '"code": 0')
    story.expect_text("question show 1", "answer: No")
    story.expect_rows(suite_setting(story)["source"] != "environment")


def test_a_person_still_sets_a_person_set_setting_through_the_viewer(requested):
    cookie = requested.expect_viewer_login(requested.viewer_key("Ada"))
    body = {"window": "viewer.shell", "line": ["setting", "set", SUITE_KEY, "samples"], "environment": "main"}
    requested.expect_viewer_line(cookie, body, 200, '"code": 0')
