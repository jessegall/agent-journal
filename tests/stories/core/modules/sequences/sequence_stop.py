from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.fixtures.started_sequence import StartedSequence

HELD = "sequence:1"
ASK_THE_USER = 'question ask "Which one" --context "A story asks this so a run can wait for the answer." --options "a" "b"'
HELD_STOPS = 8


class FollowedSequence(StoryFixture):
    """The agent has taken up the first of the two steps."""

    parent = StartedSequence

    def steps(self, story) -> None:
        story.expect_success("sequence follow", actor=story.agent)


class SecondStep(StoryFixture):
    """The agent finished step 1 and has not taken up step 2."""

    parent = FollowedSequence

    def steps(self, story) -> None:
        story.expect_success("sequence next", actor=story.agent)


class LastStepTaken(StoryFixture):
    """The agent is working on the last step."""

    parent = SecondStep

    def steps(self, story) -> None:
        story.expect_success("sequence follow", actor=story.agent)


class HelperOnSequence(StoryFixture):
    """A helper of the main agent has its own sequence running."""

    parent = StartedSequence

    def steps(self, story) -> None:
        story.helper = Actor(story.new_row_id(f"agent start s-helper claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
        story.expect_success("sequence run 1", actor=story.helper)


class WorkerOnSequence(StoryFixture):
    """A worker has its own sequence running."""

    parent = StartedSequence

    def steps(self, story) -> None:
        story.worker = Actor(story.new_row_id("agent start s-worker claude worker --environment main"), ActorType.AGENT)
        story.expect_success("sequence run 1", actor=story.worker)


class WaitingOnQuestion(StoryFixture):
    """The agent on its step asked the user something."""

    parent = FollowedSequence

    def steps(self, story) -> None:
        story.expect_success(ASK_THE_USER, actor=story.agent)


def test_an_agent_that_has_not_taken_up_its_step_cannot_stop(new_story):
    story = new_story(fixture=StartedSequence)
    story.expect_hook_refusal("s-1", HookSamples.stop(), HELD)


def test_an_agent_working_on_its_step_cannot_stop(new_story):
    story = new_story(fixture=FollowedSequence)
    story.expect_hook_refusal("s-1", HookSamples.stop(), HELD)


def test_the_refusal_names_the_step_the_agent_is_on(new_story):
    story = new_story(fixture=SecondStep)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "step 2")


def test_an_agent_on_its_last_step_still_cannot_stop(new_story):
    story = new_story(fixture=LastStepTaken)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "step 2")


def test_an_agent_that_ran_the_last_step_may_stop(new_story):
    story = new_story(fixture=LastStepTaken)
    story.expect_success("sequence next", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_an_agent_that_gave_the_sequence_up_may_stop(new_story):
    story = new_story(fixture=FollowedSequence)
    story.expect_success('sequence abandon --why "the release was called off" --sure', actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_asking_to_stop_over_and_over_never_lets_the_agent_through(new_story):
    story = new_story(fixture=FollowedSequence)
    for _ in range(HELD_STOPS):
        story.expect_hook_refusal("s-1", HookSamples.stop(), HELD)


def test_a_helper_with_a_running_sequence_cannot_stop(new_story):
    story = new_story(fixture=HelperOnSequence)
    story.expect_hook_refusal("s-helper", HookSamples.stop(), HELD)


def test_asking_over_and_over_never_lets_a_helper_through(new_story):
    story = new_story(fixture=HelperOnSequence)
    for _ in range(HELD_STOPS):
        story.expect_hook_refusal("s-helper", HookSamples.stop(), HELD)


def test_an_agent_waiting_on_its_running_helper_may_stop(new_story):
    story = new_story(fixture=HelperOnSequence)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_worker_with_a_running_sequence_cannot_stop(new_story):
    story = new_story(fixture=WorkerOnSequence)
    story.expect_hook_refusal("s-worker", HookSamples.stop(), HELD)


def test_another_agents_sequence_does_not_hold_this_agent(new_story):
    story = new_story(fixture=WorkerOnSequence)
    story.expect_success("sequence follow", actor=story.agent)
    story.expect_success('sequence abandon --why "only the worker runs it" --sure', actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_codex_agent_with_a_running_sequence_cannot_stop(new_story):
    story = new_story(fixture=FollowedSequence)
    story.expect_hook_refusal("s-1", HookSamples.stop().with_fields(program="codex"), HELD)


def test_a_new_session_of_the_agent_is_still_held(new_story):
    story = new_story(fixture=FollowedSequence)
    story.hook("s-1", HookSamples.session_start())
    story.expect_hook_refusal("s-1", HookSamples.stop(), HELD)


def test_an_agent_with_an_open_question_may_stop_to_wait_for_the_answer(new_story):
    story = new_story(fixture=WaitingOnQuestion)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_the_answer_to_its_question_holds_the_agent_again(new_story):
    story = new_story(fixture=WaitingOnQuestion)
    story.expect_success("question answer 1 --answer a", actor=story.user)
    story.run_listeners()
    story.expect_hook_refusal("s-1", HookSamples.stop(), HELD)


def test_an_agent_with_a_second_sequence_on_top_is_held_by_the_top_one(new_story):
    story = new_story(fixture=FollowedSequence)
    story.expect_success('sequence make "Hotfix" --steps "Patch it | Ship it"', actor=story.user)
    story.expect_success("sequence run 2", actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "sequence:2")


def test_an_agent_with_no_sequence_stops_as_before(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_hook_allowed("s-1", HookSamples.stop())
