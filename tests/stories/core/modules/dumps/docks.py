from tests.stories.core.modules.dumps.dumps import dump_story


def test_a_dump_docks_above_the_chat_when_it_is_made(new_story):
    story = dump_story(new_story)
    story.run_listeners()
    story.expect_text("dock-item list --oldest", "dumps.dump", "docked")


def test_a_dump_leaves_the_dock_when_it_closes(new_story):
    story = dump_story(new_story)
    story.run_listeners()
    story.run('dump filed 1 1 "made a task"', actor=story.agent)
    story.run('dump failed 1 2 "no date given"', actor=story.agent)
    story.run_listeners()
    story.expect_text("dock-item list --oldest", "undocked")


def test_a_dump_takes_the_title_the_agent_names(new_story):
    story = dump_story(new_story)
    story.expect_text('dump name 1 "Call notes"', "dump 1: Call notes", actor=story.agent)


def test_a_ref_that_is_no_table_and_number_is_refused(new_story):
    story = dump_story(new_story)
    story.expect_refusal('dump filed 1 1 "made a task" --refs the-cart', "a ref is a table and a number, not 'the-cart'", actor=story.agent)
