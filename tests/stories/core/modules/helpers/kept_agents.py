from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, the_helper

REASON = '--reason "Its question is answered"'


class EndedHelper(StoryFixture):
    """The helper of StartedHelper with its process stopped."""

    parent = StartedHelper

    def steps(self, story):
        helper = the_helper(story)
        story.expect_success(f"agent edit {helper.id} --pid 4242", actor=story.user)
        story.expect_success(f"agent stop {helper.id}", actor=story.agent)


def test_a_helper_stays_idle_when_its_process_stops(new_story):
    story = new_story(fixture=EndedHelper)
    helper = the_helper(story)
    story.expect_rows(helper.ended_at is not None, helper.retired_at is None, helper.session != "")


def test_retire_with_a_reason_keeps_its_record_and_it_is_not_retired_again(new_story):
    story = new_story(fixture=EndedHelper)
    helper = the_helper(story)
    story.expect_success(f"agent retire {helper.id} {REASON}", f"retired agent {helper.id}", actor=story.agent)
    retired = the_helper(story)
    story.expect_rows(retired.retired_at is not None, retired.retirement_reason == "Its question is answered", retired.retiring_actor_id == story.agent.id)
    story.expect_refusal(f"agent retire {helper.id} {REASON}", "retired already", actor=story.agent)


def test_retire_needs_a_reason_and_an_ended_agent(new_story):
    story = new_story(fixture=StartedHelper)
    helper = the_helper(story)
    story.expect_refusal(f"agent retire {helper.id} {REASON}", "still running", actor=story.agent)
    story.expect_success(f"agent edit {helper.id} --pid 4242", actor=story.user)
    story.expect_success(f"agent stop {helper.id}", actor=story.agent)
    story.expect_refusal(f'agent retire {helper.id} --reason " "', "needs its reason", actor=story.agent)


def test_retire_permissions(new_story):
    story = new_story(fixture=EndedHelper)
    helper = the_helper(story)
    story.expect_refusal(f"agent retire {story.agent.id} {REASON}", "main agent is not retired", actor=story.agent)
    story.expect_refusal(f"agent retire {helper.id} {REASON}", "answers to", actor=Actor(helper.id, ActorType.AGENT))
    story.expect_success(f"agent retire {helper.id} {REASON}", actor=story.user)


def test_retired_row_stays_retired(new_story):
    story = new_story(fixture=EndedHelper)
    helper = the_helper(story)
    story.expect_refusal(f'agent edit {helper.id} --retirement-reason "Old"', "does not change a retirement", actor=story.user)
    story.expect_success(f"agent retire {helper.id} {REASON}", actor=story.agent)
    story.expect_refusal(f'agent edit {helper.id} --retirement-reason ""', "does not change a retirement", actor=story.user)
    story.expect_refusal(f"agent delete {helper.id}", "record stays", actor=story.user)
    story.expect_refusal(f'helper send {helper.id} "One more job"', "retired, for good", actor=story.agent)
    story.expect_rows(the_helper(story).retired_at is not None)


def test_session_gone_says_retire(new_story):
    story = new_story(fixture=EndedHelper)
    helper = the_helper(story)
    story.expect_refusal(f'helper send {helper.id} "One more job"', f"journal agent retire {helper.id}", actor=story.agent)
