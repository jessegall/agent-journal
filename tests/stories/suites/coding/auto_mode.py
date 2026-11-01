from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask


def two_more(story):
    story.run('task make "Write the notes" --environment main --priority low', actor=story.agent)
    story.run('task make "Fix the totals" --environment main --priority high', actor=story.agent)


def started_holder(story, task_id: int) -> str:
    return story.run(f"task show {task_id}", actor=story.agent).output_text


def test_closing_the_task_in_hand_starts_the_most_urgent_open_one_for_the_same_agent(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    two_more(story)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    assert "state: started" in started_holder(story, 3) and f"holder_id: {story.agent.id}" in started_holder(story, 3)
    assert "state: open" in started_holder(story, 2)


def test_cancelling_blocking_or_releasing_the_task_in_hand_starts_the_next_too(new_story):
    for move in ('task cancel 1 --reason "not needed"', 'task block 1 --reason "waits for the price list"', "task release 1"):
        story = new_story(fixture=BuilderWithStartedTask)
        two_more(story)
        story.run(move, actor=story.agent)
        story.run_listeners()
        assert "state: started" in started_holder(story, 3), move


def test_closing_the_last_open_task_starts_nothing(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    assert "state: started" not in story.run("task list --state started", actor=story.agent).output_text


def test_with_auto_mode_off_no_task_follows_the_one_that_left_the_hands(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    two_more(story)
    story.run("setting make journal.suites.coding.auto-mode false")
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    assert "state: open" in started_holder(story, 3)
