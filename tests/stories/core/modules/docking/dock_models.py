from tests.stories.core.support.fixtures import UserJoined


def test_an_item_goes_through_undock_and_dock(new_story):
    story = new_story(fixture=UserJoined)
    dock_id = story.new_row_id("dock make --environment main")
    item_id = story.new_row_id(f"dock-item make {dock_id} tasks.task task 1")
    story.expect_text(f"dock-item undock {item_id}", "state: undocked")
    story.expect_text(f"dock-item dock {item_id}", "state: docked")


def test_a_second_dock_for_one_environment_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.new_row_id("dock make --environment main")
    story.expect_refusal("dock make --environment main", "exists already")


def test_deleting_a_dock_deletes_its_items(new_story):
    story = new_story(fixture=UserJoined)
    dock_id = story.new_row_id("dock make --environment main")
    item_id = story.new_row_id(f"dock-item make {dock_id} tasks.task task 1")
    story.expect_success(f"dock delete {dock_id}")
    story.expect_refusal(f"dock-item show {item_id}", "no dock-item")


def test_docking_a_task_changes_no_task_row(new_story):
    story = new_story(fixture=UserJoined)
    task_id = story.new_row_id('task make "Fix it" --environment main', actor=story.user)
    before = story.run(f"task show {task_id}").output_text
    dock_id = story.new_row_id("dock make --environment main")
    story.new_row_id(f"dock-item make {dock_id} tasks.task task {task_id}")
    assert story.run(f"task show {task_id}").output_text == before
