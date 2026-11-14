import re
import sys
from dataclasses import replace
from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.module.module import Module
from engine.module.module_finder import ModuleFinder
from engine.viewer.window_declaration import WindowDeclaration

ENTRY = re.compile(r'"([\w.-]+)":\s*here\("\./([^"]+)"\)')
IMPORT = re.compile(r'''(?:import\s[^;]*?from\s*|import\s*\(\s*)["'](\.{1,2}/[^"']+)["']''')
CALL = re.compile(r"\b(?:run|read|runLine|readLine)\(")
LINE = re.compile(r'\[\s*"([a-z][a-z-]*)"\s*,\s*"([a-z][a-z-]*)"')
WORK_MODE = "coding.work-mode"


def call_arguments(text: str) -> list[str]:
    arguments = []
    for match in CALL.finditer(text):
        depth, index = 1, match.end()
        while index < len(text) and depth:
            depth += {"(": 1, ")": -1}.get(text[index], 0)
            index += 1
        arguments.append(text[match.end():index])
    return arguments


def component_files(entry: Path) -> set[Path]:
    viewed: set[Path] = set()
    waiting = [entry]
    while waiting:
        path = waiting.pop()
        if path in viewed or not path.is_file():
            continue
        viewed.add(path)
        for target in IMPORT.findall(path.read_text()):
            resolved = (path.parent / target).resolve()
            waiting.extend(candidate for candidate in (resolved, resolved.with_suffix(".js"), resolved / "index.js") if candidate.is_file())
    return viewed


def component_lines(files: set[Path]) -> set[str]:
    return {f"{cli} {command_word}" for path in files for argument in call_arguments(path.read_text()) for cli, command_word in LINE.findall(argument)}


def declared_lines(window: WindowDeclaration) -> set[str]:
    names = [*window.reads, *window.runs, *window.shared_reads, *(key.read for key in window.keys), *(tab.read for tab in window.tabs)]
    return {" ".join(name.split()[:2]) for name in names}


def window_components(module: type[Module]) -> list[tuple[WindowDeclaration, Path]]:
    folder = Path(sys.modules[module.__module__].__file__).parent
    config = folder / "web" / "vite.config.js"
    if not config.is_file():
        return []
    entries = dict(ENTRY.findall(config.read_text()))
    return [(window, (folder / "web" / entries[window.entry.removesuffix(".js")]).resolve()) for window in module.windows if window.entry.removesuffix(".js") in entries]


def undeclared(window: WindowDeclaration, entry: Path) -> list[str]:
    return sorted(component_lines(component_files(entry)) - declared_lines(window))


WINDOWS = [pair for module in ModuleFinder(JournalHome(Path("/nonexistent-journal"))).default_modules() for pair in window_components(module)]


@pytest.mark.parametrize("window, entry", WINDOWS, ids=[window.name for window, _ in WINDOWS])
def test_a_window_declares_every_line_its_component_reads_or_runs(window, entry):
    assert undeclared(window, entry) == [], f"{window.name} runs or reads lines its declaration does not list"


def test_a_line_left_out_of_a_declaration_is_named():
    window, entry = next(pair for pair in WINDOWS if pair[0].name == WORK_MODE)
    old = replace(window, runs=tuple(line for line in window.runs if line != "agent retire"))
    assert undeclared(old, entry) == ["agent retire"]
