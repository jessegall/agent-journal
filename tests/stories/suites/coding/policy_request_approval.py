from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.server_client import server_story

RUN_LIMIT = "journal.suites.coding.workers.worker-run-limit"
KEPT_LIMIT = "journal.suites.coding.workers.worker-kept-limit"
STALE = "approval 1 is closed, so it cannot begin"


def asked_by_agent(story, line: str) -> ApprovalRequest:
    story.expect_refusal(f"{line} --reason needed", "A person was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).newest().first()
    story.expect_rows(request is not None)
    return request


def accept_body(request: ApprovalRequest) -> dict[str, object]:
    return {"window": "messages.chat", "environment": "main", "line": ["approval", "accept", str(request.id)]}


def person_accepts(story, request: ApprovalRequest) -> None:
    with server_story(story) as server:
        server.viewer_line_value(server.expect_viewer_login(server.viewer_key("Ada")), accept_body(request))


def person_accepts_refused(story, request: ApprovalRequest, reason: str) -> None:
    with server_story(story) as server:
        server.expect_viewer_line(server.expect_viewer_login(server.viewer_key("Ada")), accept_body(request), 200, reason)


def test_s58_fresh_person_approval_applies_once(new_story):
    story = new_story(fixture=BuilderWithUser)
    request = asked_by_agent(story, f"setting set {RUN_LIMIT} 5 --environment main")
    story.expect_text(f"setting show {RUN_LIMIT} --environment main", "from: default", actor=story.user)
    person_accepts(story, request)
    story.expect_text(f"setting show {RUN_LIMIT} --environment main", "value: 5", "from: environment", actor=story.user)
    story.expect_success(f"setting set {RUN_LIMIT} 6 --environment main", actor=story.user)
    person_accepts_refused(story, request, "accepted is final")
    story.expect_text(f"setting show {RUN_LIMIT} --environment main", "value: 6", actor=story.user)


def test_s58_delayed_approval_preserves_newer_policy(new_story):
    story = new_story(fixture=BuilderWithUser)
    request = asked_by_agent(story, f"setting set {KEPT_LIMIT} 5 --environment main")
    story.expect_success(f"setting set {KEPT_LIMIT} 9 --environment main", actor=story.user)
    story.run_listeners()
    story.expect_text(f"approval show {request.id}", "state: closed", f"outdated: {KEPT_LIMIT} changed since this change was asked for", actor=story.user)
    person_accepts_refused(story, request, STALE)
    story.expect_text(f"setting show {KEPT_LIMIT} --environment main", "value: 9", actor=story.user)


def test_s58_project_default_change_invalidates_request(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {RUN_LIMIT} 3 --project", actor=story.user)
    request = asked_by_agent(story, f"setting set {RUN_LIMIT} 5 --environment main")
    story.expect_success(f"setting set {RUN_LIMIT} 4 --project", actor=story.user)
    story.run_listeners()
    story.expect_text(f"approval show {request.id}", "state: closed", f"outdated: {RUN_LIMIT} changed since this change was asked for", actor=story.user)
    person_accepts_refused(story, request, STALE)
    story.expect_text(f"setting show {RUN_LIMIT} --environment main", "value: 4", "from: project", actor=story.user)
