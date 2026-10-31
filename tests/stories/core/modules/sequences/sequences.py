from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined


def sequence_story(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('sequence make "Release" --steps "Run the suite | Tag the release"', "sequence 1: Release, 2 steps", actor=story.user)
    return story


def test_a_sequence_is_made_with_its_steps_and_shown_in_order(new_story):
    story = sequence_story(new_story)
    story.expect_ordered_lines("sequence show 1", "sequence 1: Release, starts by hand only", "1. Run the suite", "2. Tag the release", actor=story.user)


def test_a_sequence_with_no_step_is_refused_with_how_to_give_steps(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('sequence make "Empty"', "a sequence has at least one step", actor=story.user)


def test_running_a_sequence_tells_the_agent_its_first_step_and_next_moves_it_on_to_the_end(new_story):
    story = sequence_story(new_story)
    story.expect_text("sequence run 1", "sequence 1, step 1: Run the suite", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_text("sequence next", "sequence 1, step 2: Tag the release", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_text("sequence next", "sequence 1 ran its last step", actor=story.agent)


def test_next_before_the_step_is_taken_up_is_refused_with_the_follow_command(new_story):
    story = sequence_story(new_story)
    story.run("sequence run 1", actor=story.agent)
    story.expect_refusal("sequence next", "step 1 of sequence 1 was never taken up", actor=story.agent)


def test_a_step_not_taken_up_holds_the_agents_edits(new_story):
    story = sequence_story(new_story)
    story.run("sequence run 1", actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "sequence 1 step 1 waits")


def test_abandoning_names_the_steps_left_undone_and_goes_through_with_sure(new_story):
    story = sequence_story(new_story)
    story.run("sequence run 1", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_refusal('sequence abandon --why "not today"', "leaves undone: Run the suite, Tag the release", actor=story.agent)
    story.expect_text('sequence abandon --why "not today" --sure', "sequence 1 abandoned", actor=story.agent)
    story.expect_refusal("sequence next", "no sequence is running", actor=story.agent)
