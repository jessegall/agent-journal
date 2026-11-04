from tests.stories.core.modules.agents.helper_transcripts import row, transcript_of
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.base.command.bus import Bus
from core.base.driver.diff_count import DiffCount
from core.modules.agents.models.agent import Agent
from suites.coding.commands.record_file_edit.record_file_edit import RecordFileEdit
from tests.stories.core.support.coding_fixtures import BuilderWithUser


def test_open_worker_and_subagent_details_fill_the_window_and_scroll_inside_it(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    transcript = [row("assistant", f"Transcript row {number}\n" + "A longer message in the agent conversation.\n" * 8) for number in range(120)]
    transcript_of(tmp_path, monkeypatch, "detail-worker", *transcript)
    transcript_of(tmp_path, monkeypatch, "detail-subagent", *transcript)
    worker = story.new_row_id(f"agent start detail-worker claude worker --parent {story.agent.id} --environment main")
    subagent = story.new_row_id(f"agent start detail-subagent claude subagent --parent {story.agent.id} --environment main")
    with server_story(story) as server:
        expect_browser(server, "agentDetail.browser.mjs", [str(worker), str(subagent), "/tmp/journal-worker-475-agent-detail.png"])


def test_agent_details_animate_and_lists_reach_the_edges(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    helper = story.new_row_id(f"agent start s-2 claude worker --parent {story.agent.id} --environment main")
    transcript_of(tmp_path, monkeypatch, "s-2", row("assistant", "The work is complete"))
    environment_id = story.row(Agent, helper).environment_id
    story.container.get(Bus).run(RecordFileEdit(helper, environment_id, DiffCount("src/cart.py", True, 3, 1)), story.agent, environment_id=environment_id)
    story.expect_text(f"file-edit list --agent {helper}", "src/cart.py", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "agentEdges.browser.mjs", [str(helper), "/tmp/journal-worker-481-agent"])
