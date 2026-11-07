from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.modules.processes.support.read_output import ReadOutput
from tests.stories.server.support.server_client import server_story


def test_file_reads_fit_without_another_tool_call_and_large_reads_remain_bounded(new_story):
    story = new_story(fixture=BuilderStarted)
    output = ReadOutput(story)
    with server_story(story) as server:
        output.expect_reads(server)
