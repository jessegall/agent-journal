from core.modules.processes.models.reader import Reader
from core.modules.processes.support.reader_run import ReaderRun
from engine.query.queries import Queries
import pytest


@pytest.mark.parametrize("line", ["collected 20 items / 19 deselected / 1 selected", "1/20 tests collected (19 deselected) in 0.05s"])
def test_a_filtered_pytest_collect_counts_only_the_selected_tests(journal, line):
    pytest_reader = journal.container.get(Queries).query(Reader).filter(name="pytest").first()
    assert journal.container.get(ReaderRun).count(pytest_reader, line, 0) == 1
