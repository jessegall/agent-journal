from scripts.demo.session import Phase, Session

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


def lesson(s: Session) -> None:
    s.started()
    s.stop()
    asked = s.user("Hi! We'd like a simple website for Crumb & Co., our neighbourhood bakery: a home page, our menu and a contact page. "
                   "Can you write a plan for it?")
    s.reply(asked, "Gladly. One thing first, so the plan fits what you need.")
    depth = s.ask("How thorough should the plan be?", f"message:{asked}",
                  {"Normal": "The phases and the to-dos that matter; small details are settled as the work goes",
                   "Thorough": "Every part researched first, with a to-do for every small thing"}, "Normal")
    s.answered(depth)
    planned = s.planned("The Crumb & Co. website", "A home page, a menu and a contact page that read well on any phone", [
        Phase("The pages", "Home and menu exist and share one stylesheet", (("Write the home page", "index.html with a short welcome"),
                                                                            ("One stylesheet for every page", "style.css with the bakery's colours"),
                                                                            ("Write the menu page", "menu.html listing the bakes with their prices"))),
        Phase("Visiting", "The contact page has the address and opening hours", (("Write the contact page", "contact.html with the address and opening hours"),)),
        Phase("Phones", "Every page reads well at phone width", (("Check every page on a phone", "Each page at 390px wide"),)),
    ])
    plan, (home, style, menu, contact, phones) = planned.n, planned.rows
    s.say(f"Plan {plan} is ready, with three phases: the pages first, then the contact page with your opening hours, then a check on phones. "
          "Read it and approve it with its button, and I'll start.")
    s.stop()
    s.approve(plan)
    s.journal("plan", "start", str(plan))
    s.say("Approved, thank you. The stylesheet and the home page come first, then the menu.")
    rows = "\n".join(f"      <tr><td>{name}</td><td>{price}</td></tr>" for name, _, price in BAKES)
    for n, path, text in ((style, "style.css", STYLE),
                          (home, "index.html", page("Home", "    <h1>Fresh from the oven</h1>\n    <p>Sourdough, croissants and cakes, baked every morning on Linden Street.</p>")),
                          (menu, "menu.html", page("Menu", f"    <h1>Menu</h1>\n    <table>\n{rows}\n    </table>")),
                          (contact, "contact.html", page("Contact", CONTACT))):
        s.journal("todo", "start", str(n))
        s.write(path, text)
        s.journal("work", "log", f"Wrote {path}")
        s.journal("todo", "done", str(n), "--how", f"{path} is written")
    s.journal("todo", "start", str(phones))
    s.shell("grep -n '<td>' menu.html | head -3")
    s.journal("work", "log", "At 390px the price column squeezes the names onto three lines; stacking the price under each name below 600px")
    s.write("style.css", STYLE + "table { width: 100%; border-collapse: collapse; }\ntd { padding: 10px 4px; border-bottom: 1px solid #ead7bd; }\n"
                                 "@media (max-width: 600px) { main { padding: 16px; } tr, td { display: block; } td + td { font-size: 14px; border: 0; padding-top: 0; } }\n")
    s.journal("todo", "done", str(phones), "--how", "Below 600px the price sits under each name; every page reads well at 390px")
    s.say("The plan is finished: a home page, a menu with prices and a contact page with your address and hours. "
          "On phones the prices squeezed the bake names, so below 600px each price now sits under its bake.")
    s.stop()
