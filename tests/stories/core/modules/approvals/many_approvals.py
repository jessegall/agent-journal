import pytest

from engine.database.database import Database
from engine.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from engine.testing.examples.hook_samples import HookSamples
from server.viewer.line_route import LineRoute
from tests.stories.core.modules.approvals.support.legacy_setting_requests import UPGRADE
from tests.stories.core.modules.approvals.recovery import phone_request, phone_viewer
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder, UserBuilder
from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

TEST_ROWS_REASON = "the test reads every row it checks"


@pytest.fixture
def pending_requests(new_story):
    story = new_story(fixture=UserBuilder)
    for number in range(12):
        story.new_row_id(f'rule make "Check shop {number}"', actor=story.agent)
    requests = tuple(story.story_rows(ApprovalRequest))
    story.expect_rows(len(requests) == 12)
    return story


@pytest.fixture
def pending_viewer(pending_requests):
    with viewer_client(pending_requests) as viewer:
        yield viewer


def test_several_approvals_reach_the_agent_as_one_counted_notice(pending_requests):
    story = pending_requests
    answer = story.hook("s-1", HookSamples.prompt("Continue"))
    lines = [line for line in answer.lines if "A person was asked" in line]
    story.expect_rows(lines == ["A person was asked for 12 approvals"])
    following = story.hook("s-1", HookSamples.prompt("Continue"))
    story.expect_rows(not any("A person was asked" in line for line in following.lines))


def test_delivering_many_notices_reads_each_agent_line_once(pending_requests):
    story = pending_requests
    reads = []
    database = story.container.get(Database)
    database.connection.set_trace_callback(reads.append)
    try:
        story.hook("s-1", HookSamples.prompt("Continue"))
    finally:
        database.connection.set_trace_callback(None)
    row_reads = [sql for sql in reads if sql.startswith("SELECT * FROM agent_lines WHERE id =")]
    story.expect_rows(not row_reads)


def test_a_task_wait_does_not_create_a_person_approval(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    task = story.new_row_id('task make "Check the shop" --environment main', actor=story.agent)
    story.expect_success(f'task block {task} --until-user --reason "Ask the main agent to review the shop"', actor=story.agent)
    story.expect_rows(not tuple(story.story_rows(ApprovalRequest)))


def test_many_docked_approvals_use_one_read_through_the_viewer_route(pending_requests, pending_viewer, monkeypatch):
    story = pending_requests
    items = tuple(story.container.get(Queries).query(DockItem).filter(type="approvals.request", state=DockItemState.DOCKED).every_row(TEST_ROWS_REASON))
    reads = []
    original = LineRoute.run_line

    def recorded(route, container, window, argv, person_id, environment, shared=None):
        if argv[:1] == ["approval"]:
            reads.append(argv)
        return original(route, container, window, argv, person_id, environment, shared)

    monkeypatch.setattr(LineRoute, "run_line", recorded)
    status, answer = window_data(pending_viewer.server, pending_viewer.cookie, keys=",".join(f"dock.{item.id}" for item in items))
    story.expect_rows(status == 200, len(answer["keys"]) == 12, reads == [["approval", "pending"]],
                      all(len(outcome["value"]["rows"]) == 12 for outcome in answer["keys"].values()))


def test_a_registry_refresh_removes_a_stale_closed_approval_card(phone_request, phone_viewer):
    story, request = phone_request
    phone_viewer.value("messages.chat", ["approval", "refuse", str(request.id)])
    story.new_row_id(f"dock add approvals.request approval {request.id} --environment main", actor=story.user)
    story.expect_sync_success(UPGRADE)
    story.run_listeners()
    items = tuple(story.container.get(Queries).query(DockItem).filter(target_model="approval", target_id=request.id, state=DockItemState.DOCKED).every_row(TEST_ROWS_REASON))
    story.expect_rows(not items)
