import json
import re
from dataclasses import dataclass
from urllib.parse import urlparse

from tests.stories.core.support import story_lines as lines
from core.testing.story_fixture import StoryFixture
from core.testing.story import Story
from tests.stories.core.support.fixtures import PlanWithTasks, UserJoined
from tests.stories.server.support.server_client import ServerStory, server_story, viewer_answer

SHARE_WINDOW = "sharing.shares"
PLAN_WINDOW = "plans.plans"


class PlanAndPersonFixture(StoryFixture):
    """Plan 1 with two open tasks, a second plan 2, and a person, Ada, beside the agent."""

    parent = PlanWithTasks

    def steps(self, story: Story) -> None:
        story.run(lines.NEW_PLAN)
        story.run('phase make --plan 2 "Elsewhere" --goal "not shared"')
        UserJoined().steps(story)

    def expect(self, story: Story) -> None:
        story.expect_success("plan show 2", "title: Version 5 core")


@dataclass(frozen=True)
class SharedLink:
    """What `share make` answers: the link's number and the path that carries its token."""

    id: int
    link: str

    @property
    def path(self) -> str:
        return urlparse(self.link).path


def shared_link(story: ServerStory) -> tuple[str, SharedLink]:
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    made = json.loads(story.story.run("share make plans:1 --json", actor=story.story.user).output_text)
    return cookie, SharedLink(int(made["id"]), str(made["link"]))


def revoke(story: ServerStory, share: SharedLink) -> None:
    story.story.expect_success(f"share revoke {share.id}", "state: revoked", actor=story.story.user)


def opened(story: ServerStory, share: SharedLink) -> str:
    status, headers, body = viewer_answer(story.viewer_port(), share.path, "", "")
    cookie = headers.get("Set-Cookie", "")
    assert status == 200 and '<div id="app">' in body and cookie.startswith("journal_share=") and "HttpOnly" in cookie and "SameSite=Strict" in cookie, (status, headers, body)
    return cookie.split(";", 1)[0]


def phases(plan: str) -> dict[str, object]:
    return {"window": PLAN_WINDOW, "line": ["phase", "list", "--plan", plan], "environment": "main"}


def read(plan: str, window: str = PLAN_WINDOW) -> dict[str, object]:
    return {"window": window, "line": ["plan", "show", plan], "environment": "main"}


def test_opening_a_link_gives_a_share_session_that_works_again_until_the_link_ends(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        first = opened(story, share)
        story.expect_viewer_status("/api/session", 200, first, text='"type": "share"')
        second = opened(story, share)
        story.expect_viewer_status("/api/session", 200, second, text='"type": "share"')


def test_the_session_route_tells_the_shell_which_row_the_link_shows_and_when_it_ends(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_status("/api/session", 200, visitor, text='"share": {"row_model": "plan", "row_id": 1, "environment": "main"')


def test_the_share_page_loads_every_file_it_names_with_only_the_share_cookie(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        _, _, page = viewer_answer(story.viewer_port(), share.path, visitor, "")
        names = re.findall(r'(?:src|href)="(/viewer/[^"]+)"|"(?:vue|@journal/window-kit)": "([^"]+)"', page)
        paths = {first or second for first, second in names}
        assert any("vendor/vue" in path for path in paths) and any("/assets/" in path for path in paths) and any("window-kit" in path for path in paths), page
        for path in paths:
            story.expect_viewer_status(path, 200, visitor)


def test_a_revoked_link_is_gone_and_a_made_up_one_is_unknown(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        cookie, share = shared_link(story)
        revoke(story, share)
        story.expect_viewer_status(share.path, 410, text='<div id="app">')
        story.expect_viewer_status("/viewer/share/not-a-link", 404, text='<div id="app">')


def test_a_revoked_link_ends_the_sessions_it_opened(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        revoke(story, share)
        story.expect_viewer_status("/api/session", 401, visitor)


def test_a_share_session_reads_the_shared_plan_and_its_phases_as_the_person_who_made_the_link_and_no_other_plan(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_line(visitor, read("1"), 200, '"code": 0')
        story.expect_viewer_line(visitor, phases("1"), 200, '"code": 0')
        story.expect_viewer_line(visitor, read("2"), 403, "not shared by the link")
        story.expect_viewer_line(visitor, phases("2"), 403, "not shared by the link")


def test_a_share_session_reads_the_phases_the_plan_holds_and_no_phase_of_another_plan(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": ["phase", "show", "1"], "environment": "main"}, 200, '"code": 0')
        story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": ["phase", "show", "4"], "environment": "main"}, 403, "not shared by the link")


def test_a_share_session_reads_only_the_lines_its_window_declares(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": ["task", "list"], "environment": "main"}, 403, "not shared by the link")
        story.expect_viewer_line(visitor, {"window": "tasks.tasks", "line": ["task", "list"], "environment": "main"}, 403, "not shared by the link")
        story.expect_viewer_line(visitor, {"window": "settings.settings", "line": ["setting", "tree"], "environment": "main"}, 403, "not shared by the link")


def test_a_share_session_reads_no_other_environment(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_line(visitor, {**read("1"), "environment": "other"}, 403, "not shared by the link")


def test_a_share_session_runs_no_command_with_or_without_waive(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        for line in (["plan", "start", "1"], ["plan", "start", "1", "--waive"], ["task", "make", "Sneaky", "--environment", "main"], ["share", "make", "plans:1"]):
            story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": line, "environment": "main"}, 403, "a share link only reads")


def test_a_share_session_sees_its_window_alone_and_no_marks_docks_layouts_settings_or_waiting(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_status("/api/windows?environment=main", 200, visitor, text=PLAN_WINDOW)
        _, _, windows = viewer_answer(story.viewer_port(), "/api/windows?environment=main", visitor, "")
        assert "tasks.tasks" not in windows and "messages.chat" not in windows, windows
        for route in ("/api/marks", "/api/docks", "/api/waiting", "/api/skills"):
            story.expect_viewer_status(f"{route}?environment=main", 403, visitor)


def test_a_share_session_follows_only_the_events_of_the_rows_it_shows(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_status("/api/events?cursor=0&environment=main", 403, visitor)
        story.expect_viewer_status("/api/events?cursor=0&environment=main&plan=1", 200, visitor)


def test_a_share_session_cannot_ask_for_a_login_key(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_status("/api/viewer-key", 403, visitor)
        story.expect_viewer_line(visitor, {"window": "phone.phones", "line": ["phone", "pair"], "environment": "main"}, 403, "a share link only reads")


def test_a_person_lists_and_revokes_their_links(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        cookie, share = shared_link(story)
        listed = story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "list"], "environment": "main"})
        assert [row["id"] for row in listed["rows"]] == [share.id], listed
        story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "revoke", str(share.id)], "environment": "main"})
        assert story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "list"], "environment": "main"})["rows"] == []


def test_a_link_stays_open_when_the_server_restarts(new_story):
    journal = new_story(fixture=PlanAndPersonFixture)
    with server_story(journal) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
    with server_story(journal) as story:
        story.expect_viewer_status("/api/session", 200, visitor, text='"type": "share"')
