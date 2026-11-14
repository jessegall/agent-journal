from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "src"
ERROR_FILE_ENDINGS = ("_error.py", "_refusal.py")
FALSE_ERROR_NAMES = {
    "src/core/modules/drivers/commands/skip_refusal/skip_refusal.py", "src/suites/coding/modules/workers/commands/record_worker_refusal/record_worker_refusal.py",
    "src/server/door/door_refusal.py", "src/engine/log/recorded_refusal.py",
}
PATH_STARTED_ENTRY_FILES = {"src/server/server.py", "src/install/working_tree_install.py"}
FOLDER_TOPS = ("src/server", "src/install", "src/engine/testing", "src/core")
MODULE_STAND_INS = {
    "src/core/modules/agents/testing": ["fake_launcher.py"], "src/core/modules/helpers/testing": ["story_helper_programs.py"],
    "src/core/modules/overview/testing": ["story_overview_first.py"], "src/core/modules/plugins/testing": ["story_login_path.py"],
    "src/core/modules/skills/testing": ["story_main_agent_skills.py", "story_skill_requirement.py"],
    "src/core/modules/tasks/testing": ["story_task_brief_requirement.py"],
}
AREA_MARKER_ENDING = "_area.py"
KIT_FOLDERS = ["cache", "examples", "expectations", "fakes", "pytest_wiring", "runs", "seeds", "stories", "templates"]
SCANNED_TOPS = ["src/core", "src/engine", "src/suites", "src/tunnels", "src/install", "src/server"]


def python_files(folder: Path) -> list[Path]:
    return sorted(path for path in folder.rglob("*.py") if "__pycache__" not in path.parts and "node_modules" not in path.parts)


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def loose_files(folder: str) -> list[str]:
    return sorted(relative(path) for path in (ROOT / folder).glob("*.py") if path.name != "__init__.py" and not path.name.endswith(AREA_MARKER_ENDING))


def test_339_every_error_file_sits_in_an_errors_folder_and_none_in_support():
    error_files = [path for path in python_files(SOURCE) if path.name.endswith(ERROR_FILE_ENDINGS)]
    external = sorted({relative(path) for path in error_files if path.parent.name != "errors"} - FALSE_ERROR_NAMES)
    library_errors = [path for path in python_files(SOURCE / "core" / "modules" / "library" / "errors") if path.name != "__init__.py"]
    assert external == [], f'outside {external}, library {len(library_errors)}'
    assert len(library_errors) == 8, f'outside {external}, library {len(library_errors)}'


def test_340_the_tops_of_the_server_the_installer_and_the_kit_hold_only_folders():
    loose = sorted({name for top in FOLDER_TOPS for name in loose_files(top)} - PATH_STARTED_ENTRY_FILES)
    assert loose == [], str(loose)
    assert not (SOURCE / 'core' / 'testing').exists(), str(loose)


def test_389_the_rules_scan_every_top_folder_of_the_source():
    scanned = json.loads((ROOT / ".commandments" / "config.json").read_text())["paths"]
    tops = sorted(f"src/{folder.name}" for folder in SOURCE.iterdir() if folder.is_dir() and python_files(folder))
    assert tops == sorted(SCANNED_TOPS), f'tops {tops}, scanned {scanned}'
    assert all((top in scanned for top in tops)), f'tops {tops}, scanned {scanned}'


def test_420_the_test_kit_is_split_between_the_engine_and_the_modules():
    kit_folders = sorted(folder.name for folder in (SOURCE / "engine" / "testing").iterdir() if folder.is_dir() and folder.name != "__pycache__")
    stand_ins = {relative(folder): sorted(path.name for path in folder.glob("*.py") if path.name != "__init__.py") for folder in SOURCE.rglob("testing") if folder.is_dir() and "engine" not in folder.parts}
    assert kit_folders == KIT_FOLDERS, f'kit {kit_folders}, stand-ins {stand_ins}'
    assert stand_ins == MODULE_STAND_INS, f'kit {kit_folders}, stand-ins {stand_ins}'
