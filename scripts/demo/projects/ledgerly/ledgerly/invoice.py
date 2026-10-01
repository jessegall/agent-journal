import json
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

CENT = Decimal("0.01")
RATE = Decimal("0.21")


def cents(amount: Decimal) -> Decimal:
    return amount.quantize(CENT, rounding=ROUND_HALF_UP)


def loaded(path: Path) -> dict:
    invoice = json.loads(path.read_text())
    invoice["lines"] = [{**line, "price": Decimal(line["price"])} for line in invoice["lines"]]
    return invoice


def net(line: dict) -> Decimal:
    return line["price"] * line["quantity"]


def vat(line: dict) -> Decimal:
    return cents(net(line) * RATE)


def totals(invoice: dict) -> dict:
    lines = invoice["lines"]
    subtotal = cents(sum(net(line) for line in lines))
    tax = sum(vat(line) for line in lines)
    return {"net": subtotal, "vat": tax, "total": subtotal + tax}
