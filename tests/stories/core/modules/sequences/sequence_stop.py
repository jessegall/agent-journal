from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process
from tests.stories.core.support import story_lines as lines
from tests.stories.fixtures.started_sequence import StartedSequence

OPEN_SEQUENCE = "sequence:1"
USER_QUESTION = 'question ask "Which one" --context "A story asks this so a run can wait for the answer." --options "a" "b"'
STOP_ATTEMPTS = 8


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


class LastStepActive(StoryFixture):
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
        story.expect_success(USER_QUESTION, actor=story.agent)


def test_an_agent_that_has_not_taken_up_its_step_cannot_stop(new_story):
    story = new_story(fixture=StartedSequence)
    story.expect_hook_refusal("s-1", HookSamples.stop(), OPEN_SEQUENCE)


def test_the_refusal_names_the_step_the_agent_is_on(new_story):
    story = new_story(fixture=SecondStep)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "step 2")


def test_an_agent_on_its_last_step_still_cannot_stop(new_story):
    story = new_story(fixture=LastStepActive)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "step 2")


def test_an_agent_that_ran_the_last_step_may_stop(new_story):
    story = new_story(fixture=LastStepActive)
    story.expect_success("sequence next", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_an_agent_that_gave_the_sequence_up_may_stop(new_story):
    story = new_story(fixture=FollowedSequence)
    story.expect_success('sequence abandon --why "the release was called off" --sure', actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_helper_with_a_running_sequence_cannot_stop(new_story):
    story = new_story(fixture=HelperOnSequence)
    story.expect_hook_refusal("s-helper", HookSamples.stop(), OPEN_SEQUENCE)


def test_an_agent_waiting_on_its_running_helper_may_stop(new_story):
    story = new_story(fixture=HelperOnSequence)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_worker_with_a_running_sequence_cannot_stop(new_story):
    story = new_story(fixture=WorkerOnSequence)
    story.expect_hook_refusal("s-worker", HookSamples.stop(), OPEN_SEQUENCE)


def test_another_agents_sequence_does_not_hold_this_agent(new_story):
    story = new_story(fixture=WorkerOnSequence)
    story.expect_success("sequence follow", actor=story.agent)
    story.expect_success('sequence abandon --why "only the worker runs it" --sure', actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_codex_agent_with_a_running_sequence_cannot_stop(new_story):
    story = new_story(fixture=FollowedSequence)
    story.expect_hook_refusal("s-1", HookSamples.stop().with_fields(program="codex"), OPEN_SEQUENCE)


def test_a_new_session_of_the_agent_is_still_held(new_story):
    story = new_story(fixture=FollowedSequence)
    story.hook("s-1", HookSamples.session_start())
    story.expect_hook_refusal("s-1", HookSamples.stop(), OPEN_SEQUENCE)


def test_an_agent_with_an_open_question_may_stop_to_wait_for_the_answer(new_story):
    story = new_story(fixture=WaitingOnQuestion)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_the_answer_to_its_question_holds_the_agent_again(new_story):
    story = new_story(fixture=WaitingOnQuestion)
    story.expect_success("question answer 1 --answer a", actor=story.user)
    story.run_listeners()
    story.expect_hook_refusal("s-1", HookSamples.stop(), OPEN_SEQUENCE)


def test_an_agent_with_a_second_sequence_on_top_is_held_by_the_top_one(new_story):
    story = new_story(fixture=FollowedSequence)
    story.expect_success('sequence make "Hotfix" --steps "Patch it | Ship it"', actor=story.user)
    story.expect_success("sequence run 2", actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "sequence:2")


def test_an_agent_with_a_running_sequence_a_task_in_hand_and_a_watched_run_stops_without_a_journal_exception(new_story):
    story = install_runner(new_story(fixture=FollowedSequence))
    story.expect_success(lines.NEW_TASK, actor=story.agent)
    story.expect_success(lines.TASK_START, actor=story.agent)
    start_process(story, "make build")
    story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": "wait"}}))
    story.expect_hook_allowed("s-1", HookSamples.stop())
