from controllers.types import Environments, Todos
from engine.record import Record
from engine.sessions import Sessions
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_rename_moves_the_folder_rebinds_sessions_and_remove_puts_it_in_the_attic():
    record = fresh()
    envs = Environments(record, actor=AGENT, session="s-1")
    made = envs.create("scratch")
    Todos(Record(record.root, "scratch"), actor=USER).create("keep me")
    envs.switch(made.n)
    (record.root / "runtime" / "env").write_text("scratch")

    renamed = envs.rename(made.n, "kept")
    assert renamed.title == "kept", "rename changes the title"
    assert ((record.root / "environments" / "kept" / "todo").is_dir() and not (record.root / "environments" / "scratch").exists()) is True, \
        "rename moves the folder with everything in it"
    assert (Sessions(record.root).environment("s-1"), (record.root / "runtime" / "env").read_text()) == ("kept", "kept"), \
        "rename rebinds the sessions on it and the project's start environment"
    assert refused(lambda: envs.rename(made.n, "kept")) == "environment 'kept' exists", "a name in use is refused"

    assert refused(lambda: envs.complete(made.n, yes=True)).startswith("environment 'kept' is held") is True, \
        "remove refuses while the environment is held"
    home = envs.create(record.env)
    envs.switch(home.n)
    assert refused(lambda: envs.complete(made.n)) == "environment 'kept' holds 1 open todos; --yes removes it anyway (its record goes to the attic)", \
        "remove refuses while rows are open, naming them"
    envs.complete(made.n, yes=True)
    assert ((record.root / "environments" / "kept").exists(), [p.name.rsplit("-", 1)[0] for p in (record.root / "attic").iterdir()], [e.title for e in envs.all()]) == \
        (False, ["kept"], [record.env]), "remove with --yes puts the record in the attic and takes the row away"
    assert envs.create("kept").title == "kept", "the name is free again"
