from unittest.mock import MagicMock

from core.modules.plugins.support import free_memory
from core.modules.plugins.support.free_memory import FreeMemory


def memory(log=None) -> FreeMemory:
    return FreeMemory(MagicMock(), MagicMock(), log or MagicMock())


def test_each_read_of_the_available_memory_is_the_file_as_it_is_now(tmp_path, monkeypatch):
    meminfo = tmp_path / "meminfo"
    monkeypatch.setattr(free_memory, "MEMINFO", meminfo)
    meminfo.write_text("MemTotal: 9000000 kB\nMemAvailable: 2048000 kB\n")
    assert FreeMemory.linux_megabytes() == 2000
    meminfo.write_text("MemTotal: 9000000 kB\nMemAvailable: 512000 kB\n")
    assert FreeMemory.linux_megabytes() == 500


def test_memory_that_cannot_be_read_is_not_known_and_the_log_says_so_once(tmp_path, monkeypatch):
    monkeypatch.setattr(free_memory, "MEMINFO", tmp_path / "no-such-file")
    monkeypatch.setattr(free_memory.sys, "platform", "linux")
    log = MagicMock()
    unknown = memory(log)
    assert unknown.megabytes() is None
    assert unknown.megabytes() is None
    assert log.write.call_count == 1


def test_a_reading_with_no_available_line_is_not_known(tmp_path, monkeypatch):
    meminfo = tmp_path / "meminfo"
    meminfo.write_text("MemTotal: 9000000 kB\n")
    monkeypatch.setattr(free_memory, "MEMINFO", meminfo)
    assert FreeMemory.linux_megabytes() is None
