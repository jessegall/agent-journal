import pytest

from tests.integration.support.integration_server import integration_server

NOTES = "tests.stories.core.modules.viewer.support.window_samples:NotesSuiteOfNotesModule"
SANDBOX_POLICY = "sandbox allow-scripts; default-src 'none'"


# a user, Ada, logged in to a journal with the sample notes module and its stacked state window
@pytest.fixture
def notes_server(journal):
    user = journal.make_user()
    synced = journal.synced_with(NOTES)
    assert synced.code == 0, synced.text
    with integration_server(journal) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada")), user


def test_a_module_file_outside_its_web_dist_is_refused(notes_server):
    server, cookie, _ = notes_server
    server.expect_viewer_status("/modules/notes/../../window_samples.py", 404, cookie)


def test_a_stacked_state_windows_file_is_served_with_its_type_nosniff_and_the_sandbox_policy(notes_server):
    server, cookie, _ = notes_server
    server.expect_viewer_headers("/modules/notes/board.html", cookie, {"Content-Type": "text/html", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-cache",
                                                                      "Content-Security-Policy": SANDBOX_POLICY})


def test_an_unknown_environment_is_answered_with_its_reason(notes_server):
    server, cookie, _ = notes_server
    server.expect_viewer_status("/api/windows?environment=nowhere", 404, cookie, text="no environment named nowhere")


def test_a_stacked_state_window_reads_nothing_until_the_person_allows_its_reads(notes_server):
    server, cookie, user = notes_server
    line = {"window": "notes.board", "line": ["task", "list"], "environment": "main"}
    server.expect_viewer_line(cookie, line, 200, "notes.board may run task list once you allow it")
    assert server.journal.run("window allow notes.board --type reads --environment main", user).code == 0
    server.expect_viewer_line(cookie, line, 200, '"code": 0')


def test_a_stacked_state_loads_its_own_files_and_the_bridge_without_the_session_cookie_from_any_origin(notes_server):
    server, _, _ = notes_server
    server.expect_viewer_headers("/modules/notes/board.html", "", {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"})
    server.expect_viewer_headers("/viewer/kit/frame-bridge.js", "", {"Content-Type": "text/javascript", "Access-Control-Allow-Origin": "*"})
    server.expect_viewer_status("/viewer/", 401)


def test_the_tasks_window_offers_ten_tasks_a_page_among_a_few_fixed_choices(person_server):
    server, cookie, _ = person_server
    server.expect_viewer_status("/api/windows?environment=main", 200, cookie,
                                text='{"choices": [["5", "5"], ["10", "10"], ["25", "25"], ["50", "50"]], "control": "choice", "default": "10", "key": "rows", "label": "Tasks per page"}')
