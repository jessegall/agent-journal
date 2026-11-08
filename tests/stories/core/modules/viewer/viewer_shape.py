import importlib
import re
from pathlib import Path

from core.modules.viewer.commands.support.window_lines import WINDOW_SETTING_LINES
from core.modules.viewer.viewer_module import ViewerModule
from core.modules import DEFAULT_MODULES
from suites import DEFAULT_SUITES
from core.base.module.window_extensions import WindowExtensions
from core.base.viewer.window_place import WindowPlace
from tests.stories.support.story_checks import expect_absent_value

ROOT = Path(__file__).resolve().parents[5]
VIEWER = ROOT / "src/viewer"
MODULE_ROOTS = (ROOT / "src/core/modules", ROOT / "src/suites/coding/modules")
BUILD_ENTRIES = {"main.js", "index.js", "vite.config.js", "vitest.config.js", "buildWindows.js", "frameBridgeClient.js"}
READ_LINE = re.compile(r"""(?:context\.read\(|useRows\()[`"']([a-z-]+ [a-z-]+)""")
RUN_LINE = re.compile(r"""context\.run\(\[\s*"([a-z-]+)",\s*"([a-z-]+)\"""")
SHELL_LINE = re.compile(r"""\b(?:read|shellRead|shellLine)\(\[\s*"([a-z-]+)",\s*"([a-z-]+)\"""")
EXTENSIONS = WindowExtensions((*DEFAULT_MODULES, *DEFAULT_SUITES))
INTERNAL_WINDOWS = {"questions.question", "viewer.shell", "suggestions.suggestions", "reviews.reviewer", "reviews.reviewers", "phone.phones", "usage.fitness"}
SKIPPED_FOLDERS = {"node_modules", "dist", "__pycache__", "tests"}


def source_files(folder):
    return [path for path in folder.rglob("*") if path.suffix in {".vue", ".js", ".css"} and not SKIPPED_FOLDERS & set(path.parts)]


def module_folders():
    return [folder for root in MODULE_ROOTS for folder in root.iterdir() if (folder / "web/src").is_dir()]


def declared_lines(folder):
    dotted = ".".join(folder.relative_to(ROOT / "src").parts)
    module_file = importlib.import_module(f"{dotted}.{folder.name}_module")
    modules = [value for name, value in vars(module_file).items() if name.endswith("Module") and getattr(value, "__module__", "") == module_file.__name__]
    readers = [declared for module in modules for declared in (*map(EXTENSIONS.extend, module.windows), *module.marks, *module.docks)]
    return {line for reader in readers for line in getattr(reader, "reads", ())}, {line for reader in readers for line in getattr(reader, "runs", ())}


def test_every_viewer_file_is_imported_by_something():
    readers = {path: path.read_text(errors="ignore") for path in [*source_files(VIEWER), *(file for folder in module_folders() for file in source_files(folder / "web/src"))]}
    orphans = []
    for path in source_files(VIEWER):
        if path.name in BUILD_ENTRIES or path.suffix == ".css" or "public" in path.parts:
            continue
        imported = re.compile(rf"""[/"']{re.escape(path.stem)}(\.(vue|js))?["']""")
        if not any(second != path and imported.search(text) for second, text in readers.items()):
            orphans.append(str(path.relative_to(ROOT)))
    expect_absent_value(orphans)


def test_a_window_declares_each_line_it_reads_or_runs():
    missing = []
    for folder in module_folders():
        reads, runs = declared_lines(folder)
        for path in source_files(folder / "web/src"):
            text = path.read_text(errors="ignore")
            missing += [f"{path.name} reads {line}" for line in READ_LINE.findall(text) if line not in reads]
            missing += [f"{path.name} runs {target_type} {action}" for target_type, action in RUN_LINE.findall(text) if f"{target_type} {action}" not in runs]
    expect_absent_value(missing)


def test_the_shell_declares_each_line_it_reads():
    viewer = EXTENSIONS.extend(next(window for window in ViewerModule.windows if window.name == "viewer.shell"))
    declared = {*viewer.reads, *viewer.runs, *WINDOW_SETTING_LINES}
    missing = {f"{target_type} {action}" for path in source_files(VIEWER / "src") for target_type, action in SHELL_LINE.findall(path.read_text(errors="ignore"))} - declared
    expect_absent_value(missing)


def test_the_coding_suite_offers_every_window_a_module_declares():
    declared = set()
    for folder in module_folders():
        dotted = ".".join(folder.relative_to(ROOT / "src").parts)
        module_file = importlib.import_module(f"{dotted}.{folder.name}_module")
        declared |= {window.name for name, value in vars(module_file).items() if name.endswith("Module") and getattr(value, "__module__", "") == module_file.__name__ for window in value.windows if window.place is not WindowPlace.SECTION}
    text = (ROOT / "src/suites/coding/coding_suite.py").read_text()
    missing = {name for name in declared if f'"{name}"' not in text} - INTERNAL_WINDOWS
    expect_absent_value(missing)
