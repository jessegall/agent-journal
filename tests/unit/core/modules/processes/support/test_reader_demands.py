from core.modules.processes.support.reader_demands import ReaderDemands


def test_a_line_asking_for_its_help_is_a_help_request():
    assert ReaderDemands.is_help_request("pytest --collect-only -q tests")


def test_a_line_with_an_unclosed_quote_is_read_without_failing():
    assert not ReaderDemands.is_help_request("git merge -m \"it's the worker's branch")
