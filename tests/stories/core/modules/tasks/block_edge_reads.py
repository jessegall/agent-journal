from tests.stories.core.modules.tasks.task_dependencies import three_tasks
from tests.stories.support.statement_counts import reads_in_last_request

EDGE_READ = "FROM task_dependencies"
FILTERED_EDGE_READ = "FROM task_dependencies WHERE task_id IN"


def test_blocking_a_task_reads_only_the_waits_reachable_from_its_target(new_story):
    story = three_tasks(new_story)
    story.run("task depend 2 --on 3")
    story.expect_success("task block 1 --on task:2", "state: blocked")
    reads = reads_in_last_request(story, EDGE_READ)
    story.expect_rows(reads > 0, reads == reads_in_last_request(story, FILTERED_EDGE_READ), detail="each read of the waits names the tasks it walks from")


def test_a_block_that_would_close_a_loop_is_refused_after_walking_the_waits(new_story):
    story = three_tasks(new_story)
    story.run("task depend 2 --on 3")
    story.expect_refusal("task block 3 --on task:2", "closes a circle")
