from scripts.demo.session import Session

NAME = "mothlight-theatre"
FIRST_COMMIT = "Start the Mothlight Theatre website"

HOME = """<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Mothlight Theatre</title></head>
<body>
  <h1>Mothlight Theatre</h1>
  <p>Small shows for curious neighbours.</p>
</body>
</html>
"""

WEEKLY = """<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Shows · Mothlight Theatre</title></head>
<body>
  <h1>This week's shows</h1>
  <table>
    <tr><th>Day</th><th>Time</th><th>What to expect</th></tr>
    <tr><td>Friday</td><td>17:30</td><td>Sensory-friendly show; the house lights stay low.</td></tr>
  </table>
</body>
</html>
"""

def lesson(s: Session) -> None:
    s.started()
    s.stop()
    asked = s.user("Could you make a small home page for Mothlight Theatre? We'll add show times later.")
    home = s.made("todo", "create", "Make the Mothlight Theatre home page", "--brief", "A small welcome page; show times will follow")
    s.journal("todo", "start", str(home))
    s.write("index.html", HOME)
    s.journal("todo", "done", str(home), "--how", "index.html welcomes visitors")
    s.reply(asked, "The home page is ready. Send me the show times when you have them.")
    s.stop()

    detail = s.user("Remember: Friday's 17:30 show is sensory-friendly, and the house lights stay low.")
    fact = s.made("fact", "create", "Mothlight Theatre's Friday show is sensory-friendly with low house lights",
                  "--brief", "The theatre organiser said it starts at 17:30; include the time and low lights whenever the show schedule is written.",
                  "--set", "keywords=schedule,show times,Friday")
    s.reply(detail, f"I'll keep that for later (fact {fact}).")
    s.stop()

    later = s.user("The show schedule is ready to add now. Can you make the page?")
    s.shell("grep -n 'schedule' README.md")
    todo = s.made("todo", "create", "Add the Mothlight Theatre show schedule",
                  "--brief", "Use the Friday show detail the organiser gave earlier; ask how to present it")
    s.reply(later, "Yes. I still have the Friday detail: 17:30, sensory-friendly, with low house lights. How should the schedule look?")
    shape = s.ask("How should the show schedule be presented?", f"todo:{todo}",
                  {"Weekly table": "Show the day, time and accessibility detail in a table",
                   "Short list": "Show the same detail as a short, easy-to-scan listing"}, "Weekly table")
    s.answered(shape)
    s.journal("todo", "start", str(todo))
    s.write("shows.html", WEEKLY)
    s.write("index.html", HOME.replace("</body>", '  <p><a href="shows.html">See the show schedule</a></p>\n</body>'))
    s.journal("work", "log", "The weekly table carries the remembered Friday time and accessibility detail")
    s.journal("todo", "done", str(todo), "--how", "shows.html presents Friday's show as a weekly table")
    s.stop()
    thanks = s.user("Thanks. What did you remember, and what did you make?")
    s.reply(thanks, "I remembered your Friday 17:30 sensory-friendly show and its low house lights. The home page now links to a weekly table with those details.")
    s.stop()
