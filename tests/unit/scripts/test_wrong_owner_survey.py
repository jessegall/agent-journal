import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SPECIFICATION = importlib.util.spec_from_file_location("wrong_owner_survey", ROOT / "scripts" / "wrong_owner_survey.py")
wrong_owner_survey = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(wrong_owner_survey)
KNOWN_LINES = ROOT / "tests" / "snapshots" / "wrong_owner.txt"


def known_lines() -> list[str]:
    return KNOWN_LINES.read_text().splitlines()


def test_no_file_sits_with_the_wrong_owner_beyond_the_known_lines():
    added = sorted(set(wrong_owner_survey.WrongOwnerSurvey().known_lines()) - set(known_lines()))
    assert added == [], "move the file to its owner; the list of known lines only shrinks"


def test_a_known_line_that_no_longer_happens_is_taken_off_the_list():
    stale = sorted(set(known_lines()) - set(wrong_owner_survey.WrongOwnerSurvey().known_lines()))
    assert stale == [], "delete these lines from tests/snapshots/wrong_owner.txt"


def test_every_known_line_names_a_file_that_exists():
    missing = [line for line in known_lines() if not (ROOT / line.split(": ")[1]).is_file()]
    assert missing == []


def test_a_handler_is_with_its_command_when_both_are_in_one_module():
    survey = wrong_owner_survey.WrongOwnerSurvey
    handler = Path("src/core/modules/orders/commands/ship_order/ship_order_handler.py")
    assert survey.is_command_of(handler, "core.modules.stock.commands.ship_order.ship_order")
    assert not survey.is_command_of(handler, "core.modules.stock.commands.count_stock.count_stock")
    assert survey.owner(handler) == "orders" and survey.imported_owner("core.modules.stock.commands.ship_order.ship_order") == "stock"


def test_the_owner_of_a_suite_module_file_is_the_module_and_of_a_suite_file_the_suite():
    survey = wrong_owner_survey.WrongOwnerSurvey
    assert survey.owner(Path("src/suites/shop/modules/carts/models/cart.py")) == "carts"
    assert survey.owner(Path("src/suites/shop/models/shop.py")) == "shop"
    assert survey.owner(Path("src/engine/clock/clock.py")) == "clock"
