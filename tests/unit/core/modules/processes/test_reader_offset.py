from core.base.journal_home import JournalHome
from core.modules.processes.support.output_folder import OutputFolder


def folder(tmp_path) -> OutputFolder:
    return OutputFolder(JournalHome(tmp_path / ".journal"))


def test_a_reader_goes_on_at_its_offset_while_the_file_grows(tmp_path):
    processes = folder(tmp_path)
    processes.write_output(4, 1, "line one\nline two\n")
    assert processes.reader_offset(4, 1, 9) == 9


def test_a_reader_at_the_end_of_the_file_stays_there(tmp_path):
    processes = folder(tmp_path)
    processes.write_output(4, 1, "line\n")
    assert processes.reader_offset(4, 1, 5) == 5


def test_a_reader_past_the_end_of_a_cut_file_starts_again(tmp_path):
    processes = folder(tmp_path)
    processes.write_output(4, 1, "the kept end\n")
    assert processes.reader_offset(4, 1, 1000) == 0
    assert processes.reader_bytes_after(4, 1, 0) == b"the kept end\n"


def test_a_reader_of_the_whole_run_counts_every_part(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "echo one; echo two", ["echo one", "echo two"])
    processes.write_output(4, 1, "one\n")
    processes.write_output(4, 2, "two\n")
    assert processes.reader_offset(4, 0, 8) == 8
    assert processes.reader_offset(4, 0, 9) == 0


def test_a_reader_of_a_part_with_no_file_yet_starts_at_the_start(tmp_path):
    assert folder(tmp_path).reader_offset(4, 3, 0) == 0
