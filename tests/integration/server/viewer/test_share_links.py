import http.client
import json
import re

import pytest

from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_harness import viewer_answer
from tests.integration.support.share_links import opened, plan_and_person, shared_link

SHARE_WINDOW = "sharing.shares"
PLAN_WINDOW = "plans.plans"


@pytest.fixture
def plan_server(journal):
    user = plan_and_person(journal)
    with integration_server(journal) as server:
        yield server, user


@pytest.fixture
def shared_plan_link(plan_server):
    server, user = plan_server
    return server, user, shared_link(server, user)


def phases(plan: str) -> dict[str, object]:
    return {"window": PLAN_WINDOW, "line": ["phase", "list", "--plan", plan], "environment": "main"}


def read(plan: str, window: str = PLAN_WINDOW) -> dict[str, object]:
    return {"window": window, "line": ["plan", "show", plan], "environment": "main"}


def test_the_session_route_tells_the_shell_which_row_the_link_shows_and_when_it_ends(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_status("/api/session", 200, visitor, text='"share": {"row_model": "plan", "row_id": 1, "window": {')


def test_a_stale_person_cookie_beside_the_share_cookie_does_not_hide_the_share_session(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_status("/api/session", 200, f"journal_session=a-session-from-another-journal; {visitor}", text='"type": "share"')


def test_the_share_page_loads_every_file_it_names_with_only_the_share_cookie(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    _, _, page = viewer_answer(story.viewer_port(), share.path, visitor, "")
    names = re.findall(r'(?:src|href)="(/viewer/[^"]+)"|"(?:vue|@journal/window-kit)": "([^"]+)"', page)
    paths = {first or second for first, second in names}
    for part in ("vendor/vue", "/assets/", "window-kit"):
        assert any(part in path for path in paths), paths
    for path in paths:
        story.expect_viewer_status(path, 200, visitor)


def test_the_plans_window_of_a_share_loads_and_reads_the_shared_plan_with_only_the_share_cookie(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    _, _, session = viewer_answer(story.viewer_port(), "/api/session", visitor, "")
    entry = json.loads(session)["share"]["window"]["entry_url"]
    story.expect_viewer_status(entry, 200, visitor, text="plans")
    story.expect_viewer_line(visitor, {"window": "plans.plans", "line": ["plan", "show", "1"], "environment": "main"}, 200, '"code": 0')
    story.expect_viewer_line(visitor, {"window": "plans.plans", "line": ["plan", "progress", "1"], "environment": "main"}, 200, '"code": 0')
    story.expect_viewer_line(visitor, {"window": "plans.plans", "line": ["phase", "list", "--plan", "1", "--oldest"], "environment": "main"}, 200, '"code": 0')


def test_a_live_link_page_carries_no_gone_mark(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    _, _, page = viewer_answer(story.viewer_port(), share.path, "", "")
    assert "journal-share" not in page


def test_a_dead_link_page_clears_the_share_cookie_a_visitor_holds(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    _, headers, _ = viewer_answer(story.viewer_port(), "/viewer/share/not-a-link", visitor, "")
    assert f"{story.cookie_name('journal_share')}=;" in headers.get("Set-Cookie", "") and "Max-Age=0" in headers["Set-Cookie"], headers


def test_a_share_session_reads_the_shared_plan_and_its_phases_as_the_person_who_made_the_link_and_no_other_plan(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_line(visitor, read("1"), 200, '"code": 0')
    story.expect_viewer_line(visitor, phases("1"), 200, '"code": 0')
    story.expect_viewer_line(visitor, read("2"), 403, "not shared by the link")
    story.expect_viewer_line(visitor, phases("2"), 403, "not shared by the link")


def test_a_share_session_reads_the_phases_the_plan_holds_and_no_phase_of_another_plan(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": ["phase", "show", "1"], "environment": "main"}, 200, '"code": 0')
    story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": ["phase", "show", "4"], "environment": "main"}, 403, "not shared by the link")


def test_a_share_session_reads_only_the_lines_its_window_declares(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": ["task", "list"], "environment": "main"}, 403, "not shared by the link")
    story.expect_viewer_line(visitor, {"window": "tasks.tasks", "line": ["task", "list"], "environment": "main"}, 403, "not shared by the link")
    story.expect_viewer_line(visitor, {"window": "settings.settings", "line": ["setting", "tree"], "environment": "main"}, 403, "not shared by the link")


def test_a_share_session_reads_no_other_environment(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_line(visitor, {**read("1"), "environment": "other"}, 403, "not shared by the link")


def test_a_share_session_runs_no_command_with_or_without_waive(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    for line in (["plan", "start", "1"], ["plan", "start", "1", "--waive"], ["task", "make", "Sneaky", "--environment", "main"], ["share", "make", "plans:1"]):
        story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": line, "environment": "main"}, 403, "a share link only reads")


def test_a_share_session_reads_no_data_route_but_its_own_session_and_stream(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    for route in ("/api/windows", "/api/waiting", "/api/marks", "/api/docks", "/api/skills", "/api/anything"):
        story.expect_viewer_status(f"{route}?environment=main", 403, visitor, text="opens only the row it shares")
    story.expect_viewer_status("/api/session", 200, visitor, text='"type": "share"')


def test_the_server_picks_the_window_that_shows_the_shared_row_and_ignores_the_name_a_client_sends(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_status("/api/session", 200, visitor, text='"window": {"name": "plans.plans"')
    story.expect_viewer_line(visitor, {"window": "settings.settings", "line": ["plan", "show", "1"], "environment": "main"}, 200, '"code": 0')


def share_events(story, cookie: str, count: int, environment: str) -> list[dict[str, object]]:
    port = story.viewer_port()
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=10)
    try:
        connection.request("GET", f"/api/events?cursor=0&environment={environment}", headers={"Host": f"127.0.0.1:{port}", "Cookie": cookie})
        response = connection.getresponse()
        assert response.status == 200, response.status
        events: list[dict[str, object]] = []
        while len(events) < count:
            line = response.readline().decode()
            if line.startswith("data: "):
                events.append(json.loads(line[6:]))
        return events
    finally:
        connection.close()


def test_a_share_session_follows_only_the_events_of_the_rows_it_shows_in_its_own_environment(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    followed = share_events(story, visitor, 4, "other")
    assert all((event["row_table"], event["row_id"]) in {("plans", 1), ("phases", 1), ("phases", 2), ("phases", 3)} for event in followed), followed


def test_a_share_session_cannot_ask_for_a_login_key(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_status("/api/viewer-key", 403, visitor)
    story.expect_viewer_line(visitor, {"window": "phone.phones", "line": ["phone", "pair"], "environment": "main"}, 403, "a share link only reads")


def test_a_person_lists_and_revokes_their_links(shared_plan_link):
    story, user, (cookie, share) = shared_plan_link
    listed = story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "list"], "environment": "main"})
    assert [row["id"] for row in listed["rows"]] == [share.id], listed
    story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "revoke", str(share.id)], "environment": "main"})
    listed = story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "list"], "environment": "main"})
    assert [row["state"] for row in listed["rows"]] == ["revoked"], listed


def test_a_link_stays_open_when_the_server_restarts(journal):
    user = plan_and_person(journal)
    with integration_server(journal) as story:
        _, share = shared_link(story, user)
        visitor = opened(story, share)
    with integration_server(journal) as story:
        story.expect_viewer_status("/api/session", 200, visitor, text='"type": "share"')


def test_a_spent_login_link_opened_with_only_a_share_cookie_is_refused(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    visitor = opened(story, share)
    key = story.viewer_key("Ada")
    story.expect_viewer_login(key)
    story.expect_viewer_status(f"/?key={key}", 401, visitor)


def test_a_share_session_reads_window_keys_with_the_rights_of_its_link(shared_plan_link):
    story, user, (_, share) = shared_plan_link
    cookie = opened(story, share)
    status, answer = story.window_data(cookie, keys="pins")
    assert status == 200 and answer["keys"]["pins"]["code"] != 0, answer

