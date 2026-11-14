from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.engine.module.support.layer_project import LayerProject

LOOP_FIRST = "tests.stories.engine.module.support.loop_modules:LoopFirst"
ORDER_LINES = "src/core/modules/orders/support/order_lines.py"


def orders_and_stock(project: LayerProject) -> None:
    project.add_module_folder("core.modules.orders", "orders")
    project.add_module_folder("core.modules.stock", "stock")
    project.add_file("src/core/modules/stock/models/stock_row.py")
    project.add_file(ORDER_LINES, "from core.modules.stock.models.stock_row import StockRow\n")


def test_512_a_core_module_that_imports_a_module_it_does_not_list_is_refused_naming_both_and_the_file(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    project = LayerProject(story, tmp_path)
    orders_and_stock(project)
    stock = project.declaration("stock", "core.modules.stock")
    unlisted = project.check(project.declaration("orders", "core.modules.orders"), stock)
    listed = project.check(project.declaration("orders", "core.modules.orders", "stock"), stock)
    story.expect_rows(unlisted == [f"{ORDER_LINES} imports core module stock, which core module orders may not use"], listed == [], detail=str(unlisted))


def test_513_two_modules_that_reach_one_another_are_named_as_a_loop(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    project = LayerProject(story, tmp_path)
    orders_and_stock(project)
    failures = project.check(project.declaration("orders", "core.modules.orders", "stock"), project.declaration("stock", "core.modules.stock", "orders"))
    story.expect_rows(failures == ["modules depend on one another in a loop: core module orders > core module stock > core module orders"], detail=str(failures))


def test_517_a_core_module_that_imports_from_a_suite_is_refused_naming_the_module_the_suite_and_the_file(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    project = LayerProject(story, tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    project.add_module_folder("suites.shop", "shop")
    project.add_file("src/suites/shop/models/cart.py")
    project.add_file(ORDER_LINES, "from suites.shop.models.cart import Cart\n")
    shop = project.declaration("shop", "suites.shop")
    unlisted = project.check(project.declaration("orders", "core.modules.orders"), shop)
    listed = project.check(project.declaration("orders", "core.modules.orders", "shop"), shop)
    story.expect_rows(unlisted == [f"{ORDER_LINES} imports suite shop, which core module orders may not use"],
                      listed == ["journal.orders depends on journal.shop, which is above it"], detail=f"{unlisted} {listed}")


def test_519_a_suite_uses_a_module_of_another_suite_only_when_it_lists_it(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    project = LayerProject(story, tmp_path)
    project.add_module_folder("suites.shop", "shop")
    project.add_module_folder("suites.shop.modules.carts", "carts")
    project.add_module_folder("suites.depot", "depot")
    project.add_file("src/suites/shop/modules/carts/models/cart.py")
    project.add_file("src/suites/depot/support/depot_lines.py", "from suites.shop.modules.carts.models.cart import Cart\n")
    shop, carts = project.declaration("shop", "suites.shop"), project.declaration("carts", "suites.shop.modules.carts")
    unlisted = project.check(shop, carts, project.declaration("depot", "suites.depot"))
    listed = project.check(shop, carts, project.declaration("depot", "suites.depot", "carts"))
    story.expect_rows(unlisted == ["src/suites/depot/support/depot_lines.py imports suite module shop/carts, which suite depot may not use"], listed == [], detail=str(unlisted))


def test_520_a_tunnel_is_held_to_what_it_lists_and_never_reaches_the_server(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    project = LayerProject(story, tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    project.add_module_folder("tunnels.pipe", "pipe")
    project.add_file("src/core/modules/orders/models/order.py")
    project.add_file("src/server/work/queue.py")
    project.add_file("src/tunnels/pipe/support/pipe_client.py", "from core.modules.orders.models.order import Order\nfrom server.work.queue import Queue\n")
    orders = project.declaration("orders", "core.modules.orders")
    unlisted = project.check(orders, project.declaration("pipe", "tunnels.pipe"))
    listed = project.check(orders, project.declaration("pipe", "tunnels.pipe", "orders"))
    story.expect_rows(project.layer_of("src/tunnels/pipe/support/pipe_client.py") == "tunnel pipe",
                      "src/tunnels/pipe/support/pipe_client.py imports core module orders, which tunnel pipe may not use" in unlisted,
                      listed == ["src/tunnels/pipe/support/pipe_client.py imports host server, which tunnel pipe may not use"], detail=f"{unlisted} {listed}")


def test_524_a_module_whose_dependencies_lead_back_to_it_is_refused_at_boot_with_the_loop_printed(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(LOOP_FIRST, "folder.loop-first > folder.loop-first")
