from tests.stories.core.modules.sequences.sequences import ReleaseSequence
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_sequences_window_reads_sequences_and_runs_together(new_story):
    story = new_story(fixture=ReleaseSequence)
    story.expect_success("sequence run 1", actor=story.agent)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, window="sequences.sequences")
        board = answer["keys"]["board"]
        story.expect_rows(status == 200, board["code"] == 0, board["value"]["rows"][0]["title"] == "Release",
                          board["value"]["runs"][0]["sequence_id"] == 1)
