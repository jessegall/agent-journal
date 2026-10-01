from scripts.demo.session import Fork, Session

NAME = "pebble-pantry"
FIRST_COMMIT = "Pebble Pantry scales recipes"

ROUNDED = '''from fractions import Fraction

WHOLE = {"eggs"}


def scale(amount, guests, serves):
    return amount * guests / serves


def tidy(name, amount):
    if name in WHOLE:
        return max(1, round(amount))
    return float(Fraction(amount).limit_denominator(4))


def scaled(recipe, guests):
    return {name: tidy(name, scale(amount, guests, recipe["serves"])) for name, amount in recipe["amounts"].items()}
'''

UNITS = '''GRAMS_PER_CUP = {"flour": 120, "sugar": 200, "butter": 227}
GRAMS_PER_SPOON = {"flour": 8, "sugar": 12, "butter": 14}


def grams(ingredient, cups):
    return cups * GRAMS_PER_CUP[ingredient]
'''

TESTS = '''from pantry.units import grams


def test_flour_cup():
    assert grams("flour", 1) == 120


def test_sugar_half_cup():
    assert grams("sugar", 0.5) == 100
'''

BUTTER = TESTS + '''

def test_butter_cup():
    assert grams("butter", 1) == 227
'''

README = "# Pebble Pantry\n\nScales a recipe for any number of guests.\n\n## Usage\n\n"
JOKE = README + "It scales everything, even the dog's portion. Results may vary with the size of the dog.\n"
USAGE = README + "```\npython3 -m pantry recipes/pancakes.json --guests 5\n```\n\nEggs come out whole; cups round to the nearest quarter.\n"


def trunk(s: Session) -> Fork:
    s.journal("feature", "switch", "sequences", actor="user")
    s.started()
    s.stop()
    asked = s.user("Pebble Pantry scales recipes badly: 2.5 guests gives 3 eggs and 0.33333 cups. Plan the fix, and tell me which parts could go to helpers.")
    s.shell("ls pantry && python3 -m pytest -q 2>&1 | tail -1")
    plan = s.made("plan", "create", "Recipes that scale sensibly", "--set", "goal=Scaled recipes give whole eggs and kitchen-sized fractions, with tests and a README")
    s.journal("plan", "phase", str(plan), "Round amounts sensibly", "--when", "Eggs come out whole and cups in quarters")
    s.journal("plan", "phase", str(plan), "Cover units with tests", "--when", "Every unit conversion has a test")
    s.journal("plan", "phase", str(plan), "Write usage in the README", "--when", "The README shows how to scale a recipe")
    s.journal("plan", "stage", str(plan), "todos")
    rounding = s.made("todo", "create", "Round scaled amounts sensibly", "--brief", "Whole eggs, quarters for cups, in pantry/scale.py")
    tests = s.made("todo", "create", "Unit tests for every conversion", "--brief", "Cups, spoons and grams in pantry/units.py")
    readme = s.made("todo", "create", "Usage in the README", "--brief", "One example of scaling pancakes")
    s.journal("plan", "todos", str(plan), "1", str(rounding))
    s.journal("plan", "todos", str(plan), "2", str(tests))
    s.journal("plan", "todos", str(plan), "3", str(readme))
    s.journal("plan", "ready", str(plan))
    s.reply(asked, f"Plan {plan} is ready: round the amounts, cover the units with tests, and write the usage in the README. "
                   f"The tests (to-do {tests}) and the README (to-do {readme}) are bounded jobs that suit helpers; the rounding is mine.")
    s.stop()
    s.approve(plan)
    s.journal("plan", "start", str(plan))
    s.say("Approved. Tell me who should take the tests and the README, and I'll start on the rounding meanwhile.")
    s.stop()
    go = s.user("Send the unit tests to Codex in its own worktree, and the README to a Claude helper. You take the rounding.")
    quill = s.dispatch("Quill Testwick", "Unit tests for every conversion", "codex", "gpt-6-sol",
                       "Write tests in tests/test_units.py for cups, spoons and grams in pantry/units.py; commit them in your worktree.", worktree=True)
    wren = s.dispatch("Wren Penwright", "Usage in the README", "claude", "haiku",
                      "Add a short Usage section to README.md with one example of scaling pancakes for 5 guests.")
    s.reply(go, "Quill (Codex, gpt-6-sol) writes the unit tests in its own worktree, and Wren (Claude, haiku) the README. I'm on the rounding.")
    quill_seat, wren_seat = s.helper_seat("Quill Testwick", "codex", worktree=True), s.helper_seat("Wren Penwright", "claude")
    s.started(quill_seat)
    s.started(wren_seat)
    s.journal("todo", "start", "1", seat=quill_seat)
    s.journal("todo", "start", "1", seat=wren_seat)
    s.journal("todo", "start", str(rounding))
    s.shell("grep -n scale pantry/scale.py")
    s.write("pantry/scale.py", ROUNDED)
    s.shell("cat pantry/units.py", quill_seat)
    s.write("tests/test_units.py", TESTS, quill_seat)
    s.journal("work", "log", "Rounding: eggs whole, everything else to the nearest quarter")
    s.write("README.md", JOKE, wren_seat)
    s.shell("python3 -m pytest -q 2>&1 | tail -1")
    s.journal("todo", "done", str(rounding), "--how", "Eggs come out whole and the rest rounds to quarters in pantry/scale.py")
    s.stop()
    butter = s.user("Tell Codex to also cover grams for butter.")
    s.helpers().say(quill, "Also cover grams for butter: add butter to GRAMS_PER_CUP (227 g a cup) and a test for it.")
    s.reply(butter, "Passed on to Quill: butter at 227 grams a cup, with a test.")
    s.write("pantry/units.py", UNITS, quill_seat)
    s.write("tests/test_units.py", BUTTER, quill_seat)
    s.stop()
    s.mode("orchestrator")
    review = s.user("From now on you only plan and review.")
    s.reply(review, "Orchestrator mode it is: I plan, send and review, and leave the writing to the helpers.")
    s.shell("cat README.md")
    question = s.ask("Wren's README is off track. What should happen?", f"todo:{readme}",
                     {"Stop Wren, send a fresh helper": "Wren stops; a new Claude helper writes the usage again",
                      "Let Wren fix it": "Wren hears what is wrong and rewrites the section"})
    return Fork(question, {"plan": plan, "tests": tests, "readme": readme, "quill": quill, "wren": wren})


def fresh(s: Session, fork: Fork) -> None:
    wren_seat = s.helper_seat("Wren Penwright", "claude")
    s.helpers().stop(fork.rows["wren"])
    s.ended(wren_seat)
    s.journal("helper", "finish", str(fork.rows["wren"]))
    moss = s.dispatch("Moss Inkwell", "Usage in the README", "claude", "haiku",
                      "Rewrite the Usage section of README.md: scaling pancakes from 2 to 5 guests with python3 -m pantry, and how amounts round.")
    s.say("Wren is stopped; its section joked about a dog instead of showing an example. Moss (Claude, haiku) writes it again.")
    moss_seat = s.helper_seat("Moss Inkwell", "claude")
    s.started(moss_seat)
    s.journal("todo", "start", "1", seat=moss_seat)
    s.write("README.md", USAGE, moss_seat)
    s.journal("todo", "done", "1", "--how", "README has a Usage section with the pancakes example", seat=moss_seat)
    s.journal("helper", "report", "README.md has a Usage section: scaling pancakes from 2 to 5 guests, and a line on how amounts round.", seat=moss_seat)
    s.ended(moss_seat)
    s.journal("helper", "finish", str(moss))
    s.journal("todo", "done", str(fork.rows["readme"]), "--how", "Moss rewrote the usage after Wren was stopped")
    s.stop()
    together(s, fork, "Wren's README was stopped and Moss (Claude) wrote it again")


def fixed(s: Session, fork: Fork) -> None:
    wren_seat = s.helper_seat("Wren Penwright", "claude")
    s.helpers().say(fork.rows["wren"], "The usage section jokes instead of showing how to run it. Show scaling pancakes from 2 to 5 guests with python3 -m pantry, and how amounts round.")
    s.say("Told Wren what is wrong: a real example instead of the joke.")
    s.write("README.md", USAGE, wren_seat)
    s.journal("todo", "done", "1", "--how", "The Usage section shows the pancakes example", seat=wren_seat)
    s.journal("helper", "report", "Rewrote the Usage section: scaling pancakes from 2 to 5 guests, and a line on how amounts round. No more dog.", seat=wren_seat)
    s.ended(wren_seat)
    s.journal("helper", "finish", str(fork.rows["wren"]))
    s.journal("todo", "done", str(fork.rows["readme"]), "--how", "Wren rewrote the usage with a real example")
    s.stop()
    together(s, fork, "Wren's README went off track and Wren rewrote it with a real example")


def together(s: Session, fork: Fork, readme: str) -> None:
    quill_seat = s.helper_seat("Quill Testwick", "codex", worktree=True)
    s.shell("git add -A && git commit -qm 'Cover every unit conversion with tests'", quill_seat)
    s.journal("todo", "done", "1", "--how", "tests/test_units.py covers flour, sugar and butter", seat=quill_seat)
    s.journal("helper", "report", "tests/test_units.py covers flour, sugar and butter in grams; butter is 227 g a cup. One commit in my worktree.", seat=quill_seat)
    s.ended(quill_seat)
    s.wait(2)
    bring = s.user("Bring the Codex work into main.")
    s.journal("worktree", "take", str(s.worktree(quill_seat)))
    s.shell("python3 -m pytest -q 2>&1 | tail -1")
    s.journal("helper", "finish", str(fork.rows["quill"]))
    s.journal("todo", "done", str(fork.rows["tests"]), "--how", "Quill's tests are in main and pass")
    s.reply(bring, "Quill's tests are in main and pass beside the rounding.")
    s.stop()
    looked = s.user("Did the helpers' work and yours fit together? Review it, then sum up.")
    report = s.made("report", "create", "Do the rounding and the tests agree", "--brief",
                    "They agree for cups and eggs. One gap: grams are not rounded, so 1.25 cups of butter gives 283.75 g.")
    s.journal("report", "section", str(report), "What fits", "Eggs come out whole and cups round to quarters; the unit tests cover every conversion.")
    s.journal("report", "section", str(report), "One finding", "grams() returns unrounded values such as 283.75 g; a kitchen scale reads whole grams.")
    s.journal("suggestion", "suggest", "Round grams to whole numbers", "--brief", "grams() returns 283.75 for 1.25 cups of butter; a scale reads whole grams.")
    s.reply(looked, f"They fit, with one gap: grams aren't rounded (report {report}), and I've suggested the fix. "
                    f"Quill (Codex) wrote the unit tests in its worktree and they're in main; {readme}. I rounded the amounts and reviewed the rest.")
    s.stop()


BRANCHES = {"Stop Wren, send a fresh helper": fresh, "Let Wren fix it": fixed}
