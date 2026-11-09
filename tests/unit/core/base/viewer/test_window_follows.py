import re
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.module.module import Module
from core.base.module.module_finder import ModuleFinder

FOLLOW = re.compile(r"\b(?:view|context)\.follow\(\s*\[([^\]]*)\]")
PATTERN = re.compile(r"['\"]([^'\"]+)['\"]")


def covers(declared: str, pattern: str) -> bool:
    model, change = declared.split(".")
    pattern_model, pattern_change = pattern.split(".")
    return model in ("*", pattern_model) and change in ("*", pattern_change)


def undeclared_successors(text: str, declared: set[str]) -> list[str]:
    patterns = [pattern for match in FOLLOW.finditer(text) for pattern in PATTERN.findall(match.group(1))]
    return [pattern for pattern in patterns if not any(covers(event, pattern) for event in declared)]


def listed_events(modules: list[type[Module]]) -> dict[str, set[str]]:
    events = {window.name: set(window.events) for module in modules for window in module.windows}
    for module in modules:
        for extension in module.window_extensions:
            if extension.window in events:
                events[extension.window] |= set(extension.events)
    return events


def body_stems(module: type[Module]) -> set[str]:
    """A dock or mark body hears every event through ModuleBody, so its follows answer to no window's list."""
    return {Path(declaration.body).stem.replace("-", "").lower() for declaration in (*module.docks, *module.marks) if declaration.body}


def test_a_follow_of_an_event_its_window_does_not_list_is_found():
    assert undeclared_successors('view.follow(["question.*"], close);', {"message.*"}) == ["question.*"]


def test_a_follow_its_window_lists_is_not_reported():
    assert undeclared_successors('view.follow(["question.*", "message.create"], close);', {"question.*", "message.*"}) == []


def test_every_follow_in_shipped_window_code_is_listed_by_a_window_of_its_module(tmp_path):
    modules = ModuleFinder(JournalHome(tmp_path)).default_modules()
    events = listed_events(modules)
    found = {}
    for module in modules:
        names = [*(window.name for window in module.windows), *(extension.window for extension in module.window_extensions)]
        declared = set().union(*(events.get(name, set()) for name in names))
        for path in (module.folder() / "web" / "src").rglob("*"):
            if path.suffix in (".vue", ".js") and path.stem.lower() not in body_stems(module):
                missing = undeclared_successors(path.read_text(), declared)
                if missing:
                    found[str(path)] = missing
    assert not found, f"these follows are filtered out because no window lists their events: {found}"
