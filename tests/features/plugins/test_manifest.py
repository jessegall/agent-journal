import json

import pytest

import features
from features.plugins.manifest import MANIFEST, fill, read
from tests.conftest import refused


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def written(given, tmp_path):
    (tmp_path / MANIFEST).parent.mkdir(parents=True, exist_ok=True)
    (tmp_path / MANIFEST).write_text(given if isinstance(given, str) else json.dumps(given))
    return tmp_path


def test_the_smallest_manifest_is_a_name_and_what_it_listens_to(tmp_path):
    small = read(written({"name": "hello", "on": {"todo.created": "python3 hello.py"}}, tmp_path))
    assert (small["name"], small["on"]) == ("hello", {"todo.created": {"run": "python3 hello.py"}}), \
        "a name and one handler are enough"
    assert (small["setup"], small["services"], small["pages"], small["env"]) == ([], {}, [], {}), \
        "what it does not say is empty, never missing"


def test_a_full_manifest_keeps_every_part_and_fills_in_what_each_part_leaves_out(tmp_path):
    full = read(written({
        "name": "workflows", "title": "Workflows", "version": "0.9.0", "journal": "2.13.0",
        "requires": {"php": {"check": "php -v", "hint": "brew install php"}},
        "env": {"DB_DATABASE": "{data}/workflows.sqlite"},
        "setup": ["composer install", {"name": "migrate", "run": "php artisan migrate --force", "cwd": "host"}],
        "services": {"web": {"run": ["php", "artisan", "serve", "--port={port}"], "port": "auto", "ready": {"path": "/up"}},
                     "queue": {"run": "php artisan queue:work", "restart": "always"}},
        "on": {"todo.created": {"post": "http://127.0.0.1:{ports.web}/journal/events"}, "hook.PostToolUse": "php after.php"},
        "pages": [{"name": "workflows", "title": "Workflows", "service": "web", "path": "/workflows"}],
        "settings": {"key": {"title": "OpenAI key", "env": "OPENAI_API_KEY"}},
    }, tmp_path), version="2.13.0")
    assert full["setup"] == [{"name": "step 1", "run": "composer install", "cwd": ""}, {"name": "migrate", "run": "php artisan migrate --force", "cwd": "host"}], \
        "a setup step is named and keeps its working directory"
    assert (full["services"]["web"]["run"], full["services"]["web"]["restart"], full["services"]["queue"]["restart"]) == \
        (["php", "artisan", "serve", "--port={port}"], "on-failure", "always"), "a service keeps its command and gets a restart rule"
    assert full["on"] == {"todo.created": {"post": "http://127.0.0.1:{ports.web}/journal/events"}, "hook.PostToolUse": {"run": "php after.php"}}, \
        "a handler is a command or a post to the plugin's own service"
    assert (full["pages"][0]["service"], full["pages"][0]["path"]) == ("web", "/workflows"), "a page names the service it shows"


def test_every_refusal_says_what_is_wrong_in_one_sentence(tmp_path):
    counter = iter(range(1000))

    def refusal(given, version=""):
        target = tmp_path / f"case{next(counter)}"
        target.mkdir()
        return refused(lambda: read(written(given, target), version))

    empty = tmp_path / "empty"
    empty.mkdir()
    assert refused(lambda: read(empty)) == f"no .journal-plugin/plugin.json in {empty}: not a journal plugin", \
        "a repository without a manifest is not a plugin"
    assert refusal("{").startswith("plugin.json is not JSON:") is True, "broken JSON says so"
    assert refusal({"name": "x1", "listens": {}}) == \
        "plugin.json: unknown key 'listens'; known: name, version, title, description, journal, requires, env, setup, services, on, refuse, pages, settings", \
        "an unknown key is refused with the known ones"
    assert refusal({"name": "Work Flows"}) == "plugin.json: name must be 2-32 lowercase letters, digits or dashes, got 'Work Flows'", \
        "a name is lowercase letters, digits or dashes"
    assert refusal({"name": "work"}) == "plugin.json: name 'work' is a built-in feature", "a built-in feature's name is taken"
    assert refusal({"name": "x1", "journal": "9.0.0"}, "2.13.0") == "x1 needs journal 9.0.0 or newer; this is 2.13.0 — run journal upgrade", \
        "a newer journal is asked for by version"
    assert refusal({"name": "x1", "on": {"todos.created": "x"}}).startswith("plugin.json: on 'todos.created' matches no event") is True, \
        "a pattern that matches no event is refused"
    assert refusal({"name": "x1", "on": {"todo.created": {"call": "x"}}}) == 'plugin.json: on \'todo.created\' is a command, or {"post": "<url>"}', \
        "a handler is a command or a post"
    assert refusal({"name": "x1", "setup": [""]}) == "plugin.json: setup step 1 is a command, a line or a list of words, not ''", \
        "an empty command is refused"
    assert refusal({"name": "x1", "services": {"Engine": {"run": "x"}}}) == "plugin.json: service names are lowercase words; 'Engine' is not", \
        "a service name is a lowercase word"
    assert refusal({"name": "x1", "services": {"web": {"run": "x", "port": "eight"}}}) == \
        'plugin.json: service \'web\' takes a port number or "auto", not \'eight\'', "a service port is a number or auto"
    assert refusal({"name": "x1", "services": {"web": {"run": "x", "restart": "sometimes"}}}) == \
        "plugin.json: service 'web' restarts always, on-failure, never, not 'sometimes'", "a restart rule is one of three"
    assert refusal({"name": "x1", "pages": [{"title": "Workflows", "service": "web"}]}) == \
        "plugin.json: page 'Workflows' names service 'web', which is not declared", "a page names a service that exists"
    assert refusal({"name": "x1", "requires": {"php": {"hint": "install php"}}}) == "plugin.json: requires.php needs check", \
        "a requirement says how to check it"


def test_placeholders_are_filled_wherever_they_appear_and_the_unknown_is_left_alone():
    values = {"dir": "/p/plugins/workflows", "data": "/p/plugin-data/workflows", "port": 8441, "ports.web": 8441, "token": "t0ken"}
    assert fill({"run": ["php", "--port={port}"], "env": {"DB": "{data}/db.sqlite"}, "url": "http://x/{token}/{nope}"}, values) == \
        {"run": ["php", "--port=8441"], "env": {"DB": "/p/plugin-data/workflows/db.sqlite"}, "url": "http://x/t0ken/{nope}"}, \
        "placeholders are filled in strings, lists and objects"
