import json
from pathlib import Path

from engine.module.layer_allow_list import IMPORT_LINE, LayerAllowList
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.engine.module.support.layer_project import LayerProject

CONFIG_FILE = Path(__file__).resolve().parents[4] / ".commandments" / "config.json"
HAND_WRITTEN_LAYERS = "python/NamespaceDependencyDetector"
ORDER_LINES = "src/core/modules/orders/support/order_lines.py"
UNPLACED_FILE_ENDING = ": the file is in no layer"
ALLOWED_LINE = f"{ORDER_LINES} imports core module stock, which core module orders may not use"


def layers_in_configuration(config_file: Path) -> list[object]:
    return json.loads(config_file.read_text())["configure"].get(HAND_WRITTEN_LAYERS, [])


def test_523_a_layer_written_by_hand_in_the_configuration_is_found_and_the_real_one_holds_none(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    configuration = json.loads(CONFIG_FILE.read_text())
    configuration["configure"][HAND_WRITTEN_LAYERS] = [{"layer": ["core.modules.orders"]}]
    copy = tmp_path / "config.json"
    copy.write_text(json.dumps(configuration))
    story.expect_rows(layers_in_configuration(copy) == [{"layer": ["core.modules.orders"]}], layers_in_configuration(CONFIG_FILE) == [], detail=str(layers_in_configuration(CONFIG_FILE)))


def test_525_an_allowed_line_names_its_file_and_what_it_breaks_and_fails_once_it_holds_no_more(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    project = LayerProject(story, tmp_path)
    project.add_module_folder("core.modules.orders", "orders")
    project.add_module_folder("core.modules.stock", "stock")
    project.add_file("src/core/modules/stock/models/stock_row.py")
    project.add_file(ORDER_LINES, "from core.modules.stock.models.stock_row import StockRow\n")
    orders, stock = project.declaration("orders", "core.modules.orders"), project.declaration("stock", "core.modules.stock")
    while_it_holds = project.check_with_allow_list([ALLOWED_LINE], orders, stock)
    project.add_file(ORDER_LINES)
    once_fixed = project.check_with_allow_list([ALLOWED_LINE], orders, stock)
    unreadable = [line for line in LayerAllowList.lines() if not line.startswith("src/") or (IMPORT_LINE.match(line) is None and not line.endswith(UNPLACED_FILE_ENDING))]
    story.expect_rows(while_it_holds == [], once_fixed == [f"{ALLOWED_LINE}: is on the allow-list but no longer happens"], unreadable == [], detail=f"{once_fixed} {unreadable[:5]}")
