from scripts.demo.session import Fork, Session

NAME = "ledgerly"
FIRST_COMMIT = "Ledgerly prints invoices with VAT"

FAILING = '''from decimal import Decimal
from pathlib import Path

from ledgerly.invoice import loaded, totals


def test_invoice_2041_matches_the_accountant():
    assert totals(loaded(Path("invoices/2041.json")))["vat"] == Decimal("6.29")
'''

ON_THE_TOTAL = '''def totals(invoice: dict) -> dict:
    lines = invoice["lines"]
    subtotal = cents(sum(net(line) for line in lines))
    tax = cents(subtotal * RATE)
    return {"net": subtotal, "vat": tax, "total": subtotal + tax}
'''

PER_LINE = '''def totals(invoice: dict) -> dict:
    lines = invoice["lines"]
    subtotal = cents(sum(net(line) for line in lines))
    tax = sum(vat(line) for line in lines)
    return {"net": subtotal, "vat": tax, "total": subtotal + tax}
'''

AUDIT = '''import sys
from pathlib import Path

from ledgerly.invoice import RATE, cents, loaded, totals, vat

for path in sorted(Path(sys.argv[1]).glob("*.json")):
    invoice = loaded(path)
    per_line = sum(vat(line) for line in invoice["lines"])
    once = cents(totals(invoice)["net"] * RATE)
    if per_line != once:
        print(f"{invoice['number']} {invoice['customer']}, {invoice['date']}: printed €{per_line} VAT, €{once} on the total")
'''

PRINTED = '''from ledgerly.invoice import net, totals, vat


def printed(invoice: dict) -> str:
    rows = [f"Invoice {invoice['number']} for {invoice['customer']}", ""]
    rows += [f"{line['name']:<28}{line['quantity']:>3} × €{line['price']:>6}  €{net(line):>7}  VAT €{vat(line):>5}" for line in invoice["lines"]]
    sums = totals(invoice)
    rows += ["", f"{'Net':<44}€{sums['net']:>7}", f"{'VAT 21%, the sum of the lines':<44}€{sums['vat']:>7}", f"{'Total':<44}€{sums['total']:>7}"]
    return "\\n".join(rows)
'''

LINE_TEST = '''from decimal import Decimal
from pathlib import Path

from ledgerly.invoice import loaded, totals
from ledgerly.printed import printed


def test_invoice_2041_rounds_vat_per_line():
    assert totals(loaded(Path("invoices/2041.json")))["vat"] == Decimal("6.30")


def test_every_line_shows_its_vat():
    assert printed(loaded(Path("invoices/2041.json"))).count("VAT € 2.10") == 3
'''


def trunk(s: Session) -> Fork:
    s.started()
    s.stop()
    asked = s.user("A customer says invoice 2041 is a cent off: three lines at €9.99 with 21% VAT. Can you find out why?")
    todo = s.made("todo", "create", "Find why invoice 2041 is a cent off", "--brief", "Bramble Books: three lines at €9.99, 21% VAT; the customer's total differs by a cent")
    s.journal("todo", "start", str(todo))
    s.shell("python3 -m ledgerly invoices/2041.json")
    s.shell("grep -n 'def \\|RATE' ledgerly/invoice.py")
    s.journal("work", "log", "Ledgerly rounds the VAT on each line: 3 × €2.10 = €6.30. On the total it is 21% of €29.97 = €6.29, a cent less.")
    s.write("tests/test_vat.py", FAILING)
    s.shell("python3 -m pytest -q tests/test_vat.py 2>&1 | tail -2")
    s.journal("work", "log", "tests/test_vat.py reproduces it: it expects €6.29 and gets €6.30. Both ways of rounding are allowed; which one is the shop's choice.")
    s.reply(asked, "Found it. Ledgerly rounds the VAT on each line (3 × €2.10 = €6.30), and the customer's accountant takes 21% of the total "
                   "(€29.97 → €6.29). Both are allowed, so which one Ledgerly uses is your call.")
    question = s.ask("Round the VAT per line or on the invoice total?", f"todo:{todo}",
                     {"On the total": "Add the lines first and round the VAT once; invoice 2041 becomes €6.29",
                      "Per line, as we do now": "Keep the amounts; print each line's VAT so the sum adds up on paper"})
    return Fork(question, {"todo": todo})


def on_the_total(s: Session, fork: Fork) -> None:
    source = (s.project / "ledgerly" / "invoice.py").read_text()
    s.write("ledgerly/invoice.py", source.replace(PER_LINE, ON_THE_TOTAL))
    s.shell("python3 -m pytest -q 2>&1 | tail -1")
    s.journal("rule", "create", "VAT is rounded once, on the invoice total", "--brief",
              "The shop chose it when invoice 2041 came out a cent off; the accountant rounds the same way.", "--set", "keywords=vat,rounding,invoice")
    s.write("ledgerly/audit.py", AUDIT)
    found = s.shell("python3 -m ledgerly.audit invoices")
    count = len(found.splitlines())
    s.shell(f"git add -A && git commit -qm 'VAT is rounded once, on the invoice total' -m 'Journal: todos done {fork.rows['todo']}'")
    s.reported("Why invoice 2041 was a cent off",
               f"Ledgerly rounded the VAT per line; the shop rounds it on the total now. {count} invoices since March printed a different VAT.",
               {"What went wrong": "Each line's VAT was rounded before adding them up, so three lines at €9.99 gave €6.30 instead of €6.29.",
                "Invoices affected": found.strip(),
                "What was already sound": "The net amounts and totals before VAT were right on every invoice.",
                "The fix": "totals() adds the lines first and rounds the VAT once; tests/test_vat.py holds invoice 2041 to €6.29.",
                "What remains uncertain": "Whether the customers of the other invoices should get a corrected copy is the shop's call."},
               [f"todo:{fork.rows['todo']}"], f"Fixed: the VAT is now rounded once, on the total, and invoice 2041 comes to €6.29. {count} invoices since March printed a different VAT.")
    s.stop()
    guarded(s)


def per_line(s: Session, fork: Fork) -> None:
    s.write("ledgerly/printed.py", PRINTED)
    s.write("tests/test_vat.py", LINE_TEST)
    s.shell("python3 -m pytest -q 2>&1 | tail -1")
    s.shell("python3 -m ledgerly invoices/2041.json")
    s.journal("fact", "create", "Ledgerly rounds VAT per line, and the invoice shows it", "--brief",
              "The tax office allows either; the shop keeps per line, so every printed line carries its own VAT and the sum adds up.",
              "--set", "keywords=vat,rounding,invoice")
    s.shell(f"git add -A && git commit -qm 'Print the VAT of every line on the invoice' -m 'Journal: todos done {fork.rows['todo']}'")
    s.reported("Why invoice 2041 looked a cent off",
               "No amount was wrong: Ledgerly rounds VAT per line. The invoice now prints each line's VAT, so the €6.30 adds up.",
               {"What the customer saw": "Only the total VAT was printed; 21% of €29.97 is €6.29, so €6.30 looked wrong.",
                "What was already sound": "Every amount was right under per-line rounding, which the tax office allows.",
                "What changed": "Each line now prints its own VAT (€2.10 three times), and the VAT row says it is the sum of the lines.",
                "What remains uncertain": "The customer's accountant may still prefer rounding on the total; that is a choice for the shop."},
               [f"todo:{fork.rows['todo']}"], "Kept per line: no amount was wrong. The invoice now prints each line's VAT, so €2.10 three times adds up to €6.30 on paper.")
    s.stop()
    guarded(s)


def guarded(s: Session) -> None:
    asked = s.user("Make sure this never comes back.")
    check = s.made("check", "create", "The invoice tests pass", "--set", "command=python3 -m pytest -q tests", "--set", "every=60")
    s.journal("check", "run", str(check))
    s.reply(asked, f"Check {check} runs the invoice tests every hour, invoice 2041 included, and tells me the moment one fails. It passes now.")
    s.stop()


BRANCHES = {"On the total": on_the_total, "Per line, as we do now": per_line}
