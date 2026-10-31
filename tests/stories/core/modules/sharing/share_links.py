from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import PlanWithPhases

LINK_DAYS = 7


class PlanAndPersonFixture(StoryFixture):
    """Plan 1 with three phases, and a person, Ada, beside the agent."""

    parent = PlanWithPhases

    def steps(self, story: Story) -> None:
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)

    def expect(self, story: Story) -> None:
        story.expect_success("plan show 1", "title: Version 5 core")


def test_a_person_makes_a_link_for_a_plan_and_sees_its_token_once(new_story):
    story = new_story(fixture=PlanAndPersonFixture)
    made = story.run("share make plans:1 --json", actor=story.user).output_text
    assert '"token": "' in made and '"link": "/viewer/share/' in made, made
    story.expect_success("share show 1", "state: active", "row_model: plan", "row_id: 1", "comments: False", actor=story.user)
    token = made.split('"token": "')[1].split('"')[0]
    assert token not in story.run("share list --json", actor=story.user).output_text
    assert token not in story.run("share show 1 --json", actor=story.user).output_text
    assert token not in story.run("event list --json", actor=story.user).output_text


def test_a_link_ends_a_week_after_it_is_made(new_story):
    story = new_story(fixture=PlanAndPersonFixture)
    story.run("share make plans:1", actor=story.user)
    expected = story.clock.timestamp().value + timedelta(days=LINK_DAYS)
    story.expect_text("share show 1", f"expires_at: {expected.strftime('%Y-%m-%d')}", actor=story.user)


def test_only_a_person_makes_a_link(new_story):
    story = new_story(fixture=PlanAndPersonFixture)
    story.expect_refusal("share make plans:1", "only a person shares", actor=story.agent)


def test_a_link_names_a_document_a_report_or_a_plan_that_exists(new_story):
    story = new_story(fixture=PlanAndPersonFixture)
    story.expect_refusal("share make tasks:1", "only a document, a report or a plan can be shared", actor=story.user)
    story.expect_refusal("share make plans", "only a document, a report or a plan can be shared", actor=story.user)
    story.expect_refusal("share make plans:9", "plan 9 does not exist", actor=story.user)


def test_a_document_or_a_report_is_named_but_the_journal_has_none_to_share_yet(new_story):
    story = new_story(fixture=PlanAndPersonFixture)
    story.expect_refusal("share make docs:12", "the journal has no documents to share", actor=story.user)
    story.expect_refusal("share make reports:4", "the journal has no reports to share", actor=story.user)


def test_the_person_who_made_a_link_revokes_it(new_story):
    story = new_story(fixture=PlanAndPersonFixture)
    story.run("share make plans:1", actor=story.user)
    story.expect_success("share revoke 1", "state: revoked", actor=story.user)
    story.expect_refusal("share revoke 1", "revoked is final", actor=story.user)


def test_no_one_else_revokes_a_link(new_story):
    story = new_story(fixture=PlanAndPersonFixture)
    story.run("share make plans:1", actor=story.user)
    story.expect_refusal("share revoke 1", "only the person who made a link revokes it", actor=story.agent)
    story.expect_success("share show 1", "state: active", actor=story.user)


def test_a_person_lists_their_links(new_story):
    story = new_story(fixture=PlanAndPersonFixture)
    story.run("share make plans:1", actor=story.user)
    story.run("share make plans:1", actor=story.user)
    story.expect_text("share list", "1", "2", actor=story.user)


def test_no_one_edits_a_link_or_makes_one_as_a_bare_row(new_story):
    story = new_story(fixture=PlanAndPersonFixture)
    story.run("share make plans:1", actor=story.user)
    story.expect_usage_error("share edit 1 --comments", actor=story.user)
    story.expect_usage_error("share-link make", actor=story.user)
