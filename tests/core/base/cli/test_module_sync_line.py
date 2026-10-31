import json

from core.base.journal_home import JournalHome
from core.journal import main
from tests.core.base.module.test_module_sync import ITEM_COUNT, ITEMS


def test_journal_module_sync_syncs_a_journal_never_synced_and_then_commands_run(tmp_path, monkeypatch, capsys):
    monkeypatch.setenv("JOURNAL_HOME", str(tmp_path))
    JournalHome(tmp_path).module_list.write_text(json.dumps([ITEMS, ITEM_COUNT]))
    assert main(["item", "list"]) == 2
    assert main(["module", "sync"]) == 0
    first_sync = capsys.readouterr().out
    assert "items, item-count" in first_sync and "items 1" in first_sync and first_sync.endswith("registry: written anew\n")
    assert main(["module", "sync"]) == 0
    assert capsys.readouterr().out.endswith("migrations run: none\nregistry: unchanged\n")
    assert main(["item", "make", "Dune"]) == 0


def test_a_sync_whose_check_fails_is_refused_with_the_reason(tmp_path, monkeypatch, capsys):
    monkeypatch.setenv("JOURNAL_HOME", str(tmp_path))
    JournalHome(tmp_path).module_list.write_text(json.dumps([ITEM_COUNT]))
    assert main(["module", "sync"]) == 1
    assert capsys.readouterr().out == "module item-count depends on items, which is not installed\n"
