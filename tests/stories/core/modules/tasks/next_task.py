from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask


def with_two_more(story):
    story.run('task make "Write the notes" --environment main --priority low', actor=story.user if hasattr(story, "user") else story.agent)
    story.run('task make "Fix the totals" --environment main --priority high', actor=story.user if hasattr(story, "user") else story.agent)


def test_closing_the_task_in_hand_starts_the_most_urgent_open_one_for_the_same_agent(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    with_two_more(story)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_success("task show 3", "state: started", f"holder_id: {story.agent.id}")
    story.expect_success("task show 2", "state: open")


def test_cancelling_the_task_in_hand_starts_the_next_one_too(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    with_two_more(story)
    story.run('task cancel 1 --reason "not needed"', actor=story.agent)
    story.run_listeners()
    story.expect_success("task show 3", "state: started")


def test_closing_the_last_open_task_starts_nothing(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_absent("task list --state started", "task", actor=story.agent)
