import pytest

from engine.errors.booted_twice_error import BootedTwiceError
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from server.work.boot_mark import BootMark


def test_the_mark_stands_while_the_journal_boots_and_goes_when_the_boot_ends(tmp_path):
    mark = BootMark(JournalHome(tmp_path))
    mark.begin()
    assert mark.is_booting
    mark.end()
    assert not mark.is_booting


def test_a_mark_a_crash_left_is_removed_before_the_next_boot(tmp_path):
    home = JournalHome(tmp_path)
    FileAccess.write(home.booting_mark, "")
    BootMark(home).end()
    assert not FileAccess.exists(home.booting_mark)


def test_a_second_boot_in_one_process_is_refused(tmp_path):
    mark = BootMark(JournalHome(tmp_path))
    mark.begin()
    mark.end()
    with pytest.raises(BootedTwiceError, match="booted a second time"):
        mark.begin()
