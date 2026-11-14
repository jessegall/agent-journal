from engine.journal.journal_home import JournalHome
from core.modules.processes.support.output_folder import PAGE_BYTES, TAIL_BYTES, OutputFolder

LINES = "".join(f"line {number}\n" for number in range(1, 1001))


def folder(tmp_path, text: str = LINES) -> OutputFolder:
    processes = OutputFolder(JournalHome(tmp_path / ".journal"))
    processes.write_start(4, "make", ["make"])
    processes.write_output(4, 1, text)
    return processes


def test_the_newest_lines_come_first_and_say_where_they_start(tmp_path):
    page = folder(tmp_path).older_page(4, -1, 3)
    assert page.lines == ["line 998", "line 999", "line 1000"]
    assert page.last_byte == page.total == len(LINES)
    assert LINES[page.first_byte:].startswith("line 998\n")


def test_an_earlier_page_ends_where_the_last_one_started(tmp_path):
    processes = folder(tmp_path)
    newest = processes.older_page(4, -1, 3)
    older = processes.older_page(4, newest.first_byte, 3)
    assert older.lines == ["line 995", "line 996", "line 997"]
    assert older.last_byte == newest.first_byte


def test_pages_taken_to_the_start_give_every_line_once(tmp_path):
    processes = folder(tmp_path)
    collected, end = [], -1
    while end != 0:
        page = processes.older_page(4, end, 300)
        collected = [*page.lines, *collected]
        end = page.first_byte
    assert collected == LINES.splitlines()


def test_a_short_output_starts_at_its_first_byte(tmp_path):
    page = folder(tmp_path, "one\ntwo\n").older_page(4, -1, 300)
    assert page.lines == ["one", "two"] and page.first_byte == 0


def test_an_output_with_no_last_newline_keeps_its_last_line(tmp_path):
    assert folder(tmp_path, "one\ntwo").older_page(4, -1, 300).lines == ["one", "two"]


def test_an_empty_output_has_no_lines(tmp_path):
    page = folder(tmp_path, "").older_page(4, -1, 300)
    assert list(page.lines) == [] and page.total == 0


def test_a_long_line_past_the_first_window_comes_whole(tmp_path):
    long_line = "x" * (TAIL_BYTES * 3)
    assert folder(tmp_path, f"one\n{long_line}\n").older_page(4, -1, 1).lines == [long_line]


def test_a_follow_reads_only_what_is_new(tmp_path):
    processes = folder(tmp_path, "one\ntwo\n")
    page = processes.page_after(4, 4, False)
    assert page.lines == ["two"] and page.last_byte == 8


def test_a_follow_leaves_a_line_still_being_written(tmp_path):
    page = folder(tmp_path, "one\ntw").page_after(4, 0, False)
    assert page.lines == ["one"] and page.last_byte == 4


def test_the_last_line_of_an_ended_run_comes_without_its_newline(tmp_path):
    page = folder(tmp_path, "one\ntw").page_after(4, 0, True)
    assert page.lines == ["one", "tw"] and page.last_byte == 6


def test_a_follow_past_the_end_reads_nothing_and_shows_the_smaller_total(tmp_path):
    page = folder(tmp_path, "one\n").page_after(4, 1000, True)
    assert list(page.lines) == [] and page.total == 4


def test_a_follow_is_bounded_however_much_is_new(tmp_path):
    page = folder(tmp_path, "line\n" * (PAGE_BYTES // 2)).page_after(4, 0, True)
    assert page.last_byte <= PAGE_BYTES


def test_colour_codes_are_taken_out(tmp_path):
    assert folder(tmp_path, "\x1b[32mgreen\x1b[0m\n").older_page(4, -1, 1).lines == ["green"]


def test_a_chunk_reads_across_the_parts_of_a_chain(tmp_path):
    processes = OutputFolder(JournalHome(tmp_path / ".journal"))
    processes.write_start(4, "a; b", ["a", "b"])
    processes.write_output(4, 1, "one\n")
    processes.write_output(4, 2, "two\n")
    assert processes.older_page(4, -1, 5).lines == ["one", "two"]
    assert processes.page_after(4, 4, False).lines == ["two"]
