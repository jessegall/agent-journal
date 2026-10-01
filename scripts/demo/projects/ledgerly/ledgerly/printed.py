from ledgerly.invoice import net, totals


def printed(invoice: dict) -> str:
    rows = [f"Invoice {invoice['number']} for {invoice['customer']}", ""]
    rows += [f"{line['name']:<28}{line['quantity']:>3} × €{line['price']:>6}  €{net(line):>7}" for line in invoice["lines"]]
    sums = totals(invoice)
    rows += ["", f"{'Net':<44}€{sums['net']:>7}", f"{'VAT 21%':<44}€{sums['vat']:>7}", f"{'Total':<44}€{sums['total']:>7}"]
    return "\n".join(rows)
