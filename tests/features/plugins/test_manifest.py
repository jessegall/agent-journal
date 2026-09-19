import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from features.plugins.manifest import MANIFEST, fill, read  # noqa: E402
from tests.kit import check, done, refused  # noqa: E402

features.unload()
features.load()


def written(given) -> Path:
    folder = Path(tempfile.mkdtemp())
    (folder / MANIFEST).parent.mkdir(parents=True)
    (folder / MANIFEST).write_text(given if isinstance(given, str) else json.dumps(given))
    return folder


def refusal(given, version: str = "") -> str:
    return refused(lambda: read(written(given), version))


# THE SMALLEST MANIFEST is a name and what it listens to
small = read(written({"name": "hello", "on": {"todo.created": "python3 hello.py"}}))
check("a name and one handler are enough", (small["name"], small["on"]), ("hello", {"todo.created": {"run": "python3 hello.py"}}))
check("what it does not say is empty, never missing", (small["setup"], small["services"], small["pages"], small["env"]), ([], {}, [], {}))

# A FULL MANIFEST keeps every part, and fills in what each part leaves out
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
}), version="2.13.0")
check("a setup step is named and keeps its working directory", full["setup"], [{"name": "step 1", "run": "composer install", "cwd": ""}, {"name": "migrate", "run": "php artisan migrate --force", "cwd": "host"}])
check("a service keeps its command and gets a restart rule", (full["services"]["web"]["run"], full["services"]["web"]["restart"], full["services"]["queue"]["restart"]),
      (["php", "artisan", "serve", "--port={port}"], "on-failure", "always"))
check("a handler is a command or a post to the plugin's own service", full["on"], {"todo.created": {"post": "http://127.0.0.1:{ports.web}/journal/events"}, "hook.PostToolUse": {"run": "php after.php"}})
check("a page names the service it shows", (full["pages"][0]["service"], full["pages"][0]["path"]), ("web", "/workflows"))

# EVERY REFUSAL says what is wrong in one sentence
folder = Path(tempfile.mkdtemp())
check("a repository without a manifest is not a plugin", refused(lambda: read(folder)), f"no .journal-plugin/plugin.json in {folder}: not a journal plugin")
check("broken JSON says so", refusal("{").startswith("plugin.json is not JSON:"), True)
check("an unknown key is refused with the known ones", refusal({"name": "x1", "listens": {}}),
      "plugin.json: unknown key 'listens'; known: name, version, title, description, journal, requires, env, setup, services, on, refuse, pages, settings")
check("a name is lowercase letters, digits or dashes", refusal({"name": "Work Flows"}), "plugin.json: name must be 2-32 lowercase letters, digits or dashes, got 'Work Flows'")
check("a built-in feature's name is taken", refusal({"name": "work"}), "plugin.json: name 'work' is a built-in feature")
check("a newer journal is asked for by version", refusal({"name": "x1", "journal": "9.0.0"}, "2.13.0"), "x1 needs journal 9.0.0 or newer; this is 2.13.0 — run journal upgrade")
check("a pattern that matches no event is refused", refusal({"name": "x1", "on": {"todos.created": "x"}}).startswith("plugin.json: on 'todos.created' matches no event"), True)
check("a handler is a command or a post", refusal({"name": "x1", "on": {"todo.created": {"call": "x"}}}), 'plugin.json: on \'todo.created\' is a command, or {"post": "<url>"}')
check("an empty command is refused", refusal({"name": "x1", "setup": [""]}), "plugin.json: setup step 1 is a command, a line or a list of words, not ''")
check("a service name is a lowercase word", refusal({"name": "x1", "services": {"Engine": {"run": "x"}}}), "plugin.json: service names are lowercase words; 'Engine' is not")
check("a service port is a number or auto", refusal({"name": "x1", "services": {"web": {"run": "x", "port": "eight"}}}), 'plugin.json: service \'web\' takes a port number or "auto", not \'eight\'')
check("a restart rule is one of three", refusal({"name": "x1", "services": {"web": {"run": "x", "restart": "sometimes"}}}), "plugin.json: service 'web' restarts always, on-failure, never, not 'sometimes'")
check("a page names a service that exists", refusal({"name": "x1", "pages": [{"title": "Workflows", "service": "web"}]}), "plugin.json: page 'Workflows' names service 'web', which is not declared")
check("a requirement says how to check it", refusal({"name": "x1", "requires": {"php": {"hint": "install php"}}}), "plugin.json: requires.php needs check")

# PLACEHOLDERS are filled wherever they appear, and what is unknown is left alone
values = {"dir": "/p/plugins/workflows", "data": "/p/plugin-data/workflows", "port": 8441, "ports.web": 8441, "token": "t0ken"}
check("placeholders are filled in strings, lists and objects", fill({"run": ["php", "--port={port}"], "env": {"DB": "{data}/db.sqlite"}, "url": "http://x/{token}/{nope}"}, values),
      {"run": ["php", "--port=8441"], "env": {"DB": "/p/plugin-data/workflows/db.sqlite"}, "url": "http://x/t0ken/{nope}"})

done()
