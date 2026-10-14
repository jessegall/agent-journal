from scripts.demo.session import Session

NAME = "ledgerly"
FIRST_COMMIT = "Ledgerly prints invoices with VAT"

FINDINGS = {
    "printed() never shows the invoice date": "ledgerly/printed.py builds the header from number and customer only; every invoice JSON carries a date.",
    "The README's example invoice does not exist": "README.md runs python3 -m ledgerly invoices/2041.json from the project root, but says nothing about where invoices live.",
}

DATED = '''from ledgerly.invoice import net, totals


def printed(invoice: dict) -> str:
    rows = [f"Invoice {invoice['number']} for {invoice['customer']}, {invoice['date']}", ""]
    rows += [f"{line['name']:<28}{line['quantity']:>3} × €{line['price']:>6}  €{net(line):>7}" for line in invoice["lines"]]
    sums = totals(invoice)
    rows += ["", f"{'Net':<44}€{sums['net']:>7}", f"{'VAT 21%':<44}€{sums['vat']:>7}", f"{'Total':<44}€{sums['total']:>7}"]
    return "\\n".join(rows)
'''

README = '''# Ledgerly

Invoices for small shops: lines, VAT and a printable copy.

Each invoice is a JSON file in `invoices/`, named after its number. Print one from the project root:

```
python3 -m ledgerly invoices/2041.json
```
'''


def lesson(s: Session) -> None:
    s.started()
    s.stop()
    asked = s.user("Before I send Ledgerly to the shops, please dispatch two agents to review it: one for the code, one for the docs.")
    todo = s.made("todo", "create", "Review Ledgerly before it ships", "--brief", "A code review and a docs review by subagents, findings filed as to-dos")
    s.journal("todo", "start", str(todo))
    s.reply(asked, "Sending two reviewers now, each on its own read-only job: Ada Linewise (Sonnet) reads the code, "
                   "Dr. Pagewell (Haiku) checks the README against it. I'll file what they find.")
    ada = s.dispatched("Ada Linewise", "review the invoice code", "reviewer", "sonnet",
                       "Review ledgerly/ for correctness and anything a shop would notice on a printed invoice. Read only; report findings with file and line.")
    page = s.dispatched("Dr. Pagewell", "check the README against the code", "Explore", "haiku",
                        "Check README.md against how ledgerly is actually run. Read only; report what a new user would trip over.")
    s.shell("sed -n 1,20p ledgerly/printed.py", ada.seat)
    s.shell("grep -n date invoices/2041.json", ada.seat)
    s.shell("cat README.md", page.seat)
    s.shell("ls invoices | head -3", page.seat)
    s.came_back(ada, "One finding: printed() never shows the invoice date (ledgerly/printed.py:5); every invoice JSON carries one. VAT and totals are sound.")
    s.came_back(page, "One finding: the README's example runs invoices/2041.json but never says invoices live in invoices/ as JSON named by number.")
    date, readme = (s.made("todo", "create", title, "--brief", brief) for title, brief in FINDINGS.items())
    s.journal("work", "log", f"Both reviewers are back: 2 findings, filed as to-dos {date} and {readme}")
    when = s.ask("Fix the two findings now, or keep them for later?", f"todo:{todo}",
                 {"Fix them now": "Both are small: the date on the printed invoice and a line in the README",
                  "Keep them for later": "They stay on the list as to-dos; Ledgerly ships as it is"}, "Fix them now")
    s.answered(when)
    s.write("ledgerly/printed.py", DATED)
    s.shell("python3 -m ledgerly invoices/2041.json | head -1")
    s.journal("todo", "done", str(date), "--how", "The printed invoice shows its date in the header")
    s.write("README.md", README)
    s.journal("todo", "done", str(readme), "--how", "The README says where invoices live and how they are named")
    s.shell(f"git add -A && git commit -qm 'Show the invoice date and say where invoices live' -m 'Journal: todos done {todo}'")
    s.say("Both fixed and committed: the printed invoice shows its date, and the README says invoices live in invoices/ as JSON named by their number.")
    s.stop()
