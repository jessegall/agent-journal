import json
import subprocess

import pytest

import features
from controllers.types import Notifications, Plugins
from engine.services import want_file
from engine.stored import read_json
from features.plugins.manifest import MANIFEST
from features.plugins.source import alone, data, folder, home
from resources.base import AGENT
from tests.conftest import fresh, refused

WORKS = {"name": "works", "title": "Works", "version": "1.0.0", "description": "does its job",
         "setup": [{"name": "greet", "run": "echo hello > greeting.txt"}], "on": {"todo.created": "echo {}"}}


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def git(*args, cwd):
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=cwd, capture_output=True, text=True, timeout=30, check=True)


def repository(tmp_path, manifest, extra=None, name="plugin"):
    origin = tmp_path / name
    (origin / MANIFEST).parent.mkdir(parents=True)
    (origin / MANIFEST).write_text(json.dumps(manifest))
    for filename, text in (extra or {}).items():
        (origin / filename).write_text(text)
    git("init", "-q", "-b", "main", cwd=origin)
    git("add", "-A", cwd=origin)
    git("commit", "-q", "-m", "one", cwd=origin)
    return origin.as_uri()


def test_preview_shows_every_command_and_install_files_the_row(tmp_path):
    record = fresh()
    plugins = Plugins(record, actor=AGENT)
    source = repository(tmp_path, WORKS)

    shown = plugins.action("preview")(source)
    assert ("Works 1.0.0" in shown, "setup greet: echo hello > greeting.txt" in shown, "on todo.created: echo {}" in shown) == \
        (True, True, True), "the preview names the plugin, its source and what it runs"
    assert "runs as you" in shown, "it says plainly that the plugin runs as you"
    assert (plugins.all(), home(record.root).exists() and list(home(record.root).iterdir())) == ([], []), \
        "nothing is installed by a preview"

    asked = plugins.action("install")(source)
    assert ("Nothing is installed yet" in asked, "--yes --ref" in asked, plugins.all()) == (True, True, []), \
        "without --yes nothing is installed and the commit is named"

    made = plugins.action("install")(source, yes=True)
    assert (made.source, len(made.commit), made.version, made.manifest["name"], made.enabled, made.linked) == \
        (source, 40, "1.0.0", "works", True, False), "the row holds the source, commit, version and manifest"
    assert ((folder(record.root, "works") / MANIFEST).is_file(), (folder(record.root, "works") / "greeting.txt").read_text().strip()) == \
        (True, "hello"), "the plugin's files are in plugins/<name> and its setup ran"
    assert (data(record.root, "works").is_dir(), len(made.token)) == (True, 32), "it has a data folder of its own and a token"
    told = next(n for n in Notifications(record).all() if n.title == "Plugin works installed")
    assert (told.brief.startswith(f"From {source}"), told.refs) == (True, [made.ref]), \
        "the user is told what was installed, and where it came from"

    assert refused(lambda: plugins.action("install")(source, yes=True)) == f"a plugin named works is installed from {source}: remove it first", \
        "a name already installed is refused, naming where it came from"


def test_a_failing_setup_step_installs_nothing_and_says_which_step_failed(tmp_path):
    broken = fresh("broken")
    rows = Plugins(broken, actor=AGENT)
    why = refused(lambda: rows.action("install")(repository(tmp_path, {**WORKS, "name": "broken", "setup": [{"name": "build", "run": "exit 3"}]}), yes=True))
    assert ("setup step 'build' failed (3): exit 3" in why, "the whole output is in" in why) == (True, True), \
        "the failing step, its code and its command are named"
    assert (rows.all(), [p.name for p in home(broken.root).iterdir()] if home(broken.root).exists() else []) == ([], []), \
        "and nothing is left behind"


def test_a_missing_requirement_stops_before_anything_runs_with_the_hint(tmp_path):
    needs = fresh("needs")
    rows = Plugins(needs, actor=AGENT)
    why = refused(lambda: rows.action("install")(repository(tmp_path, {**WORKS, "name": "needs", "requires": {"php": {"check": "exit 1", "hint": "brew install php"}}}), yes=True))
    assert why == "needs needs php: brew install php", "a requirement that fails says what to install"


def test_a_local_path_is_linked_not_copied_and_its_folder_is_never_touched(tmp_path):
    local = fresh("local")
    rows = Plugins(local, actor=AGENT)
    here = tmp_path / "mine"
    (here / MANIFEST).parent.mkdir(parents=True)
    (here / MANIFEST).write_text(json.dumps({**WORKS, "name": "mine", "setup": []}))
    linked = rows.action("install")(str(here), yes=True)
    assert (linked.linked, linked.commit, folder(local.root, "mine").is_symlink()) == (True, "", True), \
        "a local plugin is linked, with no commit"
    assert (here / MANIFEST).is_file() is True, "the folder it was linked from is left alone"


def test_upgrade_moves_to_a_newer_commit_after_showing_what_changes(tmp_path):
    moving = fresh("moving")
    rows = Plugins(moving, actor=AGENT)
    origin = tmp_path / "plugin"
    (origin / MANIFEST).parent.mkdir(parents=True)
    (origin / MANIFEST).write_text(json.dumps({**WORKS, "name": "moving", "setup": []}))
    git("init", "-q", "-b", "main", cwd=origin)
    git("add", "-A", cwd=origin)
    git("commit", "-q", "-m", "one", cwd=origin)
    url = origin.as_uri()
    first = rows.action("install")(url, yes=True)
    assert rows.action("upgrade")(first.n).startswith(f"moving is already at {first.commit[:12]}") is True, \
        "an upgrade with nothing new says so"
    (origin / MANIFEST).write_text(json.dumps({**WORKS, "name": "moving", "version": "2.0.0", "setup": [{"name": "build", "run": "echo built > built.txt"}]}))
    git("commit", "-q", "-am", "two", cwd=origin)
    shown = rows.action("upgrade")(first.n)
    assert ("now also: setup build: echo built > built.txt" in shown, rows.load(first.n).version) == (True, "1.0.0"), \
        "without --yes it shows what will run differently and installs nothing"
    moved = rows.action("upgrade")(first.n, yes=True)
    assert (moved.version, moved.commit != first.commit, (folder(moving.root, "moving") / "built.txt").is_file()) == \
        ("2.0.0", True, True), "with --yes the row moves to the new commit and the setup ran"
    assert moved.settings.get("ports") == first.settings.get("ports"), "the ports it was installed with are kept"
    (origin / MANIFEST).write_text(json.dumps({**WORKS, "name": "moving", "version": "3.0.0", "setup": [], "services": {"web": {"run": "echo serving"}}}))
    git("commit", "-q", "-am", "three", cwd=origin)
    rows.action("upgrade")(first.n, yes=True)
    assert read_json(want_file(moving.root, "moving.web"), {}).get("nonce", 0) > 0, \
        "and every service of the plugin is asked to start over"

    (origin / MANIFEST).write_text(json.dumps({**WORKS, "name": "moving", "version": "3.1.0", "setup": [{"name": "count", "run": "echo x >> $JOURNAL_PLUGIN_DATA/ran.txt"}]}))
    git("commit", "-q", "-am", "four", cwd=origin)
    rows.action("upgrade")(first.n, yes=True)
    ran = data(moving.root, "moving") / "ran.txt"
    assert ran.read_text().count("x") == 1, "the setup ran once for the new commit"
    assert "--again --yes" in rows.action("upgrade")(first.n), "asking again at the same commit says how to force it"
    rows.action("upgrade")(first.n, yes=True, again=True)
    assert ran.read_text().count("x") == 2, "with --again the setup runs a second time at the same commit"

    assert (rows.action("disable")(first.n).enabled, rows.action("enable")(first.n).enabled) == (False, True), \
        "a plugin can be switched off and on"

    kept = data(moving.root, "moving")
    kept.mkdir(parents=True, exist_ok=True)
    (kept / "state.json").write_text("{}")
    rows.complete(first.n, "not needed")
    assert (folder(moving.root, "moving").exists(), (kept / "state.json").is_file()) == (False, True), \
        "removing takes the folder, not the data"
    assert refused(lambda: rows.action("purge")(rows.action("install")(url, yes=True).n)) == "plugin 2 is installed: remove it first", \
        "purge is refused while a plugin is installed"
    assert (rows.action("purge")(first.n).startswith("everything moving kept in"), kept.exists()) == (True, False), \
        "purging a removed plugin takes its data too"

    bare = Plugins(moving, actor=AGENT).create("filed by hand")
    Plugins(moving, actor=AGENT).complete(bare.n, "gone")
    assert data(moving.root, "").exists() is True, "removing a row with no manifest leaves the plugin folders alone"
    assert refused(lambda: rows.action("purge")(bare.n)) == f"plugin {bare.n} never named itself, so it kept nothing of its own", \
        "and purging it is refused"


def test_setup_commands_run_in_your_own_environment_so_what_is_on_your_path_is_on_theirs(tmp_path):
    needs = fresh("path")
    rows = Plugins(needs, actor=AGENT)
    made = rows.action("install")(repository(tmp_path, {**WORKS, "name": "onpath", "requires": {"python": {"check": "command -v python3", "hint": "install python"}},
                                              "setup": [{"name": "which", "run": "command -v python3 > found.txt"}]}), yes=True)
    assert (made.manifest["name"], (folder(needs.root, "onpath") / "found.txt").read_text().strip().endswith("python3")) == ("onpath", True), \
        "a requirement and a setup step both find what is on your PATH"


def test_one_install_at_a_time_a_second_click_while_the_first_is_running_is_refused(tmp_path):
    busy = fresh("busy")
    rows = Plugins(busy, actor=AGENT)
    source = repository(tmp_path, WORKS)
    held = alone(busy.root, "works")
    assert refused(lambda: rows.action("install")(source, yes=True)) == "works is being installed already; wait for that to finish", \
        "a second install of the same plugin is refused while one runs"
    held.close()
    assert rows.action("install")(source, yes=True).manifest["name"] == "works", "once it is done, installing works again"


def test_the_plugins_own_names_are_given_to_every_command_it_runs(tmp_path):
    named = fresh("named")
    rows = Plugins(named, actor=AGENT)
    rows.action("install")(repository(tmp_path, {**WORKS, "name": "named", "setup": [{"name": "say", "run": "printf '%s %s %s %s' \"$JOURNAL_PLUGIN\" \"$JOURNAL_PLUGIN_DIR\" \"$JOURNAL_PLUGIN_DATA\" \"$JOURNAL_ENV\" > said.txt"}]}), yes=True)
    said = (folder(named.root, "named") / "said.txt").read_text().split()
    assert (said[0], said[1] == str(folder(named.root, "named")), said[2] == str(data(named.root, "named"))) == ("named", True, True), \
        "a command knows the plugin's name, its folder and its data folder"
    assert said[3] == "main", "and which environment to write back to"


def test_a_services_port_is_known_before_the_first_setup_step_runs(tmp_path):
    ported = fresh("ported")
    rows = Plugins(ported, actor=AGENT)
    made = rows.action("install")(repository(tmp_path, {**WORKS, "name": "ported", "env": {"APP_URL": "http://127.0.0.1:{ports.web}"},
                                              "services": {"web": {"run": "serve --port={port}", "port": "auto"}},
                                              "setup": [{"name": "say", "run": "printf '%s' \"$APP_URL\" > url.txt"}]}), yes=True)
    url = (folder(ported.root, "ported") / "url.txt").read_text().strip()
    assert (url.startswith("http://127.0.0.1:"), url.endswith(str(made.settings["ports"]["web"]))) == (True, True), \
        "the setup step is given the port the service will run on"
    assert made.settings["ports"]["web"] > 0, "and the row remembers that port"


def test_removing_an_old_row_never_takes_a_newer_install_of_the_same_plugin_with_it(tmp_path):
    twice = fresh("twice")
    rows = Plugins(twice, actor=AGENT)
    source = repository(tmp_path, WORKS)
    older = rows.action("install")(source, yes=True)
    newer_row = rows.create("Works", manifest=older.manifest, enabled=True, token="t", settings={}, source=source)
    rows.complete(older.n, "replaced by the newer install")
    assert folder(twice.root, "works").is_dir() is True, "the newer row's folder is left in place"
    rows.complete(newer_row.n, "and now really gone")
    assert folder(twice.root, "works").exists() is False, "once the last row goes, so does the folder"
