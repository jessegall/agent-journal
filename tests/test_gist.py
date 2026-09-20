import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from features.statusline.gist import gist, gist_tokens, gists  # noqa: E402
from features.statusline.spoken import spoken  # noqa: E402
from tests.kit import check, done  # noqa: E402

MESSAGE = [{"name": "message", "title": "Message", "names": {}}]
TODO = [{"name": "todo", "title": "To-do", "names": {"create": "add"}}]
WORK = [{"name": "work", "title": "Work", "names": {}}]

# WHAT A SHELL COMMAND IS DOING, said in a few words
check("patch bodies are not command gists", gists("*** Begin Patch\n*** Update File: x\n+check('leak')\n*** End Patch"), [])
check("real chained shell commands still split", gists("git commit -m done && rg needle src"), ["git commit done", "rg needle"])
check("shell loops keep the inner executable",
      gists("""for f in tests/test_*.py tests/features/*/test_*.py; do echo "$f"; perl -e 'alarm 60; exec @ARGV' python3 "$f" || exit 1; done"""),
      ["python3 script"])
check("a subcommand shares the executable's emphasis", [t["kind"] for t in gist_tokens("git commit file.txt")], ["command", "command", "argument"])
check("a path ending in a slash still names its last part", gists("ls ~/projects/ 2>/dev/null | head"), ["ls projects"])
check("a leading cd is dropped and the command after it kept; a lone cd shows nothing",
      [gists("cd web && npm run build"), gists("cd web; npm test"), gists("cd /x")], [["npm run build"], ["npm test"], []])
check("env, timeout, sudo and variable assignments are unwrapped to the command they run",
      [g for c in ("env -u AGENT_JOURNAL_ACTIVE python3 tests/test_install.py", "timeout 60 npm test",
                   "sudo -u www php artisan migrate", "FOO=1 BAR=2 node build.js") for g in gists(c)],
      ["python3 test_install.py", "npm test", "php artisan", "node build.js"])
check("an escaped quote inside a pattern never splits the piece, and the filters after it are not steps of their own",
      gists(r'grep -n "class=\"head\|\.title" a.vue | head -3; cat b.vue'), ["grep a.vue"])
check("a captured command is gisted as the command inside it",
      gists("n=$(journal comment unread 2>&1 | awk '/^ *[0-9]+ /{print $1}' | tail -1); journal comment read $n 2>&1", lambda w: " ".join(w[:2])),
      ["comment unread", "comment read"])
check("the inbox-reading compound command keeps each journal step",
      gists("""cd /Users/x/projects/workflows; N=$(journal message unread | awk '{print $1}' | head -1); echo "msg $N"; journal message read $N | sed -n '/^---$/,$p' | grep -v '^---$' | tail -n +14 | head -20; journal message files $N 2>/dev/null | head"""),
      ["journal message unread", "journal message read", "journal message files"])
check("several steps are joined while they fit", gist("git add -A && git commit -m x && git push"), "git add · git commit x · git push")

# A JOURNAL COMMAND IS SAID IN ITS OWN WORDS
check("the journal run through Python by its full path reads as the journal command, flags and their values left out",
      [gists("/opt/homebrew/Cellar/python@3.14/3.14.7/Frameworks/Python.framework/Versions/3.14/Resources/Python.app/Contents/MacOS/Python /u/.journal/src/journal.py --root /u/.journal todo add x", lambda w: spoken(w, TODO)),
       gists("journal --env main message read 7", lambda w: spoken(w, MESSAGE))],
      [["adding a to-do"], ["reading message 7"]])
check("a shell variable is never shown as if it were a number",
      [spoken(["message", "read", "$n"], MESSAGE), spoken(["work", "log", "$W"], WORK)], ["reading the message", "logging the work"])
check("an unknown word ending in s is a thing of the row, not a verb to conjugate",
      (spoken(["message", "paths", "104"], MESSAGE), spoken(["message", "tag", "105", "x.png", "words"], MESSAGE)),
      ("the paths of message 104", "tagging message 105"))
check("a type's own word for a method is understood", spoken(["todo", "add", "5"], TODO), "adding a to-do")
check("a query of the journal is said plainly", [spoken(["open"], MESSAGE), spoken(["status"], MESSAGE)], ["the open work", "where things stand"])

done()
