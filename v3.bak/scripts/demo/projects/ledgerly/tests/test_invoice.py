from decimal import Decimal

from ledgerly.invoice import totals


def invoice(*prices: str) -> dict:
    return {"lines": [{"name": "item", "price": Decimal(price), "quantity": 1} for price in prices]}


def test_one_line():
    assert totals(invoice("10.00")) == {"net": Decimal("10.00"), "vat": Decimal("2.10"), "total": Decimal("12.10")}


def test_two_lines():
    assert totals(invoice("10.00", "5.00"))["total"] == Decimal("18.15")
