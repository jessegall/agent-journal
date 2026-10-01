from scripts.demo.session import Fork, Session

NAME = "crumb-and-co"
FIRST_COMMIT = "Start the bakery website"

PAGE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} · Crumb &amp; Co.</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header><a href="index.html">Crumb &amp; Co.</a><nav><a href="menu.html">Menu</a><a href="contact.html">Contact</a></nav></header>
  <main>
{body}
  </main>
</body>
</html>
"""

STYLE = """body { font-family: Georgia, serif; margin: 0; color: #3b2a1a; background: #fff8ef; }
header { display: flex; justify-content: space-between; padding: 16px 24px; background: #f3dfc1; }
nav a { margin-left: 16px; }
main { padding: 24px; }
"""

BAKES = (("Sourdough loaf", "Slow-risen overnight, with a dark crust", "€4.50"),
         ("Croissant", "All butter, baked at seven", "€2.20"),
         ("Carrot cake slice", "With walnuts and cream cheese", "€3.80"))

CONTACT = "    <h1>Visit us</h1>\n    <p>12 Linden Street</p>\n    <p>Tuesday to Sunday, 7:00 to 16:00. Closed on Mondays.</p>"


def page(title: str, body: str) -> str:
    return PAGE.format(title=title, body=body)


def trunk(s: Session) -> Fork:
    s.journal("feature", "switch", "sequences", actor="user")
    s.started()
    s.stop()
    asked = s.user("Hi! Can you build a simple website for Crumb & Co., our neighbourhood bakery? A home page, our menu and a contact page.")
    plan = s.made("plan", "create", "The Crumb & Co. website", "--set", "goal=A home page, a menu and a contact page that read well on any phone")
    s.journal("plan", "phase", str(plan), "The pages", "--when", "Home and menu exist and share one stylesheet")
    s.journal("plan", "phase", str(plan), "Visiting", "--when", "The contact page has the address and opening hours")
    s.journal("plan", "phase", str(plan), "Phones", "--when", "Every page reads well at phone width")
    s.journal("plan", "stage", str(plan), "todos")
    titles = (("Write the home page", "index.html with a short welcome"),
              ("One stylesheet for every page", "style.css with the bakery's colours"),
              ("Write the menu page", "menu.html listing the bakes"),
              ("Write the contact page", "contact.html with the address and opening hours"),
              ("Check every page on a phone", "Each page at 390px wide"))
    rows = [s.made("todo", "create", title, "--brief", brief) for title, brief in titles]
    s.journal("plan", "todos", str(plan), "1", *map(str, rows[:3]))
    s.journal("plan", "todos", str(plan), "2", str(rows[3]))
    s.journal("plan", "todos", str(plan), "3", str(rows[4]))
    s.journal("plan", "ready", str(plan))
    s.reply(asked, f"Gladly. Plan {plan} has three phases: the pages first, then the contact page with your opening hours, then a check on phones. "
                   "Approve it and I'll start.")
    s.stop()
    s.approve(plan)
    s.journal("plan", "start", str(plan))
    s.say("Approved, thank you. The home page and the stylesheet come first, then the menu.")
    for n, path, text in ((rows[1], "style.css", STYLE),
                          (rows[0], "index.html", page("Home", "    <h1>Fresh from the oven</h1>\n    <p>Sourdough, croissants and cakes, baked every morning on Linden Street.</p>"))):
        s.journal("todo", "start", str(n))
        s.write(path, text)
        s.journal("work", "log", f"Wrote {path}")
        s.journal("todo", "done", str(n), "--how", f"{path} is written")
    question = s.ask("Should the menu show prices?", f"todo:{rows[2]}",
                     {"Yes, show prices": "Each bake with its price beside it",
                      "No, just the names": "Names and a line each; prices at the counter"})
    return Fork(question, {"plan": plan, "menu": rows[2], "contact": rows[3], "phones": rows[4]})


def mondays(s: Session, fork: Fork) -> None:
    told = s.user("Remember: we're closed on Mondays.")
    s.journal("fact", "create", "Crumb & Co. is closed on Mondays", "--brief", "The owner said so; every page that shows opening hours says it",
              "--set", "keywords=hours,monday,opening")
    s.journal("todo", "start", str(fork.rows["contact"]))
    s.write("contact.html", page("Contact", CONTACT))
    s.journal("todo", "done", str(fork.rows["contact"]), "--how", "contact.html with the address and opening hours, closed on Mondays")
    s.reply(told, "Noted: closed on Mondays. The contact page says so, and I'll keep it in mind for every page with opening hours.")
    s.stop()


def priced(s: Session, fork: Fork) -> None:
    menu = fork.rows["menu"]
    s.journal("todo", "start", str(menu))
    rows = "\n".join(f"      <tr><td>{name}</td><td>{price}</td></tr>" for name, _, price in BAKES)
    s.write("menu.html", page("Menu", f"    <h1>Menu</h1>\n    <table>\n{rows}\n    </table>"))
    s.journal("work", "log", "The menu lists every bake with its price beside it, as asked")
    s.journal("todo", "done", str(menu), "--how", "menu.html with a price beside each bake")
    s.stop()
    mondays(s, fork)
    phones = fork.rows["phones"]
    s.journal("todo", "start", str(phones))
    s.shell("grep -n '<td>' menu.html | head -3")
    s.journal("work", "log", "At 390px the price column squeezes the names onto three lines; stacking the price under each name below 600px")
    report = s.made("report", "create", "Why the menu was cramped on phones", "--brief",
                    "The price column took a fixed share of a 390px screen, so the names wrapped onto three lines.")
    s.journal("report", "section", str(report), "What I found", "The table kept two columns at every width; at 390px the names had 150px.")
    s.journal("report", "section", str(report), "The fix", "Below 600px each row stacks: the name, then its price in a smaller line.")
    s.write("style.css", STYLE + "table { width: 100%; border-collapse: collapse; }\ntd { padding: 10px 4px; border-bottom: 1px solid #ead7bd; }\n"
                                 "@media (max-width: 600px) { main { padding: 16px; } tr, td { display: block; } td + td { font-size: 14px; border: 0; padding-top: 0; } }\n")
    s.journal("todo", "done", str(phones), "--how", "Below 600px the price sits under each name; every page reads well at 390px")
    s.stop()
    summary(s, f"Crumb & Co. has a home page, a menu with prices and a contact page that says you're closed on Mondays. "
               f"On phones the prices squeezed the names, so they now sit under each bake (report {report}). The plan is finished.")


def unpriced(s: Session, fork: Fork) -> None:
    menu = fork.rows["menu"]
    s.journal("todo", "start", str(menu))
    items = "\n".join(f"      <li><strong>{name}</strong><span>{line}</span></li>" for name, line, _ in BAKES)
    s.write("menu.html", page("Menu", f"    <h1>Menu</h1>\n    <ul class=\"bakes\">\n{items}\n    </ul>\n    <p class=\"note\">Ask at the counter for today's prices.</p>"))
    s.journal("work", "log", "No prices on the menu: each bake has a line of its own, and a note sends people to the counter")
    s.journal("todo", "done", str(menu), "--how", "menu.html with names, a line each and a note about prices")
    s.stop()
    mondays(s, fork)
    phones = fork.rows["phones"]
    s.journal("todo", "start", str(phones))
    s.write("style.css", STYLE + ".bakes { list-style: none; padding: 0; }\n.bakes li { display: grid; gap: 2px; padding: 10px 0; border-bottom: 1px solid #ead7bd; }\n"
                                 ".note { font-style: italic; }\n@media (max-width: 600px) { main { padding: 16px; } }\n")
    s.shell("grep -c '<li>' menu.html")
    s.journal("work", "log", "Every page reads well at 390px: the list stacks by itself, only the margins shrink")
    s.journal("todo", "done", str(phones), "--how", "Every page reads well at 390px")
    s.stop()
    summary(s, "Crumb & Co. has a home page, a menu that lists each bake with a line about it and sends people to the counter for prices, "
               "and a contact page that says you're closed on Mondays. Every page reads well on a phone. The plan is finished.")


def summary(s: Session, text: str) -> None:
    thanks = s.user("Thanks! Give me a short summary.")
    s.reply(thanks, text)
    s.stop()


BRANCHES = {"Yes, show prices": priced, "No, just the names": unpriced}
