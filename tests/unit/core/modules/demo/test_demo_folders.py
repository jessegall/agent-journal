from core.base.clock import Clock
import os
import subprocess

from core.modules.demo.support.demo_folders import DEMO_LIFE_SECONDS, START_SECONDS, DemoFolders


def demo_folder(root, name, age_seconds, pid=None):
    folder = root / name
    (folder / ".journal").mkdir(parents=True)
    if pid is not None:
        (folder / ".journal" / "server.pid").write_text(str(pid))
    older_time = os.stat(folder).st_mtime - age_seconds
    os.utime(folder, (older_time, older_time))
    return folder


def finished_pid() -> int:
    process = subprocess.run(["sh", "-c", "echo $$"], capture_output=True, text=True, check=True)
    return int(process.stdout)


def test_a_folder_whose_demo_ended_or_crashed_goes_and_a_young_folder_stays(tmp_path):
    ended = demo_folder(tmp_path, "journal-demo-ended", START_SECONDS + 1)
    crashed = demo_folder(tmp_path, "journal-demo-crashed", START_SECONDS + 1, finished_pid())
    starting = demo_folder(tmp_path, "journal-demo-starting", 0)
    assert DemoFolders(Clock(), [tmp_path]).prune() == 2
    assert not ended.exists() and not crashed.exists() and starting.exists()


def test_a_running_demo_stays_until_it_is_older_than_a_day_and_is_then_stopped(tmp_path):
    recent_server = subprocess.Popen(["cat"], stdin=subprocess.PIPE)
    old_server = subprocess.Popen(["cat"], stdin=subprocess.PIPE)
    recent = demo_folder(tmp_path, "journal-demo-recent", START_SECONDS + 1, recent_server.pid)
    old = demo_folder(tmp_path, "journal-demo-old", DEMO_LIFE_SECONDS + 1, old_server.pid)
    assert DemoFolders(Clock(), [tmp_path]).prune() == 0
    assert old_server.wait(10) != 0
    assert recent_server.poll() is None and recent.exists() and old.exists()
    recent_server.kill()
    recent_server.wait(10)
    assert DemoFolders(Clock(), [tmp_path]).prune() == 2


def test_a_folder_of_another_name_is_left_alone(tmp_path):
    unrelated = demo_folder(tmp_path, "journal-notes", DEMO_LIFE_SECONDS)
    assert DemoFolders(Clock(), [tmp_path]).prune() == 0
    assert unrelated.exists()
