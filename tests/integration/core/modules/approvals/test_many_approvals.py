import pytest

from engine.database.database import Database
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from engine.testing.examples.hook_samples import HookSamples
from server.viewer.line_route import LineRoute
from tests.stories.core.modules.approvals.support.legacy_setting_requests import UPGRADE
from tests.stories.core.modules.approvals.recovery import phone_request, phone_viewer
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder, UserBuilder
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client



@pytest.fixture
def pending_requests(played):
    story = played(UserBuilder)
    for number in range(12):
        story.new_row_id(f'rule make "Check shop {number}"', actor=story.agent)
    requests = tuple(story.story_rows(ApprovalRequest))
    story.expect_rows(len(requests) == 12)
    return story


@pytest.fixture
def pending_viewer(pending_requests):
    with viewer_client(pending_requests) as viewer:
        yield viewer




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




def test_many_docked_approvals_use_one_read_through_the_viewer_route(pending_requests, pending_viewer, monkeypatch):
    story = pending_requests
    items = tuple(story.story_rows(DockItem, type="approvals.request", state=DockItemState.DOCKED))
    reads = []
    original = LineRoute.run_line

    def recorded(route, container, window, argv, person_id, environment, shared=None):
        if argv[:1] == ["approval"]:
            reads.append(argv)
        return original(route, container, window, argv, person_id, environment, shared)

    monkeypatch.setattr(LineRoute, "run_line", recorded)
    status, answer = pending_viewer.server.window_data(pending_viewer.cookie, keys=",".join(f"dock.{item.id}" for item in items))
    story.expect_rows(status == 200, len(answer["keys"]) == 12, reads == [["approval", "pending"]],
                      all(len(outcome["value"]["rows"]) == 12 for outcome in answer["keys"].values()))


