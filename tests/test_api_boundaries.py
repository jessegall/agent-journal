import pytest

from commands.dispatch import Request, static
from controllers.types import Environments, Todos
from engine.record import Record
from migrations import applied
from resources.base import Refused, SYSTEM, USER
from tests.conftest import fresh


def test_environment_and_static_paths_stay_in_their_folders(tmp_path):
    for name in (".", "..", "../other", "nested/name", "nested\\name", "dotted.name"):
        with pytest.raises(Refused):
            Record(tmp_path, name)
    with pytest.raises(Refused):
        static("/../outside")


def test_environment_title_cannot_bypass_rename():
    record = fresh()
    environments = Environments(record, actor=USER)
    row = environments.create("Safe name")
    with pytest.raises(Refused):
        environments.update(row.n, title="../outside")


def test_http_body_cannot_choose_the_actor():
    record = fresh()
    request = Request(record.root, {"env": record.env, "type": "todo"}, {}, {"actor": "system"})
    assert request.controller().actor == USER
    assert "actor" not in request.body


def test_attachment_is_not_installed_when_the_row_cannot_save(tmp_path, monkeypatch):
    record = fresh()
    todos = Todos(record, actor=USER)
    row = todos.create("A row")
    source = tmp_path / "attachment.txt"
    source.write_text("content")

    def refuse(*args, **kwargs):
        raise Refused("cannot save")

    monkeypatch.setattr(todos, "save", refuse)
    with pytest.raises(Refused):
        todos.attach(row.n, str(source))
    assert not (todos.folder(row.n) / source.name).exists()


def test_shipped_row_cannot_be_stamped_or_moved():
    record = fresh()
    row = Todos(record, actor=SYSTEM).create("Shipped row", system=True)
    todos = Todos(record, actor=USER)
    with pytest.raises(Refused):
        todos.stamp(row.n, changed=True)
    with pytest.raises(Refused):
        todos.move(row.n, "another")


def test_corrupt_migration_ledger_does_not_replay_history(tmp_path):
    (tmp_path / "migrations.json").write_text("not json")
    with pytest.raises(Refused):
        applied(tmp_path)
