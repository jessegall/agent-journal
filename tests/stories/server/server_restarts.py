from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.code_folders import SampleCodeFolders
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.server_process import ServerProcess


def test_a_request_after_the_code_changed_gets_409_runs_nothing_and_the_server_releases_its_files(new_story, tmp_path):
    code_file = tmp_path / "code" / "a.py"
    code_file.parent.mkdir()
    code_file.write_text("x = 1\n")
    with server_story(new_story(fixture=ThreeTasks), SampleCodeFolders([code_file.parent])) as story:
        code_file.write_text("x = 22\n")
        story.expect_stale_answer_and_released_files('task make "Fourth" --environment main')


def test_a_stop_request_is_answered_and_the_server_stops(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_stop()


def test_a_server_process_stopped_by_sigterm_removes_its_socket_and_pid_file_and_lets_the_lock_go(new_story):
    with ServerProcess(new_story(fixture=ThreeTasks).home) as server:
        server.expect_health()
        server.expect_stop_on_sigterm()


def test_a_second_server_process_beside_a_running_one_exits_at_once(new_story):
    with ServerProcess(new_story(fixture=ThreeTasks).home) as server:
        server.expect_health()
        server.expect_second_server_exits()
