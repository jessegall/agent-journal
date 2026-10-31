from tests.stories.tasks.task_lifecycle import started_story


def test_a_task_is_shown_whole(story_on):
    story = started_story(story_on)
    story.run('task make "Fix the cart" --brief "the total is wrong" --priority high --environment main')
    story.expect_success("task show 1", "title: Fix the cart", "brief: the total is wrong", "priority: high", "creator_id: 1")


def test_tasks_are_listed_newest_first_a_page_at_a_time_and_by_state(story_on):
    story = started_story(story_on)
    for title in ("First", "Second", "Third"):
        story.run(f'task make "{title}" --environment main')
    story.run("task start 2", actor=story.agent)
    story.expect_success("task list --limit 2", "3  Third  open  normal", f"2  {story.agent.id}  Second  started  normal", "page 1, 2 of 3 rows: --page 2 for the next")
    story.expect_success("task list --limit 2 --page 2", "1  First  open  normal")
    story.expect_success("task list --state started", f"2  {story.agent.id}  Second  started  normal")


def test_an_edit_changes_only_the_fields_named(story_on):
    story = started_story(story_on)
    story.run('task make "Fix the cart" --brief "the total is wrong" --environment main')
    story.expect_success('task edit 1 --title "Fix the cart total"', "title: Fix the cart total", "brief: the total is wrong", "version: 2")


def test_a_task_is_deleted_only_while_open_or_cancelled(story_on):
    story = started_story(story_on)
    story.run('task make "First" --environment main')
    story.run('task make "Second" --environment main')
    story.run("task start 2", actor=story.agent)
    story.expect_success("task delete 1", "the task is deleted")
    story.expect_refusal("task delete 2", "started")
