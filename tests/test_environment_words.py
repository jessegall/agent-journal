import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Environments, Todos  # noqa: E402
from engine.record import Record  # noqa: E402
from engine.sessions import Sessions  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

record = fresh()
envs = Environments(record, actor=AGENT, session="s-1")
made = envs.create("scratch")
Todos(Record(record.root, "scratch"), actor=USER).create("keep me")
envs.switch(made.n)
(record.root / "runtime" / "env").write_text("scratch")

renamed = envs.rename(made.n, "kept")
check("rename changes the title", renamed.title, "kept")
check("rename moves the folder with everything in it", (record.root / "environments" / "kept" / "todo").is_dir() and not (record.root / "environments" / "scratch").exists(), True)
check("rename rebinds the sessions on it and the project's start environment", (Sessions(record.root).environment("s-1"), (record.root / "runtime" / "env").read_text()), ("kept", "kept"))
check("a name in use is refused", refused(lambda: envs.rename(made.n, "kept")), "environment 'kept' exists")

check("remove refuses while the environment is held", refused(lambda: envs.complete(made.n, yes=True)).startswith("environment 'kept' is held"), True)
home = envs.create(record.env)
envs.switch(home.n)
check("remove refuses while rows are open, naming them", refused(lambda: envs.complete(made.n)), "environment 'kept' holds 1 open todos; --yes removes it anyway (its record goes to the attic)")
said = envs.complete(made.n, yes=True)
check("remove with --yes puts the record in the attic and takes the row away", ((record.root / "environments" / "kept").exists(), [p.name.rsplit("-", 1)[0] for p in (record.root / "attic").iterdir()], [e.title for e in envs.all()]), (False, ["kept"], [record.env]))
check("the name is free again", envs.create("kept").title, "kept")

done()
