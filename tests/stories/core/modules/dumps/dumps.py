from tests.stories.core.support.fixtures import UserJoined


def dump_story(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('dump make "Notes from the call" --parts "The cart rounds twice | Ship on Friday"', "dump 1: Dump 1", actor=story.user)
    return story


def test_a_dump_lists_its_items_as_not_read_yet(new_story):
    story = dump_story(new_story)
    story.expect_text("dump items 1", "1: not read yet", "2: not read yet", actor=story.agent)


def test_an_item_is_noted_then_filed_with_the_rows_it_became(new_story):
    story = dump_story(new_story)
    story.run('dump note 1 1 "a fault in the cart"', actor=story.agent)
    story.run('task make "Round the cart once" --environment main', actor=story.agent)
    story.expect_text('dump filed 1 1 "made a task" --refs tasks:1', "dump 1: 1 filed", actor=story.agent)
    story.expect_text("dump items 1", "1: filed - made a task", actor=story.agent)


def test_a_dump_closes_with_its_outcome_once_every_item_is_filed_or_failed(new_story):
    story = dump_story(new_story)
    story.run('dump filed 1 1 "made a task"', actor=story.agent)
    story.expect_text('dump failed 1 2 "no date given"', "dump 1 closed: 1 filed, 1 failed", actor=story.agent)
    story.expect_refusal('dump note 1 1 "again"', "dump 1 is closed", actor=story.agent)


def test_an_item_the_dump_does_not_have_is_refused_with_its_items(new_story):
    story = dump_story(new_story)
    story.expect_refusal('dump note 1 9 "x"', "dump 1 has no item '9'", actor=story.agent)


def test_a_filing_with_no_word_of_what_was_done_is_refused(new_story):
    story = dump_story(new_story)
    story.expect_refusal('dump filed 1 1 ""', "say what was done with it", actor=story.agent)
