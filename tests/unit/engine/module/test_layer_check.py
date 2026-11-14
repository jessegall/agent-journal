import json
import re
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.module.layer_check import LayerCheck
from engine.module.layer_table import LayerTable
from engine.module.module_finder import DEFAULT_MODULE_LISTS
from engine.module.module_finder import ModuleFinder
from tests.unit.engine.module.layer_project import LayerProject

ASSIGNMENT = "src/core/modules/assignments/models/assignment.py"
TASK_ASSIGNMENTS = "src/core/modules/tasks/support/task_assignments.py"
ASSIGNMENT_SUBJECTS = "src/core/modules/assignments/support/assignment_subjects.py"
ROOT = Path(__file__).resolve().parents[4]
CONFIG_FILE = ROOT / ".commandments" / "config.json"
MANUAL_LAYERS = "python/NamespaceDependencyDetector"
CLOCK_READER = "src/engine/clock/clock_reader.py"
ORDER_LINES = "src/core/modules/orders/support/order_lines.py"
DEPOT_LINES = "src/suites/depot/support/depot_lines.py"
SUITE_IN_TEXT = re.compile(r"\b(?:suites|tunnels)\.\w")
CARTS_FOLDER = "src/suites/shop/modules/carts"


def test_a_new_module_folder_is_in_a_layer_with_no_configuration_line(tmp_path):
    project = LayerProject(tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    assert project.check(project.declaration('orders', 'core.modules.orders')) == []
    assert project.layer_of('src/core/modules/orders/orders_module.py') == 'core module orders'
    assert not (tmp_path / '.commandments').exists()


def test_a_module_folder_with_no_declaration_class_fails_naming_the_folder_and_what_to_add(tmp_path):
    project = LayerProject(tmp_path)
    (tmp_path / "src" / "core" / "modules" / "orders").mkdir(parents=True)
    assert project.check() == ['src/core/modules/orders: has no declaration class']


def test_the_maintainer_prints_every_layer_with_what_it_may_use_one_line_each(tmp_path):
    lines = LayerProject(tmp_path).emitted_layers()
    labels = [line.partition(" may use:")[0] for line in lines]
    assert labels[0] == 'engine'
    assert len(labels) == len(set(labels))
    assert 'core module actors may use: engine' in lines
    assert labels.index('core module tasks') < labels.index('suite coding')
    assert any((line.startswith('suite coding may use: engine, core module actors (public folders)') for line in lines))


def test_a_top_folder_under_src_that_matches_no_layer_pattern_fails_naming_it(tmp_path):
    project = LayerProject(tmp_path)
    project.add_file("src/widgets/gadget.py")
    assert project.check() == ['src/widgets/gadget.py: the file is in no layer']
    assert project.layer_of('src/widgets/gadget.py') == 'no layer'


def test_589_a_new_module_is_in_a_layer_once_it_declares_itself_and_the_modules_that_adopt_it_list_it(tmp_path):
    project = LayerProject(tmp_path)
    project.add_file(ASSIGNMENT)
    project.add_module_folder("core.modules.tasks", "tasks")
    project.add_file(TASK_ASSIGNMENTS, "from core.modules.assignments.models.assignment import Assignment\n")
    assignments = project.declaration("assignments", "core.modules.assignments")
    undeclared = project.check(project.declaration("tasks", "core.modules.tasks", "assignments"))
    unlisted = project.check(assignments, project.declaration("tasks", "core.modules.tasks"))
    listed = project.check(assignments, project.declaration("tasks", "core.modules.tasks", "assignments"))
    assert 'src/core/modules/assignments: has no declaration class' in undeclared, str(undeclared)
    assert unlisted == [f'{TASK_ASSIGNMENTS} imports core module assignments, which core module tasks may not use'], f'{unlisted} {listed}'
    assert listed == [], f'{unlisted} {listed}'


def test_589_a_new_module_that_imports_a_module_adopting_it_is_refused_naming_its_file(tmp_path):
    project = LayerProject(tmp_path)
    project.add_module_folder("core.modules.assignments", "assignments")
    project.add_module_folder("core.modules.tasks", "tasks")
    project.add_file("src/core/modules/tasks/models/task.py")
    project.add_file(ASSIGNMENT_SUBJECTS, "from core.modules.tasks.models.task import Task\n")
    failures = project.check(project.declaration("assignments", "core.modules.assignments"), project.declaration("tasks", "core.modules.tasks", "assignments"))
    assert f'{ASSIGNMENT_SUBJECTS} imports core module tasks, which core module assignments may not use' in failures, str(failures)
    assert project.layer_of(ASSIGNMENT_SUBJECTS) == 'core module assignments', str(failures)


def layers_in_configuration(config_file: Path) -> list[object]:
    return json.loads(config_file.read_text())["configure"].get(MANUAL_LAYERS, [])


def test_523_a_layer_written_by_hand_in_the_configuration_is_found_and_the_real_one_holds_none(tmp_path):
    configuration = json.loads(CONFIG_FILE.read_text())
    configuration["configure"][MANUAL_LAYERS] = [{"layer": ["core.modules.orders"]}]
    copy = tmp_path / "config.json"
    copy.write_text(json.dumps(configuration))
    assert layers_in_configuration(copy) == [{'layer': ['core.modules.orders']}], str(layers_in_configuration(CONFIG_FILE))
    assert layers_in_configuration(CONFIG_FILE) == [], str(layers_in_configuration(CONFIG_FILE))


def test_525_no_list_of_allowed_lines_is_left_and_the_tree_passes_the_layer_check_without_one():
    modules = ModuleFinder(JournalHome(ROOT / ".journal")).default_modules()
    failures = LayerCheck(ROOT, LayerTable(), modules).failures()
    leftover = sorted(path.name for path in (ROOT / "src" / "engine" / "module").glob("layer_allow_list*"))
    assert failures == [], f'{failures[:5]} {leftover}'
    assert leftover == [], f'{failures[:5]} {leftover}'
    assert LayerProject.layer_of('src/suites/__init__.py') == 'module list suites', f'{failures[:5]} {leftover}'


def imports_of(folder: str) -> dict[str, list[str]]:
    check = LayerCheck(ROOT, LayerTable(), ())
    return {str(path.relative_to(ROOT)): list(check.imported_names(path)) for path in sorted((ROOT / folder).rglob("*.py"))}


def files_importing(folder: str, *prefixes: str) -> list[str]:
    return [name for name, imported in imports_of(folder).items() if any(dotted.startswith(prefixes) for dotted in imported)]


def test_390_an_engine_file_that_imports_a_core_module_is_refused_naming_the_file_and_the_layer(tmp_path):
    project = LayerProject(tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    project.add_file("src/core/modules/orders/models/order.py")
    project.add_file(CLOCK_READER, "from core.modules.orders.models.order import Order\n")
    failures = project.check(project.declaration("orders", "core.modules.orders"))
    assert failures == [f'{CLOCK_READER} imports core module orders, which engine may not use'], str(failures)
    assert project.layer_of(CLOCK_READER) == 'engine', str(failures)


def test_391_a_core_module_that_imports_a_tunnel_is_refused_naming_the_module_and_the_tunnel(tmp_path):
    project = LayerProject(tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    project.add_module_folder("tunnels.pipe", "pipe")
    project.add_file("src/tunnels/pipe/support/pipe_client.py")
    project.add_file(ORDER_LINES, "from tunnels.pipe.support.pipe_client import PipeClient\n")
    failures = project.check(project.declaration("orders", "core.modules.orders"), project.declaration("pipe", "tunnels.pipe"))
    assert failures == [f'{ORDER_LINES} imports tunnel pipe, which core module orders may not use'], str(failures)


def test_392_a_suite_that_imports_a_file_of_another_suite_is_refused_naming_both_suites(tmp_path):
    project = LayerProject(tmp_path)
    project.add_module_folder("suites.shop", "shop")
    project.add_module_folder("suites.depot", "depot")
    project.add_file("src/suites/shop/models/cart.py")
    project.add_file(DEPOT_LINES, "from suites.shop.models.cart import Cart\n")
    failures = project.check(project.declaration("shop", "suites.shop"), project.declaration("depot", "suites.depot"))
    assert failures == [f'{DEPOT_LINES} imports suite shop, which suite depot may not use'], str(failures)


def test_396_the_server_and_the_installer_import_no_suite_and_no_tunnel_and_the_default_lists_name_them_by_dotted_path():
    importing = files_importing("src/server", "suites", "tunnels") + files_importing("src/install", "suites", "tunnels")
    in_text = [str(path.relative_to(ROOT)) for folder in ("src/server", "src/install") for path in sorted((ROOT / folder).rglob("*.py")) if SUITE_IN_TEXT.search(path.read_text())]
    lists = [path.text for path in DEFAULT_MODULE_LISTS]
    assert importing == [], f'importing {importing}, in text {in_text}'
    assert in_text == [], f'importing {importing}, in text {in_text}'
    assert lists == ['core.modules:DEFAULT_MODULES', 'suites:DEFAULT_SUITES', 'tunnels:DEFAULT_TUNNELS'], str(lists)
    assert bool(files_importing('src/server', 'engine')), str(lists)


def test_419_no_engine_file_outside_the_test_kit_imports_a_core_module_a_suite_a_tunnel_or_the_server():
    importing = files_importing("src/engine", "core.modules", "suites", "tunnels", "server", "install")
    engine_files = [name for name in importing if LayerProject.layer_of(name) == "engine"]
    test_kit_files = [name for name in importing if LayerProject.layer_of(name) == "test kit"]
    assert engine_files == [], str(engine_files[:20])
    assert len(engine_files) + len(test_kit_files) == len(importing), str(engine_files[:20])
    assert bool(test_kit_files), str(engine_files[:20])


def orders_and_stock(project: LayerProject) -> None:
    project.add_module_folder("core.modules.orders", "orders")
    project.add_module_folder("core.modules.stock", "stock")
    project.add_file("src/core/modules/stock/models/stock_row.py")
    project.add_file(ORDER_LINES, "from core.modules.stock.models.stock_row import StockRow\n")


def test_512_a_core_module_that_imports_a_module_it_does_not_list_is_refused_naming_both_and_the_file(tmp_path):
    project = LayerProject(tmp_path)
    orders_and_stock(project)
    stock = project.declaration("stock", "core.modules.stock")
    unlisted = project.check(project.declaration("orders", "core.modules.orders"), stock)
    listed = project.check(project.declaration("orders", "core.modules.orders", "stock"), stock)
    assert unlisted == [f'{ORDER_LINES} imports core module stock, which core module orders may not use'], str(unlisted)
    assert listed == [], str(unlisted)


def test_513_two_modules_that_reach_one_another_are_named_as_a_loop(tmp_path):
    project = LayerProject(tmp_path)
    orders_and_stock(project)
    failures = project.check(project.declaration("orders", "core.modules.orders", "stock"), project.declaration("stock", "core.modules.stock", "orders"))
    assert failures == ['modules depend on one another in a loop: core module orders > core module stock > core module orders'], str(failures)


def test_517_a_core_module_that_imports_from_a_suite_is_refused_naming_the_module_the_suite_and_the_file(tmp_path):
    project = LayerProject(tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    project.add_module_folder("suites.shop", "shop")
    project.add_file("src/suites/shop/models/cart.py")
    project.add_file(ORDER_LINES, "from suites.shop.models.cart import Cart\n")
    shop = project.declaration("shop", "suites.shop")
    unlisted = project.check(project.declaration("orders", "core.modules.orders"), shop)
    listed = project.check(project.declaration("orders", "core.modules.orders", "shop"), shop)
    assert unlisted == [f'{ORDER_LINES} imports suite shop, which core module orders may not use'], f'{unlisted} {listed}'
    assert listed == ['journal.orders depends on journal.shop, which is above it'], f'{unlisted} {listed}'


def test_519_a_suite_uses_a_module_of_another_suite_only_when_it_lists_it(tmp_path):
    project = LayerProject(tmp_path)
    project.add_module_folder("suites.shop", "shop")
    project.add_module_folder("suites.shop.modules.carts", "carts")
    project.add_module_folder("suites.depot", "depot")
    project.add_file("src/suites/shop/modules/carts/models/cart.py")
    project.add_file("src/suites/depot/support/depot_lines.py", "from suites.shop.modules.carts.models.cart import Cart\n")
    shop, carts = project.declaration("shop", "suites.shop"), project.declaration("carts", "suites.shop.modules.carts")
    unlisted = project.check(shop, carts, project.declaration("depot", "suites.depot"))
    listed = project.check(shop, carts, project.declaration("depot", "suites.depot", "carts"))
    assert unlisted == ['src/suites/depot/support/depot_lines.py imports suite module shop/carts, which suite depot may not use'], str(unlisted)
    assert listed == [], str(unlisted)


def test_520_a_tunnel_is_held_to_what_it_lists_and_never_reaches_the_server(tmp_path):
    project = LayerProject(tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    project.add_module_folder("tunnels.pipe", "pipe")
    project.add_file("src/core/modules/orders/models/order.py")
    project.add_file("src/server/work/queue.py")
    project.add_file("src/tunnels/pipe/support/pipe_client.py", "from core.modules.orders.models.order import Order\nfrom server.work.queue import Queue\n")
    orders = project.declaration("orders", "core.modules.orders")
    unlisted = project.check(orders, project.declaration("pipe", "tunnels.pipe"))
    listed = project.check(orders, project.declaration("pipe", "tunnels.pipe", "orders"))
    assert project.layer_of('src/tunnels/pipe/support/pipe_client.py') == 'tunnel pipe', f'{unlisted} {listed}'
    assert 'src/tunnels/pipe/support/pipe_client.py imports core module orders, which tunnel pipe may not use' in unlisted, f'{unlisted} {listed}'
    assert listed == ['src/tunnels/pipe/support/pipe_client.py imports host server, which tunnel pipe may not use'], f'{unlisted} {listed}'


def test_529_a_module_folder_under_a_suite_that_the_suite_does_not_list_is_refused_naming_the_folder(tmp_path):
    project = LayerProject(tmp_path)
    project.add_module_folder("suites.shop", "shop")
    project.add_module_folder("suites.shop.modules.carts", "carts")
    shop = project.declaration("shop", "suites.shop")
    unlisted = project.check(shop)
    listed = project.check(shop, project.declaration("carts", "suites.shop.modules.carts"))
    assert unlisted == [f'{CARTS_FOLDER}: its declaration is not found by the loader'], str(unlisted)
    assert listed == [], str(unlisted)


def test_542_the_coding_suite_listing_is_a_module_list_its_module_is_in_the_suite_layer_and_a_suite_folder_under_the_core_is_in_no_layer(tmp_path):
    project = LayerProject(tmp_path)
    project.add_file("src/core/suites/shop/shop_module.py")
    failures = project.check()
    assert project.layer_of('src/suites/coding/coding_suite.py') == 'module list suites/coding', str(failures)
    assert project.layer_of('src/suites/coding/coding_module.py') == 'suite coding', str(failures)
    assert project.layer_of('src/core/suites/shop/shop_module.py') == 'no layer', str(failures)
    assert any(('src/core/suites' in failure for failure in failures)), str(failures)
