from dataclasses import replace

from core.modules.processes.support.stock_digest import StockDigest
from core.modules.processes.support.stock_reader import StockReader

SHIPPED = StockReader("tool-test", "tool test*", "Tool tests", "passed", summary="([0-9]+) passed")


def test_the_same_fields_give_the_same_digest():
    assert StockDigest.of(SHIPPED) == StockDigest.of(replace(SHIPPED))


def test_a_changed_pattern_changes_the_digest():
    assert StockDigest.of(SHIPPED) != StockDigest.of(replace(SHIPPED, summary="([0-9]+) tests passed"))


def test_the_digest_does_not_depend_on_the_order_the_fields_are_given_in():
    given_the_other_way = StockReader(summary="([0-9]+) passed", lines="passed", title="Tool tests", commands="tool test*", name="tool-test")
    assert StockDigest.of(SHIPPED) == StockDigest.of(given_the_other_way)
