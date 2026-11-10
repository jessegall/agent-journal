import re
from pathlib import Path

from engine.module.layer_check import LayerCheck
from engine.module.layer_table import LayerTable
from engine.module.module_finder import DEFAULT_MODULE_LISTS
from tests.stories.engine.module.support.layer_project import LayerProject

ROOT = Path(__file__).resolve().parents[4]
CLOCK_READER = "src/engine/clock/clock_reader.py"
ORDER_LINES = "src/core/modules/orders/support/order_lines.py"
DEPOT_LINES = "src/suites/depot/support/depot_lines.py"
SUITE_IN_TEXT = re.compile(r"\b(?:suites|tunnels)\.\w")


def imports_of(folder: str) -> dict[str, list[str]]:
    check = LayerCheck(ROOT, LayerTable(), ())
    return {str(path.relative_to(ROOT)): list(check.imported_names(path)) for path in sorted((ROOT / folder).rglob("*.py"))}


def files_importing(folder: str, *prefixes: str) -> list[str]:
    return [name for name, imported in imports_of(folder).items() if any(dotted.startswith(prefixes) for dotted in imported)]


def test_390_an_engine_file_that_imports_a_core_module_is_refused_naming_the_file_and_the_layer(new_story, tmp_path):
    story = new_story()
    project = LayerProject(story, tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    project.add_file("src/core/modules/orders/models/order.py")
    project.add_file(CLOCK_READER, "from core.modules.orders.models.order import Order\n")
    failures = project.check(project.declaration("orders", "core.modules.orders"))
    story.expect_rows(failures == [f"{CLOCK_READER} imports core module orders, which engine may not use"], project.layer_of(CLOCK_READER) == "engine", detail=str(failures))


def test_391_a_core_module_that_imports_a_tunnel_is_refused_naming_the_module_and_the_tunnel(new_story, tmp_path):
    story = new_story()
    project = LayerProject(story, tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    project.add_module_folder("tunnels.pipe", "pipe")
    project.add_file("src/tunnels/pipe/support/pipe_client.py")
    project.add_file(ORDER_LINES, "from tunnels.pipe.support.pipe_client import PipeClient\n")
    failures = project.check(project.declaration("orders", "core.modules.orders"), project.declaration("pipe", "tunnels.pipe"))
    story.expect_rows(failures == [f"{ORDER_LINES} imports tunnel pipe, which core module orders may not use"], detail=str(failures))


def test_392_a_suite_that_imports_a_file_of_another_suite_is_refused_naming_both_suites(new_story, tmp_path):
    story = new_story()
    project = LayerProject(story, tmp_path)
    project.add_module_folder("suites.shop", "shop")
    project.add_module_folder("suites.depot", "depot")
    project.add_file("src/suites/shop/models/cart.py")
    project.add_file(DEPOT_LINES, "from suites.shop.models.cart import Cart\n")
    failures = project.check(project.declaration("shop", "suites.shop"), project.declaration("depot", "suites.depot"))
    story.expect_rows(failures == [f"{DEPOT_LINES} imports suite shop, which suite depot may not use"], detail=str(failures))


def test_396_the_server_and_the_installer_import_no_suite_and_no_tunnel_and_the_default_lists_name_them_by_dotted_path(new_story):
    story = new_story()
    importing = files_importing("src/server", "suites", "tunnels") + files_importing("src/install", "suites", "tunnels")
    in_text = [str(path.relative_to(ROOT)) for folder in ("src/server", "src/install") for path in sorted((ROOT / folder).rglob("*.py")) if SUITE_IN_TEXT.search(path.read_text())]
    lists = [path.text for path in DEFAULT_MODULE_LISTS]
    story.expect_rows(importing == [], in_text == [], detail=f"importing {importing}, in text {in_text}")
    story.expect_rows(lists == ["core.modules:DEFAULT_MODULES", "suites:DEFAULT_SUITES", "tunnels:DEFAULT_TUNNELS"], bool(files_importing("src/server", "engine")), detail=str(lists))


def test_419_no_engine_file_outside_the_test_kit_imports_a_core_module_a_suite_a_tunnel_or_the_server(new_story):
    story = new_story()
    importing = files_importing("src/engine", "core.modules", "suites", "tunnels", "server", "install")
    engine_files = [name for name in importing if LayerProject.layer_of(name) == "engine"]
    test_kit_files = [name for name in importing if LayerProject.layer_of(name) == "test kit"]
    story.expect_rows(engine_files == [], len(engine_files) + len(test_kit_files) == len(importing), bool(test_kit_files), detail=str(engine_files[:20]))
