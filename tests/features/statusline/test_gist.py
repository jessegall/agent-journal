import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from features.statusline.feature import base  # noqa: E402
from features.statusline.gist import parsed  # noqa: E402
from features.statusline.spoken import spoken  # noqa: E402
from tests.kit import check, done  # noqa: E402

def said(command, translate=None):
    return [one["root"] if one["own"] or not one["args"] else f"{one['root']} {base(one['args'][0].rstrip('/'))}" for one in parsed(command, translate)]


MESSAGE = [{"name": "message", "title": "Message", "names": {}}]
TODO = [{"name": "todo", "title": "To-do", "names": {"create": "add"}}]
WORK = [{"name": "work", "title": "Work", "names": {}}]

# WHAT A SHELL COMMAND IS, taken apart into its root and what it was given
check("patch bodies are not commands", said("*** Begin Patch\n*** Update File: x\n+check('leak')\n*** End Patch"), [])
check("chained shell commands split into one piece each", said("git commit -m done && rg needle src"), ["git commit done", "rg needle"])
check("shell loops keep the inner executable",
      said("""for f in tests/test_*.py tests/features/*/test_*.py; do echo "$f"; perl -e 'alarm 60; exec @ARGV' python3 "$f" || exit 1; done"""),
      ["python3"])
check("a path ending in a slash still names its last part", said("ls ~/projects/ 2>/dev/null | head"), ["ls projects"])
check("a leading cd is dropped and the command after it kept; a lone cd shows nothing",
      [said("cd web && npm run build"), said("cd web; npm test"), said("cd /x")], [["npm run build"], ["npm test"], []])
check("env, timeout, sudo and variable assignments are unwrapped to the command they run",
      [g for c in ("env -u AGENT_JOURNAL_ACTIVE python3 tests/test_install.py", "timeout 60 npm test",
                   "sudo -u www php artisan migrate", "FOO=1 BAR=2 node build.js") for g in said(c)],
      ["python3 test_install.py", "npm test", "php artisan", "node build.js"])
check("an escaped quote inside a pattern never splits the piece, and the filters after it are not steps of their own",
      said(r'grep -n "class=\"head\|\.title" a.vue | head -3; cat b.vue'), ["grep a.vue"])
check("a captured command is read as the command inside it",
      said("n=$(journal comment unread 2>&1 | awk '/^ *[0-9]+ /{print $1}' | tail -1); journal comment read $n 2>&1", lambda w: " ".join(w[:2])),
      ["comment unread", "comment read"])
check("the inbox-reading compound command keeps each journal step",
      said("""cd /Users/x/projects/workflows; N=$(journal message unread | awk '{print $1}' | head -1); echo "msg $N"; journal message read $N | sed -n '/^---$/,$p' | grep -v '^---$' | tail -n +14 | head -20; journal message files $N 2>/dev/null | head"""),
      ["journal message unread", "journal message read", "journal message files"])

# A JOURNAL COMMAND IS SAID IN ITS OWN WORDS
check("the journal run through Python by its full path reads as the journal command, flags and their values left out",
      [said("/opt/homebrew/Cellar/python@3.14/3.14.7/Frameworks/Python.framework/Versions/3.14/Resources/Python.app/Contents/MacOS/Python /u/.journal/src/journal.py --root /u/.journal todo add x", lambda w: spoken(w, TODO)),
       said("journal --env main message read 7", lambda w: spoken(w, MESSAGE))],
      [["adding todo"], ["reading message 7"]])
check("a shell variable is never shown as if it were a number",
      [spoken(["message", "read", "$n"], MESSAGE), spoken(["work", "log", "$W"], WORK)], ["reading message", "logging work"])
check("an unknown word ending in s is a thing of the row, not a verb to conjugate",
      (spoken(["message", "paths", "104"], MESSAGE), spoken(["message", "tag", "105", "x.png", "words"], MESSAGE)),
      ("reading message 104", "tagging message 105"))
check("a type's own word for a method is understood", spoken(["todo", "add", "5"], TODO), "adding todo 5")
check("every journal command is an action, a resource and an id, and a query has no id",
      [spoken(["open"], MESSAGE), spoken(["status"], MESSAGE), spoken(["message", "reply", "625"], MESSAGE)],
      ["checking open work", "checking status", "replying message 625"])

done()
