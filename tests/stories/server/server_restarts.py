from server.server_files import SERVER_LOG_LIMIT_BYTES, ServerFiles
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


def test_a_stale_server_leaves_the_restart_mark_before_it_answers_and_the_next_server_removes_it(new_story, tmp_path):
    code_file = tmp_path / "code" / "a.py"
    code_file.parent.mkdir()
    code_file.write_text("x = 1\n")
    with server_story(new_story(fixture=ThreeTasks), SampleCodeFolders([code_file.parent])) as story:
        code_file.write_text("x = 22\n")
        story.expect_stale_answer_and_released_files('task make "Fourth" --environment main')
        restart_mark = ServerFiles(story.story.home).restart_mark
        assert restart_mark.exists()
        with ServerProcess(story.story.home) as server:
            server.expect_health()
            assert not restart_mark.exists()


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


def test_a_stop_ends_the_server_at_once_while_a_client_still_holds_its_connection_open(new_story):
    with ServerProcess(new_story(fixture=ThreeTasks).home) as server:
        server.expect_health()
        server.expect_stop_with_an_idle_connection()



def test_a_server_that_starts_past_the_log_limit_leaves_a_small_log_and_one_old_file(new_story):
    home = new_story(fixture=ThreeTasks).home
    log = ServerFiles(home).log
    log.parent.mkdir(parents=True, exist_ok=True)
    old_log = log.with_name("server.log.1")
    for size in (SERVER_LOG_LIMIT_BYTES + 1, SERVER_LOG_LIMIT_BYTES + 2):
        log.write_text("x" * size)
        with ServerProcess(home, logged=True) as server:
            server.expect_health()
        assert old_log.stat().st_size == size and log.stat().st_size < SERVER_LOG_LIMIT_BYTES // 100
        assert "listening on" in log.read_text() and not log.with_name("server.log.2").exists()
