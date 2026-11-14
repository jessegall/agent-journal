import pytest

from tests.integration.support.integration_server import integration_server

DOCK_TYPE = "tasks.task"
CHAT_KEYS = {"messages", "marks", "docks", "pins", "mark-motion", "voice-profile", "voice-avatar", "voice-avatar-shown"}


# a user, Ada, logged in to the viewer, and one message of hers in the chat
@pytest.fixture
def chat(journal):
    user = journal.make_user()
    assert journal.run('message send "Hello" --environment main', user).code == 0
    with integration_server(journal) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada")), user


def test_a_window_with_no_data_only_header_gets_the_keys_on_screen_and_what_it_declares(chat):
    server, cookie, _ = chat
    status, answer = server.window_data(cookie)
    assert status == 200 and set(answer["keys"]) == CHAT_KEYS, answer
    assert answer["keys"]["messages"]["code"] == 0 and answer["keys"]["messages"]["value"]["rows"][0]["text"] == "Hello"
    assert answer["declared"]["messages"]["events"] == ["message.*"]


def test_the_data_only_header_runs_only_those_keys(chat):
    server, cookie, _ = chat
    status, answer = server.window_data(cookie, keys="pins,docks")
    assert status == 200 and set(answer["keys"]) == {"pins", "docks"}


def test_a_state_argument_reaches_only_its_own_key(chat):
    server, cookie, _ = chat
    status, answer = server.window_data(cookie, keys="messages", query="environment=main&messages.limit=1")
    assert status == 200 and len(answer["keys"]["messages"]["value"]["rows"]) == 1


def test_a_request_without_a_known_window_or_key_is_refused(chat):
    server, cookie, _ = chat
    assert server.window_data(cookie, window="")[0] == 400
    assert server.window_data(cookie, window="no.window")[0] == 400
    assert server.window_data(cookie, keys="nothing")[0] == 400
    assert server.window_data(cookie, query="tab=x")[0] == 400


def test_a_key_that_fails_leaves_the_others(chat):
    server, cookie, _ = chat
    status, answer = server.window_data(cookie, keys="messages,pins", query="environment=main&messages.limit=notanumber")
    assert status == 200 and answer["keys"]["messages"]["code"] != 0 and answer["keys"]["pins"]["code"] == 0


def test_no_session_is_refused(chat):
    server, _, _ = chat
    assert server.window_data("", keys="pins")[0] == 401


def test_a_docked_card_reads_its_type_first_read_of_its_target_under_its_own_key(chat):
    server, cookie, user = chat
    task = server.journal.new_row_id('task make "Docked work" --environment main', user)
    item = server.journal.new_row_id(f"dock-item make 1 {DOCK_TYPE} task {task} --environment main --skip-guard docking.item-title --skip-reason 'the title is not what this test reads'", user)
    status, answer = server.window_data(cookie, keys=f"dock.{item}")
    assert status == 200 and answer["keys"][f"dock.{item}"]["value"]["title"] == "Docked work"
    assert f"dock.{item}" not in server.window_data(cookie)[1]["keys"]


def test_a_key_with_an_id_fills_its_line_and_needs_a_number(chat):
    server, cookie, _ = chat
    status, answer = server.window_data(cookie, keys="question.77,run.77")
    assert status == 200 and answer["keys"]["question.77"]["code"] != 0 and "77" in answer["keys"]["run.77"]["error"]
    assert server.window_data(cookie, keys="dock.all")[0] == 400
