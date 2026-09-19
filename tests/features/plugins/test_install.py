import json
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Notifications, Plugins  # noqa: E402
from features.plugins.manifest import MANIFEST  # noqa: E402
from features.plugins.source import data, folder, home  # noqa: E402
from resources.base import AGENT  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

features.unload()
features.load()


def git(*args, cwd):
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=cwd, capture_output=True, text=True, timeout=30, check=True)


def repository(manifest: dict, extra: dict | None = None) -> str:
    origin = Path(tempfile.mkdtemp()) / "plugin"
    (origin / MANIFEST).parent.mkdir(parents=True)
    (origin / MANIFEST).write_text(json.dumps(manifest))
    for name, text in (extra or {}).items():
        (origin / name).write_text(text)
    git("init", "-q", "-b", "main", cwd=origin)
    git("add", "-A", cwd=origin)
    git("commit", "-q", "-m", "one", cwd=origin)
    return origin.as_uri()


WORKS = {"name": "works", "title": "Works", "version": "1.0.0", "description": "does its job",
         "setup": [{"name": "greet", "run": "echo hello > greeting.txt"}], "on": {"todo.created": "echo {}"}}

record = fresh()
plugins = Plugins(record, actor=AGENT)
source = repository(WORKS)

# PREVIEW SHOWS EVERY COMMAND and installs nothing
shown = plugins.action("preview")(source)
check("the preview names the plugin, its source and what it runs", ("Works 1.0.0" in shown, "setup greet: echo hello > greeting.txt" in shown, "on todo.created: echo {}" in shown), (True, True, True))
check("it says plainly that the plugin runs as you", "runs as you" in shown, True)
check("nothing is installed by a preview", (plugins.all(), home(record.root).exists() and list(home(record.root).iterdir())), ([], []))

# INSTALL WITHOUT --yes previews and asks for the commit
asked = plugins.action("install")(source)
check("without --yes nothing is installed and the commit is named", ("Nothing is installed yet" in asked, "--yes --ref" in asked, plugins.all()), (True, True, []))

# INSTALL WITH --yes runs the setup, keeps the folder and files the row
made = plugins.action("install")(source, yes=True)
check("the row holds the source, commit, version and manifest", (made.source, len(made.commit), made.version, made.manifest["name"], made.enabled, made.linked),
      (source, 40, "1.0.0", "works", True, False))
check("the plugin's files are in plugins/<name> and its setup ran", ((folder(record.root, "works") / MANIFEST).is_file(), (folder(record.root, "works") / "greeting.txt").read_text().strip()), (True, "hello"))
check("it has a data folder of its own and a token", (data(record.root, "works").is_dir(), len(made.token)), (True, 32))
told = next(n for n in Notifications(record).all() if n.title == "Plugin works installed")
check("the user is told what was installed, and where it came from", (told.brief.startswith(f"From {source}"), told.refs), (True, [made.ref]))

# A SECOND ONE OF THE SAME NAME is refused
check("a name already installed is refused, naming where it came from", refused(lambda: plugins.action("install")(source, yes=True)), f"a plugin named works is installed from {source}: remove it first")

# A FAILING SETUP STEP installs nothing and says which step failed
broken = fresh("broken")
rows = Plugins(broken, actor=AGENT)
why = refused(lambda: rows.action("install")(repository({**WORKS, "name": "broken", "setup": [{"name": "build", "run": "exit 3"}]}), yes=True))
check("the failing step, its code and its command are named", ("setup step 'build' failed (3): exit 3" in why, "the whole output is in" in why), (True, True))
check("and nothing is left behind", (rows.all(), [p.name for p in home(broken.root).iterdir()] if home(broken.root).exists() else []), ([], []))

# A MISSING REQUIREMENT stops before anything runs, with the hint
needs = fresh("needs")
rows = Plugins(needs, actor=AGENT)
why = refused(lambda: rows.action("install")(repository({**WORKS, "name": "needs", "requires": {"php": {"check": "exit 1", "hint": "brew install php"}}}), yes=True))
check("a requirement that fails says what to install", why, "needs needs php: brew install php")

# A LOCAL PATH is linked, not copied, and its folder is never touched
local = fresh("local")
rows = Plugins(local, actor=AGENT)
here = Path(tempfile.mkdtemp()) / "mine"
(here / MANIFEST).parent.mkdir(parents=True)
(here / MANIFEST).write_text(json.dumps({**WORKS, "name": "mine", "setup": []}))
linked = rows.action("install")(str(here), yes=True)
check("a local plugin is linked, with no commit", (linked.linked, linked.commit, folder(local.root, "mine").is_symlink()), (True, "", True))
check("the folder it was linked from is left alone", (here / MANIFEST).is_file(), True)

done()
