from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from server.viewer.request_trace import RequestTrace
from server.viewer.request_trace_settings import RequestTraceSettings

SIZE = 10


def test_disabled_trace_writes_no_file(tmp_path):
    trace = RequestTrace(JournalHome(tmp_path), Clock())
    trace.record(["task", "list"], "cli", 1.0, 0.0, 0)
    trace.complete_reads(1, ())
    assert trace.counts["disabled"] == 1
    assert not trace.trace_file.lines.path.exists()


def test_enabled_trace_appends_without_the_database(tmp_path):
    trace = RequestTrace(JournalHome(tmp_path), Clock())
    trace.configuration = RequestTraceSettings(True, SIZE)
    trace.record(["task", "list"], "cli", 1.0, 0.0, 0)
    assert (trace.counts["recorded"], trace.counts["dropped"], trace.container) == (1, 0, None)
    assert trace.trace_file.lines.path.read_text().count("\n") == 1
