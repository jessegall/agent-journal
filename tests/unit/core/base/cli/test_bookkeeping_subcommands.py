import json

from tests.unit.core.base.cli.test_console import console, run


def test_event_and_refusal_lists_show_what_a_command_wrote_and_refused(tmp_path):
    container = console(tmp_path)
    run(container, "item", "make", "Dune")
    run(container, "item", "make", "Dune")
    code, output_text = run(container, "event", "list", "--json")
    assert code == 0 and [(row["event"], row["row_id"]) for row in json.loads(output_text)["rows"]] == [("item.create", 1), ("registry.sync", 1)]
    code, output_text = run(container, "event", "show", "2")
    assert code == 0 and "event: item.create\n" in output_text
    code, output_text = run(container, "refusal", "list", "--json")
    assert code == 0 and [(row["command"], row["reason"]) for row in json.loads(output_text)["rows"]] == [("item make", "an item with that title exists already")]


def test_a_missing_event_or_refusal_is_refused_by_noun(tmp_path):
    container = console(tmp_path)
    assert run(container, "event", "show", "9") == (1, "no event 9: journal event list shows what there is\n")
    assert run(container, "refusal", "show", "9")[0] == 1


def test_events_and_refusals_cannot_be_made(tmp_path):
    assert run(console(tmp_path), "event", "make")[0] == 2
