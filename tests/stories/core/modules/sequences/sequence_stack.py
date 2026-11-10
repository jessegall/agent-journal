import json
import shlex

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.sequences.models.sequence_run import SequenceRun
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined

CLEANUP_TRIGGERS = [{"trigger_type": "row", "event": "plan.create", "end_events": "plan.ready,plan.cancel"}]
NEW_PLAN = 'plan make "The rebuild" --environment main'


class ReleaseAndCleanup(StoryFixture):
    """Sequence 1, Release, starts by hand; sequence 2, Cleanup, starts on a made plan and ends when it is ready."""

    parent = UserJoined

    def steps(self, story) -> None:
        story.expect_success('sequence make "Release" --steps "Run the suite | Tag the release"', actor=story.user)
        story.expect_success(f'sequence make "Cleanup" --steps "Sweep the folder | Tidy the notes" --triggers {shlex.quote(json.dumps(CLEANUP_TRIGGERS))}', actor=story.user)


def open_runs(story) -> list[int]:
    return [run.sequence_id for run in story.container.get(Queries).query(SequenceRun).all_rows() if run.ended_at is None]


class ReleaseCleanup(StoryFixture):
    """The agent runs Release, then a plan is made, so Cleanup runs on top of it."""

    parent = ReleaseAndCleanup

    def steps(self, story) -> None:
        story.expect_success("sequence run 1", actor=story.agent)
        story.run(NEW_PLAN, actor=story.user)
        story.run_listeners()

    def expect(self, story) -> None:
        story.expect_rows(open_runs(story) == [1, 2])


def test_finishing_the_top_sequence_says_the_step_of_the_one_below(new_story):
    story = new_story(fixture=ReleaseCleanup)
    story.run("sequence follow", actor=story.agent)
    story.expect_success("sequence next", "sequence 2, step 2: Tidy the notes", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_success("sequence next", "sequence 2 ran its last step", "sequence 1, step 1: Run the suite", actor=story.agent)
    story.expect_rows(open_runs(story) == [1])


def test_abandoning_the_top_sequence_says_the_step_of_the_one_below(new_story):
    story = new_story(fixture=ReleaseCleanup)
    story.run("sequence follow", actor=story.agent)
    story.expect_refusal('sequence abandon --why "not now"', "leaves undone", actor=story.agent)
    story.expect_success('sequence abandon --why "not now" --sure', "sequence 2 abandoned", "sequence 1, step 1: Run the suite", actor=story.agent)


def test_a_sequence_started_by_hand_goes_on_top_of_a_running_one_but_the_same_one_is_refused(new_story):
    story = new_story(fixture=ReleaseAndCleanup)
    story.expect_success("sequence run 1", actor=story.agent)
    story.expect_success("sequence run 2", "sequence 2, step 1: Sweep the folder", actor=story.agent)
    story.expect_rows(open_runs(story) == [1, 2])
    story.expect_refusal("sequence run 1", "sequence 1 is already running", actor=story.agent)
    story.expect_refusal("sequence run 2", "sequence 2 is already running", actor=story.agent)


def test_a_record_made_again_starts_no_second_run_of_a_sequence_already_running(new_story):
    story = new_story(fixture=ReleaseCleanup, environment="main")
    story.run('plan make "Another plan"', actor=story.user)
    story.run_listeners()
    story.expect_rows(open_runs(story) == [1, 2])


def test_a_lower_sequence_ending_leaves_the_one_on_top_running(new_story):
    story = new_story(fixture=ReleaseAndCleanup)
    story.run(NEW_PLAN, actor=story.user)
    story.run_listeners()
    story.expect_success("sequence run 1", actor=story.agent)
    story.expect_success('plan cancel 1 --reason "replaced"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(open_runs(story) == [1])
    story.expect_success("sequence follow", "sequence 1, step 1: Run the suite", actor=story.agent)


def test_two_agents_keep_stacks_of_their_own(new_story):
    story = new_story(fixture=ReleaseAndCleanup, environment="main")
    helper = Actor(story.new_row_id(f"agent start s-2 claude helper --parent {story.agent.id}"), ActorType.AGENT)
    story.expect_success("sequence run 1", actor=story.agent)
    story.expect_success("sequence run 1", "sequence 1, step 1: Run the suite", actor=helper)
