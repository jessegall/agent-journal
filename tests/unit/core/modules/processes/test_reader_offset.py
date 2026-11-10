from engine.journal.journal_home import JournalHome
from core.modules.processes.support.output_folder import PAGE_BYTES, OutputFolder


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


def cut_folder(tmp_path, dropped: int) -> OutputFolder:
    processes = folder(tmp_path)
    processes.write_output(4, 1, "line one\nline two\n")
    processes.write(4, "1.cut-bytes", str(dropped))
    return processes


def test_a_cut_moves_a_readers_place_by_the_bytes_dropped(tmp_path):
    assert cut_folder(tmp_path, 100).reader_offset(4, 1, 109) == 9


def test_a_reader_whose_place_was_cut_away_starts_again_though_the_file_grew_back(tmp_path):
    assert cut_folder(tmp_path, 100).reader_offset(4, 1, 50) == 0


def test_the_bytes_cut_add_up_over_the_parts_of_a_run(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "echo one; echo two", ["echo one", "echo two"])
    processes.write(4, "1.cut-bytes", "10")
    processes.write(4, "2.cut-bytes", "5")
    assert processes.cut_bytes(4) == 15
    assert processes.cut_bytes(4, 2) == 5


def test_a_page_after_a_line_longer_than_the_window_gives_that_line(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "echo long", ["echo long"])
    processes.write_output(4, 1, "x" * (PAGE_BYTES + 5))
    page = processes.page_after(4, 0, False)
    assert len(page.lines[0]) == PAGE_BYTES and page.last_byte == PAGE_BYTES
