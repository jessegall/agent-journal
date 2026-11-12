from core.modules.processes.support.reader_demands import ReaderDemands


def test_a_line_asking_for_its_help_asks_about_itself():
    assert ReaderDemands.asks_about_itself("pytest --collect-only -q tests")


def test_a_line_with_an_unclosed_quote_is_read_without_failing():
    assert not ReaderDemands.asks_about_itself("git merge -m \"it's the worker's branch")
