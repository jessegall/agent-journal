from tests.stories.core.modules.agents.helper_transcripts import row, transcript_of
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.base.command.bus import Bus
from core.base.driver.diff_count import DiffCount
from core.modules.agents.models.agent import Agent
from suites.coding.commands.record_file_edit.record_file_edit import RecordFileEdit
from tests.stories.core.support.coding_fixtures import BuilderWithUser
import os


def test_open_worker_and_helper_details_fill_the_window_and_scroll_inside_it(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    transcript = [row("assistant", f"Transcript row {number}\n" + "A longer message in the agent conversation.\n" * 8) for number in range(120)]
    transcript_of(tmp_path, monkeypatch, "detail-worker", *transcript)
    transcript_of(tmp_path, monkeypatch, "detail-helper", *transcript)
    worker = story.new_row_id(f"agent start detail-worker claude worker --parent {story.agent.id} --environment main")
    helper = story.new_row_id(f"agent start detail-helper claude helper --parent {story.agent.id} --environment main")
    with server_story(story) as server:
        expect_browser(server, "agentDetail.browser.mjs", [str(worker), str(helper), "/tmp/journal-worker-475-agent-detail.png"])


def test_agent_details_animate_and_lists_reach_the_edges(new_story, tmp_path, monkeypatch):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    helper = story.new_row_id(f"agent start s-2 claude worker --parent {story.agent.id} --environment main")
    transcript_of(tmp_path, monkeypatch, "s-2", row("assistant", "The work is complete"))
    environment_id = story.row(Agent, helper).environment_id
    story.container.get(Bus).run(RecordFileEdit(helper, DiffCount("src/cart.py", True, 3, 1)), story.agent, environment_id=environment_id)
    story.expect_text(f"file-edit list --agent {helper}", "src/cart.py", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "agentEdges.browser.mjs", [str(helper), "/tmp/journal-worker-481-agent"])


def test_selected_agent_moves_continuously_when_opened_and_closed(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    helpers = [story.new_row_id(f"agent start motion-{number} claude worker --parent {story.agent.id} --environment main") for number in range(10)]
    with server_story(story) as server:
        expect_browser(server, "agentTransition.browser.mjs", [str(helpers[3]), os.environ.get("AGENT_TRANSITION_CAPTURE", "/tmp/journal-agent-transition/after")])
