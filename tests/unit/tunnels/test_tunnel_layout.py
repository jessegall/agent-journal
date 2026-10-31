import inspect
from pathlib import Path

from core.base.module.module_finder import DEFAULT_MODULE_LISTS
from core.base.registry.dotted_path import DottedPath
from tunnels import DEFAULT_TUNNELS

TUNNELS_FOLDER = Path(__file__).resolve().parents[3] / "src" / "tunnels"


def test_every_tunnel_module_lives_in_its_own_folder_under_src_tunnels_and_is_named_for_it():
    for module in DEFAULT_TUNNELS:
        tunnel = module.name.removeprefix("journal.tunnels.")
        assert module.name == f"journal.tunnels.{tunnel}"
        assert Path(inspect.getfile(module)) == TUNNELS_FOLDER / tunnel / f"{tunnel}_module.py"


def test_the_module_finder_loads_the_tunnels_beside_the_core_and_the_suites():
    assert DottedPath("tunnels:DEFAULT_TUNNELS") in DEFAULT_MODULE_LISTS
