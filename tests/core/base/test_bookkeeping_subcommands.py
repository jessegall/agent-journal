import json

from tests.core.base.test_console import console, run


def test_event_and_refusal_lists_show_what_a_command_wrote_and_refused(tmp_path):
    container = console(tmp_path)
    run(container, "loan", "make", "Dune")
    run(container, "loan", "make", "Dune")
    code, printed = run(container, "event", "list", "--json")
    assert code == 0 and [(row["event"], row["row_id"]) for row in json.loads(printed)["rows"]] == [("loan.create", 1)]
    code, printed = run(container, "event", "show", "1")
    assert code == 0 and "event: loan.create\n" in printed
    code, printed = run(container, "refusal", "list", "--json")
    assert code == 0 and [(row["command"], row["reason"]) for row in json.loads(printed)["rows"]] == [("loan make", "a loan with that title exists already")]


def test_a_missing_event_or_refusal_is_refused_by_noun(tmp_path):
    container = console(tmp_path)
    assert run(container, "event", "show", "9") == (1, "no event 9: journal event list shows what there is\n")
    assert run(container, "refusal", "show", "9")[0] == 1


def test_events_and_refusals_cannot_be_made(tmp_path):
    assert run(console(tmp_path), "event", "make")[0] == 2
