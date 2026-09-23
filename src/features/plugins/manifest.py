import json
import re
from pathlib import Path

from providers.payload import DISPLAYED, EVENTS
from features.base import REGISTRY
from surfaces.updates import newer
from resources.base import ACTIONS, Refused
from resources.types import TYPES
from engine.hooks import CANCELABLE
from features.plugins.declared import Manifest

MANIFEST = Path(".journal-plugin") / "plugin.json"
KEYS = ("name", "version", "title", "description", "journal", "requires", "env", "setup", "services", "on", "refuse", "reads", "refuse_seconds", "refuse_socket", "chat", "pages", "settings", "skills", "load", "installed", "events", "cancels")
NAME = re.compile(r"[a-z0-9][a-z0-9-]{1,31}$")
WORD = re.compile(r"[a-z][a-z0-9_-]*$")
PLACEHOLDER = re.compile(r"\{([a-z][a-z0-9_.]*)\}")
PATTERNS = {"*", *TYPES, *ACTIONS, *(f"{t}.{a}" for t in TYPES for a in ACTIONS), "hook.*", *(f"hook.{e}" for e in (*EVENTS, DISPLAYED))}
STEP = ("name", "run", "cwd")
SERVICE = ("run", "cwd", "env", "port", "ready", "restart", "grace", "show")
PAGE = ("name", "title", "icon", "service", "path", "status")
TONES = ("", "warn", "good")
SETTING = ("title", "default", "help", "env", "type", "options", "group", "when", "detail")
KINDS = ("text", "textarea", "list", "number", "flag", "options")
RESTARTS = ("always", "on-failure", "never")


def read(folder: Path, version: str = "") -> Manifest:
    path = Path(folder) / MANIFEST
    try:
        given = json.loads(path.read_text())
    except OSError as error:
        raise Refused(f"no {MANIFEST.as_posix()} in {folder}: not a journal plugin") from error
    except ValueError as error:
        raise Refused(f"plugin.json is not JSON: {error}") from error
    if not isinstance(given, dict):
        raise Refused("plugin.json holds one object, with a name and what the plugin listens to")
    for key in given:
        if key not in KEYS:
            raise Refused(f"plugin.json: unknown key {key!r}; known: {', '.join(KEYS)}")
    name = given.get("name")
    if not isinstance(name, str) or not NAME.fullmatch(name):
        raise Refused(f"plugin.json: name must be 2-32 lowercase letters, digits or dashes, got {name!r}")
    taken = {**{n: n for n in REGISTRY},
             **{old if isinstance(old, str) else old[0]: n for n, cls in REGISTRY.items() for old in cls.aliases}}
    if name in taken:
        raise Refused(f"plugin.json: name {name!r} is a built-in feature"
                      + (f", which {taken[name]} used to be called" if taken[name] != name else ""))
    wanted = given.get("journal")
    if wanted and version and newer(str(wanted), version):
        raise Refused(f"{name} needs journal {wanted} or newer; this is {version} — run journal upgrade")
    checked = {key: given[key] for key in KEYS if key in given}
    checked["requires"] = shaped(name, given.get("requires") or {}, "requires", ("check", "hint"), ("check",))
    checked["env"] = texts(name, given.get("env") or {}, "env")
    checked["setup"] = steps(name, given.get("setup") or [])
    checked["services"] = services(name, given.get("services") or {})
    checked["on"] = handlers(name, given.get("on") or {})
    if given.get("refuse_socket") and given["refuse_socket"] not in checked["services"]:
        raise Refused(f"plugin.json: refuse_socket names one of its services, not {given['refuse_socket']!r}")
    checked["chat"] = chat(name, given.get("chat") or [])
    checked["pages"] = pages(name, given.get("pages") or [], checked["services"])
    checked["settings"] = typed(shaped(name, given.get("settings") or {}, "settings", SETTING, ()))
    checked["events"] = shaped(name, given.get("events") or {}, "events", ("title", "tone", "card"), ("title",))
    for event, fields in checked["events"].items():
        if "card" in fields:
            shaped(name, {event: fields["card"]}, "events.card", ("label", "color", "icon"), ())
        if fields.get("tone", "") not in TONES:
            raise Refused(f"plugin.json: events.{event}.tone is one of {', '.join(t for t in TONES if t)}")
    checked["load"] = loads(given.get("load") or {}, checked["events"])
    if "cancels" in checked:
        if not isinstance(checked["cancels"], dict) or any(event not in CANCELABLE for event in checked["cancels"]):
            raise Refused(f"plugin.json: cancels names events that can be cancelled: {', '.join(CANCELABLE)}")
        checked["cancels"] = {event: command(name, f"cancels.{event}", run) for event, run in checked["cancels"].items()}
    if "refuse" in checked:
        checked["refuse"] = command(name, "refuse", checked["refuse"])
    checked["reads"] = bool(given.get("reads"))
    if "installed" in checked and not isinstance(checked["installed"], str):
        raise Refused("plugin.json: installed is one command, run right after the plugin is installed or upgraded; its answer fills the settings")
    if "skills" in checked and (not isinstance(checked["skills"], str) or checked["skills"].startswith("/") or ".." in checked["skills"].split("/")):
        raise Refused("plugin.json: skills is a folder inside the plugin, holding one folder per skill with its SKILL.md")
    if "refuse_seconds" in checked and not isinstance(checked["refuse_seconds"], (int, float)):
        raise Refused("plugin.json: refuse_seconds is a number of seconds")
    return Manifest.of(checked)


def command(name: str, where: str, given) -> str | list:
    if isinstance(given, str) and given.strip():
        return given
    if isinstance(given, list) and given and all(isinstance(part, str) and part for part in given):
        return given
    raise Refused(f"plugin.json: {where} is a command, a line or a list of words, not {given!r}")


def texts(name: str, given, where: str) -> dict:
    if not isinstance(given, dict) or not all(isinstance(v, str) for v in given.values()):
        raise Refused(f"plugin.json: {where} names values, each one text")
    return dict(given)


def shaped(name: str, given, where: str, keys: tuple, needed: tuple) -> dict:
    if not isinstance(given, dict):
        raise Refused(f"plugin.json: {where} names one entry each")
    for key, value in given.items():
        if not isinstance(value, dict):
            raise Refused(f"plugin.json: {where}.{key} is an object with {', '.join(keys)}")
        for field in value:
            if field not in keys:
                raise Refused(f"plugin.json: {where}.{key} has unknown key {field!r}; known: {', '.join(keys)}")
        for field in needed:
            if not value.get(field):
                raise Refused(f"plugin.json: {where}.{key} needs {field}")
    return {key: dict(value) for key, value in given.items()}


def typed(settings: dict) -> dict:
    for key, setting in settings.items():
        kind = setting.setdefault("type", "text")
        if kind not in KINDS:
            raise Refused(f"plugin.json: settings.{key} has type {kind!r}; a setting is one of {', '.join(KINDS)}")
        if kind == "options" and not (isinstance(setting.get("options"), list) and setting["options"]):
            raise Refused(f"plugin.json: settings.{key} is options, so it needs a list of options")
        when = setting.get("when") or []
        choices = when if isinstance(when, list) else [when]
        if not all(isinstance(c, dict) and all(other in settings for other in c) for c in choices):
            raise Refused(f"plugin.json: settings.{key}.when names settings and the value each must have, as in {{\"language_php\": true}}, or a list of those where any one is enough")
        setting["when"] = choices
    return settings


def steps(name: str, given) -> list[dict]:
    if not isinstance(given, list):
        raise Refused("plugin.json: setup is a list of steps, run in order")
    out = []
    for i, step in enumerate(given, 1):
        if isinstance(step, (str, list)):
            step = {"run": step}
        if not isinstance(step, dict):
            raise Refused(f"plugin.json: setup step {i} is a command or an object with {', '.join(STEP)}")
        for field in step:
            if field not in STEP:
                raise Refused(f"plugin.json: setup step {i} has unknown key {field!r}; known: {', '.join(STEP)}")
        out.append({"name": str(step.get("name") or f"step {i}"), "run": command(name, f"setup step {i}", step.get("run")),
                    **({"cwd": str(step["cwd"])} if step.get("cwd") else {})})
    return out


def services(name: str, given) -> dict:
    if not isinstance(given, dict):
        raise Refused("plugin.json: services names one service each")
    out = {}
    for service, value in given.items():
        if not WORD.fullmatch(str(service)):
            raise Refused(f"plugin.json: service names are lowercase words; {service!r} is not")
        if not isinstance(value, dict):
            raise Refused(f"plugin.json: service {service!r} is an object with {', '.join(SERVICE)}")
        for field in value:
            if field not in SERVICE:
                raise Refused(f"plugin.json: service {service!r} has unknown key {field!r}; known: {', '.join(SERVICE)}")
        port = value.get("port")
        if port is not None and port != "auto" and not isinstance(port, int):
            raise Refused(f"plugin.json: service {service!r} takes a port number or \"auto\", not {port!r}")
        restart = str(value.get("restart") or "on-failure")
        if restart not in RESTARTS:
            raise Refused(f"plugin.json: service {service!r} restarts {', '.join(RESTARTS)}, not {restart!r}")
        out[service] = {**value, "run": command(name, f"service {service!r}", value.get("run")), "restart": restart}
    return out


def chat(name: str, given) -> list:
    if not isinstance(given, list):
        raise Refused("plugin.json: chat is a list of {\"find\": \"<regex>\", \"as\": \"<markdown>\"}")
    out = []
    for rule in given:
        if not isinstance(rule, dict) or set(rule) - {"find", "as"} or not all(isinstance(rule.get(key), str) and rule[key] for key in ("find", "as")):
            raise Refused(f"plugin.json: each chat rule is {{\"find\": \"<regex>\", \"as\": \"<markdown>\"}}, got {rule!r}")
        try:
            re.compile(rule["find"])
        except re.error as broken:
            raise Refused(f"plugin.json: chat find {rule['find']!r} is not a pattern: {broken}") from None
        out.append({"find": rule["find"], "as": rule["as"]})
    return out


def loads(given, events: dict) -> dict:
    if not isinstance(given, dict):
        raise Refused("plugin.json: load names, for an event or a hook, the skills the agent must load when it happens")
    for pattern, skills in given.items():
        if pattern not in PATTERNS and pattern not in events:
            raise Refused(f"plugin.json: load {pattern!r} matches no event; it is a journal event, a hook.<event> or one of the plugin's own events")
        if not isinstance(skills, list) or not skills or not all(isinstance(skill, str) and skill for skill in skills):
            raise Refused(f"plugin.json: load {pattern!r} is a list of skill names")
    return dict(given)


def handlers(name: str, given) -> dict:
    if not isinstance(given, dict):
        raise Refused("plugin.json: on names an event pattern for each handler")
    out = {}
    for pattern, handler in given.items():
        if pattern not in PATTERNS:
            raise Refused(f"plugin.json: on {pattern!r} matches no event; a pattern is *, a type ({', '.join(sorted(TYPES)[:3])}, …), an action ({', '.join(ACTIONS[:2])}, …), type.action, or hook.<event>")
        if isinstance(handler, dict):
            if set(handler) != {"post"} or not isinstance(handler.get("post"), str) or not handler["post"]:
                raise Refused(f"plugin.json: on {pattern!r} is a command, or {{\"post\": \"<url>\"}}")
            out[pattern] = dict(handler)
            continue
        out[pattern] = {"run": command(name, f"on {pattern!r}", handler)}
    return out


def pages(name: str, given, declared: dict) -> list[dict]:
    if not isinstance(given, list):
        raise Refused("plugin.json: pages is a list of pages")
    out = []
    for page in given:
        if not isinstance(page, dict):
            raise Refused(f"plugin.json: each page is an object with {', '.join(PAGE)}")
        for field in page:
            if field not in PAGE:
                raise Refused(f"plugin.json: page has unknown key {field!r}; known: {', '.join(PAGE)}")
        service = page.get("service")
        if service not in declared:
            raise Refused(f"plugin.json: page {page.get('title') or page.get('name')!r} names service {service!r}, which is not declared")
        out.append({**page, "name": str(page.get("name") or service), "title": str(page.get("title") or name.title()), "path": str(page.get("path") or "/")})
    return out


def fill(value, values: dict):
    if isinstance(value, str):
        return PLACEHOLDER.sub(lambda m: str(values.get(m.group(1), m.group(0))), value)
    if isinstance(value, list):
        return [fill(part, values) for part in value]
    if isinstance(value, dict):
        return {key: fill(part, values) for key, part in value.items()}
    return value
