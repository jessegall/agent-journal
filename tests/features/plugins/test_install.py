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

# UPGRADE moves to a newer commit, after showing what changes
moving = fresh("moving")
rows = Plugins(moving, actor=AGENT)
origin = Path(tempfile.mkdtemp()) / "plugin"
(origin / MANIFEST).parent.mkdir(parents=True)
(origin / MANIFEST).write_text(json.dumps({**WORKS, "name": "moving", "setup": []}))
git("init", "-q", "-b", "main", cwd=origin)
git("add", "-A", cwd=origin)
git("commit", "-q", "-m", "one", cwd=origin)
url = origin.as_uri()
first = rows.action("install")(url, yes=True)
check("an upgrade with nothing new says so", rows.action("upgrade")(first.n), f"moving is already at {first.commit[:12]}")
(origin / MANIFEST).write_text(json.dumps({**WORKS, "name": "moving", "version": "2.0.0", "setup": [{"name": "build", "run": "echo built > built.txt"}]}))
git("commit", "-q", "-am", "two", cwd=origin)
shown = rows.action("upgrade")(first.n)
check("without --yes it shows what will run differently and installs nothing", ("now also: setup build: echo built > built.txt" in shown, rows.load(first.n).version), (True, "1.0.0"))
moved = rows.action("upgrade")(first.n, yes=True)
check("with --yes the row moves to the new commit and the setup ran", (moved.version, moved.commit != first.commit, (folder(moving.root, "moving") / "built.txt").is_file()), ("2.0.0", True, True))

# ENABLE AND DISABLE flip the row
check("a plugin can be switched off and on", (rows.action("disable")(first.n).enabled, rows.action("enable")(first.n).enabled), (False, True))

# REMOVE takes the folder away and keeps what the plugin stored, until it is purged
kept = data(moving.root, "moving")
kept.mkdir(parents=True, exist_ok=True)
(kept / "state.json").write_text("{}")
rows.complete(first.n, "not needed")
check("removing takes the folder, not the data", (folder(moving.root, "moving").exists(), (kept / "state.json").is_file()), (False, True))
check("purge is refused while a plugin is installed", refused(lambda: rows.action("purge")(rows.action("install")(url, yes=True).n)), "plugin 2 is installed: remove it first")
check("purging a removed plugin takes its data too", (rows.action("purge")(first.n).startswith("everything moving kept in"), kept.exists()), (True, False))

# A ROW THAT NAMES NO PLUGIN takes nothing with it
bare = Plugins(moving, actor=AGENT).create("filed by hand")
Plugins(moving, actor=AGENT).complete(bare.n, "gone")
check("removing a row with no manifest leaves the plugin folders alone", data(moving.root, "").exists(), True)
check("and purging it is refused", refused(lambda: rows.action("purge")(bare.n)), f"plugin {bare.n} never named itself, so it kept nothing of its own")

# THE COMMANDS RUN IN YOUR OWN ENVIRONMENT, so what is on your PATH is on theirs
needs = fresh("path")
rows = Plugins(needs, actor=AGENT)
made = rows.action("install")(repository({**WORKS, "name": "onpath", "requires": {"python": {"check": "command -v python3", "hint": "install python"}},
                                          "setup": [{"name": "which", "run": "command -v python3 > found.txt"}]}), yes=True)
check("a requirement and a setup step both find what is on your PATH", (made.manifest["name"], (folder(needs.root, "onpath") / "found.txt").read_text().strip().endswith("python3")), ("onpath", True))

# ONE INSTALL AT A TIME: a second click while the first is running is refused
from features.plugins.source import alone  # noqa: E402
busy = fresh("busy")
rows = Plugins(busy, actor=AGENT)
held = alone(busy.root, "works")
check("a second install of the same plugin is refused while one runs", refused(lambda: rows.action("install")(source, yes=True)),
      "works is being installed already; wait for that to finish")
held.close()
check("once it is done, installing works again", rows.action("install")(source, yes=True).manifest["name"], "works")

# THE PLUGIN'S OWN NAMES are given to every command it runs
named = fresh("named")
rows = Plugins(named, actor=AGENT)
rows.action("install")(repository({**WORKS, "name": "named", "setup": [{"name": "say", "run": "printf '%s %s %s' \"$JOURNAL_PLUGIN\" \"$JOURNAL_PLUGIN_DIR\" \"$JOURNAL_PLUGIN_DATA\" > said.txt"}]}), yes=True)
said = (folder(named.root, "named") / "said.txt").read_text().split()
check("a command knows the plugin's name, its folder and its data folder", (said[0], said[1] == str(folder(named.root, "named")), said[2] == str(data(named.root, "named"))),
      ("named", True, True))

# A SERVICE'S PORT is known before the first setup step runs
ported = fresh("ported")
rows = Plugins(ported, actor=AGENT)
made = rows.action("install")(repository({**WORKS, "name": "ported", "env": {"APP_URL": "http://127.0.0.1:{ports.web}"},
                                          "services": {"web": {"run": "serve --port={port}", "port": "auto"}},
                                          "setup": [{"name": "say", "run": "printf '%s' \"$APP_URL\" > url.txt"}]}), yes=True)
url = (folder(ported.root, "ported") / "url.txt").read_text().strip()
check("the setup step is given the port the service will run on", (url.startswith("http://127.0.0.1:"), url.endswith(str(made.settings["ports"]["web"]))), (True, True))
check("and the row remembers that port", made.settings["ports"]["web"] > 0, True)

# REMOVING AN OLD ROW never takes a newer install of the same plugin with it
twice = fresh("twice")
rows = Plugins(twice, actor=AGENT)
older = rows.action("install")(source, yes=True)
newer_row = rows.create("Works", manifest=older.manifest, enabled=True, token="t", settings={}, source=source)
rows.complete(older.n, "replaced by the newer install")
check("the newer row's folder is left in place", folder(twice.root, "works").is_dir(), True)
rows.complete(newer_row.n, "and now really gone")
check("once the last row goes, so does the folder", folder(twice.root, "works").exists(), False)

done()
