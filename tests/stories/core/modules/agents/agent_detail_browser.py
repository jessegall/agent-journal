from tests.stories.core.modules.agents.helper_transcripts import row, transcript_of
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_open_worker_and_subagent_details_fill_the_window_and_scroll_inside_it(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    transcript = [row("assistant", f"Transcript row {number}\n" + "A longer message in the agent conversation.\n" * 8) for number in range(120)]
    transcript_of(tmp_path, monkeypatch, "detail-worker", *transcript)
    transcript_of(tmp_path, monkeypatch, "detail-subagent", *transcript)
    worker = story.new_row_id(f"agent start detail-worker claude worker --parent {story.agent.id} --environment main")
    subagent = story.new_row_id(f"agent start detail-subagent claude subagent --parent {story.agent.id} --environment main")
    with server_story(story) as server:
        expect_browser(server, "agentDetail.browser.mjs", [str(worker), str(subagent), "/tmp/journal-worker-464-agent-detail.png"])
