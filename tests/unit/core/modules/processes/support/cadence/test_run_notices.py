from engine.journal.journal_home import JournalHome
from core.modules.processes.models.enums.cadence_state import CadenceState
from core.modules.processes.models.enums.notice_kind import NoticeKind
from core.modules.processes.support.cadence.run_notices import NOTICES_FILE, RunNotices
from core.modules.processes.support.output_folder import OutputFolder


def notices(tmp_path) -> tuple[RunNotices, OutputFolder]:
    folder = OutputFolder(JournalHome(tmp_path / ".journal"))
    return RunNotices(folder), folder


def test_the_same_kind_is_refused_within_ten_minutes_and_allowed_after(tmp_path):
    record, _ = notices(tmp_path)
    record.recorded(4, NoticeKind.NO_OUTPUT, 100.0)
    assert not record.allowed(4, NoticeKind.NO_OUTPUT, 699.0)
    assert record.allowed(4, NoticeKind.NO_OUTPUT, 700.0)


def test_another_kind_is_allowed_at_once(tmp_path):
    record, _ = notices(tmp_path)
    record.recorded(4, NoticeKind.NO_OUTPUT, 100.0)
    assert record.allowed(4, NoticeKind.SPARSE, 101.0)


def test_the_fourth_notice_of_a_run_is_refused_even_after_a_clear(tmp_path):
    record, _ = notices(tmp_path)
    for category in (NoticeKind.NO_OUTPUT, NoticeKind.SPARSE, NoticeKind.STOPPED_WRITING):
        record.recorded(4, category, 100.0)
    record.cleared(4)
    assert not record.allowed(4, NoticeKind.NO_OUTPUT, 2000.0)


def test_a_clear_after_streaming_lets_the_same_kind_come_again(tmp_path):
    record, _ = notices(tmp_path)
    record.recorded(4, NoticeKind.SPARSE, 100.0)
    record.cleared(4)
    assert record.allowed(4, NoticeKind.SPARSE, 101.0)


def test_the_stuck_warning_comes_once_per_silence_and_again_after_a_growth(tmp_path):
    record, _ = notices(tmp_path)
    record.recorded(4, NoticeKind.FROZEN, 100.0)
    assert not record.allowed(4, NoticeKind.FROZEN, 5000.0)
    record.cleared(4)
    assert record.allowed(4, NoticeKind.FROZEN, 5001.0)


def test_the_stuck_warning_is_not_held_back_by_three_notices_and_does_not_count_among_them(tmp_path):
    record, _ = notices(tmp_path)
    for category in (NoticeKind.NO_OUTPUT, NoticeKind.SPARSE, NoticeKind.STOPPED_WRITING):
        record.recorded(4, category, 100.0)
    assert record.allowed(4, NoticeKind.FROZEN, 101.0)
    record.recorded(4, NoticeKind.FROZEN, 101.0)
    assert record.kept(4)[0] == 3


def test_printing_again_lets_the_stuck_warning_come_again_and_keeps_the_other_kinds(tmp_path):
    record, _ = notices(tmp_path)
    record.recorded(4, NoticeKind.NO_OUTPUT, 100.0)
    record.recorded(4, NoticeKind.FROZEN, 150.0)
    record.clear_frozen(4)
    assert (record.allowed(4, NoticeKind.FROZEN, 160.0), record.allowed(4, NoticeKind.NO_OUTPUT, 160.0)) == (True, False)


def test_damaged_text_reads_as_no_record(tmp_path):
    record, folder = notices(tmp_path)
    folder.write(4, NOTICES_FILE, "total x\nfrozen one two")
    assert record.allowed(4, NoticeKind.FROZEN, 100.0)


def test_streaming_has_no_notice_kind():
    assert (NoticeKind.of(CadenceState.STREAMING), NoticeKind.of(CadenceState.SPARSE)) == (None, NoticeKind.SPARSE)
