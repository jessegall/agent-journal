
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import StartedPlanTask
from tests.stories.server.support.server_client import server_story
from engine.testing.stories.counted_connections import CountedConnections

SESSION = "s-1"


def test_a_server_stop_closes_every_kept_connection(new_story):
    story = new_story(fixture=StartedPlanTask)
    with CountedConnections(story.home) as connections:
        with server_story(story) as running:
            running.run_as(lines.TASK_CLOSE, SESSION)
            running.expect_eventually(lines.SECOND_TASK_DETAILS, "state: started")
    story.expected(connections.count > 0 and connections.open_count() == 0, f"{connections.open_count()} of {connections.count} connections stayed open")
