import json

from core.base.journal_home import JournalHome
from core.journal import main
from tests.core.base.test_module_sync import LOAN_COUNT, LOANS


def test_journal_module_sync_syncs_a_journal_never_synced_and_then_commands_run(tmp_path, monkeypatch, capsys):
    monkeypatch.setenv("JOURNAL_HOME", str(tmp_path))
    JournalHome(tmp_path).module_list.write_text(json.dumps([LOANS, LOAN_COUNT]))
    assert main(["loan", "list"]) == 2
    assert main(["module", "sync"]) == 0
    assert capsys.readouterr().out.endswith("modules: loans, loan-count\nmigrations run: core 1, loans 1\nregistry: written anew\n")
    assert main(["module", "sync"]) == 0
    assert capsys.readouterr().out == "modules: loans, loan-count\nmigrations run: none\nregistry: unchanged\n"
    assert main(["loan", "make", "Dune"]) == 0


def test_a_sync_whose_check_fails_is_refused_with_the_reason(tmp_path, monkeypatch, capsys):
    monkeypatch.setenv("JOURNAL_HOME", str(tmp_path))
    JournalHome(tmp_path).module_list.write_text(json.dumps([LOAN_COUNT]))
    assert main(["module", "sync"]) == 1
    assert capsys.readouterr().out == "module loan-count depends on loans, which is not installed\n"
