import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LAYERS = "python/NamespaceDependencyDetector"


def declared_layers() -> set[str]:
    config = json.loads((ROOT / ".commandments" / "config.json").read_text())
    return {entry["layer"][0] for entry in config["configure"][LAYERS]}


def module_packages() -> set[str]:
    core = {f"core.modules.{folder.name}" for folder in (ROOT / "src" / "core" / "modules").iterdir() if folder.is_dir() and not folder.name.startswith("__")}
    suites = {f"suites.{suite.name}.modules.{folder.name}" for suite in (ROOT / "src" / "suites").iterdir() if (suite / "modules").is_dir()
              for folder in (suite / "modules").iterdir() if folder.is_dir() and not folder.name.startswith("__")}
    return core | suites


def test_every_module_folder_has_a_layer_in_the_commandments_config():
    missing = sorted(module_packages() - declared_layers())

    assert not missing, f"declare a layer for {missing} in .commandments/config.json"
