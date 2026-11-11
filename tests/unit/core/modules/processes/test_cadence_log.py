from engine.journal.journal_home import JournalHome
from core.modules.processes.support.cadence.cadence_log import CADENCE_FILE, CadenceLog
from core.modules.processes.support.output_folder import OutputFolder


def cadence_log(tmp_path) -> tuple[CadenceLog, OutputFolder]:
    folder = OutputFolder(JournalHome(tmp_path / ".journal"))
    return CadenceLog(folder), folder


def test_a_larger_size_appends_the_time(tmp_path):
    log, _ = cadence_log(tmp_path)
    log.record(4, 10, 100.0)
    assert log.record(4, 20, 110.0) == (100.0, 110.0)


def test_only_the_last_five_times_are_kept(tmp_path):
    log, _ = cadence_log(tmp_path)
    for step in range(8):
        log.record(4, 10 * (step + 1), 100.0 + 10 * step)
    assert log.growths(4) == (130.0, 140.0, 150.0, 160.0, 170.0)


def test_damaged_text_reads_as_empty(tmp_path):
    log, folder = cadence_log(tmp_path)
    folder.write(4, CADENCE_FILE, "ten 100.0 x")
    assert log.growths(4) == ()


def test_an_unchanged_size_adds_no_time(tmp_path):
    log, _ = cadence_log(tmp_path)
    log.record(4, 10, 100.0)
    assert log.record(4, 10, 110.0) == (100.0,)


def test_a_long_break_in_the_watching_clears_the_times_and_keeps_when_the_watching_resumed(tmp_path):
    log, _ = cadence_log(tmp_path)
    log.record(4, 10, 100.0)
    log.record(4, 20, 110.0)
    assert (log.resumed(4), log.record(4, 30, 200.0), log.resumed(4)) == (0.0, (200.0,), 200.0)


def test_the_first_look_is_no_break(tmp_path):
    log, _ = cadence_log(tmp_path)
    log.record(4, 10, 5000.0)
    assert (log.growths(4), log.resumed(4)) == ((5000.0,), 0.0)


def test_a_smaller_size_is_a_growth_too(tmp_path):
    log, _ = cadence_log(tmp_path)
    log.record(4, 500, 100.0)
    assert log.record(4, 120, 110.0) == (100.0, 110.0)
