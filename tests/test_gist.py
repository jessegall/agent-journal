import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tests.kit import check, done

root = Path(__file__).resolve().parents[1]
script = '''
import {gists, gistTokens} from "./web/src/gist.js";
import {spoken} from "./web/src/spoken.js";
console.log(JSON.stringify({
    patch: gists("*** Begin Patch\\n*** Update File: x\\n+check('leak')\\n*** End Patch"),
    shell: gists("git commit -m done && rg needle src"),
    loop: gists(`for f in tests/test_*.py tests/features/*/test_*.py; do echo "$f"; perl -e 'alarm 60; exec @ARGV' python3 "$f" || exit 1; done`),
    tokens: gistTokens("git commit file.txt").map((token) => token.kind),
    slash: gists("ls ~/projects/ 2>/dev/null | head"),
    inbox: gists(`cd /Users/x/projects/workflows; N=$(journal message unread | awk '{print $1}' | head -1); echo "msg $N"; journal message read $N | sed -n '/^---$/,$p' | grep -v '^---$' | tail -n +14 | head -20; journal message files $N 2>/dev/null | head`),
    leadingCd: [gists("cd web && npm run build"), gists("cd web; npm test"), gists("cd /x")],
    escaped: gists('grep -n "class=\\\\"head\\\\|\\\\.title\\\\|abstract" a.vue | head -3; cat b.vue'),
    wrapped: [gists("env -u AGENT_JOURNAL_ACTIVE python3 tests/test_install.py"), gists("timeout 60 npm test"), gists("sudo -u www php artisan migrate"), gists("FOO=1 BAR=2 node build.js")].flat(),
    captured: gists("n=$(journal comment unread 2>&1 | awk '/^ *[0-9]+ /{print $1}' | tail -1); journal comment read $n 2>&1", (w) => w.slice(0, 2).join(" ")),
    paths: spoken(["message", "paths", "104"], [{name: "message", title: "Message", names: {}}]),
    viaPython: [gists("/opt/homebrew/Cellar/python@3.14/3.14.7/Frameworks/Python.framework/Versions/3.14/Resources/Python.app/Contents/MacOS/Python /u/.journal/src/journal.py --root /u/.journal todo add x", (w) => spoken(w, [{name: "todo", title: "To-do", names: {create: "add"}}])), gists("journal --env main message read 7", (w) => spoken(w, [{name: "message", title: "Message", names: {}}]))],
    variable: [spoken(["message", "read", "$n"], [{name: "message", title: "Message", names: {}}]), spoken(["work", "log", "$W"], [{name: "work", title: "Work", names: {}}])],
    tag: spoken(["message", "tag", "105", "x.png", "words"], [{name: "message", title: "Message", names: {}}]),
}));
'''
result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=root, text=True, capture_output=True, check=True)
got = json.loads(result.stdout)
check("patch bodies are not command gists", got["patch"], [])
check("the journal run through Python by its full path reads as the journal command, flags and their values left out", got["viaPython"], [["adding a to-do"], ["reading message 7"]])
check("a shell variable is never shown as if it were a number", got["variable"], ["reading the message", "logging the work"])
check("the inbox-reading compound command keeps each journal step", got["inbox"], ["journal message unread", "journal message read", "journal message files"])
check("a leading cd is dropped and the command after it kept; a lone cd shows nothing", got["leadingCd"], [["npm run build"], ["npm test"], []])
check("real chained shell commands still split", got["shell"], ["git commit done", "rg needle"])
check("shell loops keep the inner executable", got["loop"], ["python3 script"])
check("a subcommand shares the executable's emphasis", got["tokens"], ["command", "command", "argument"])
check("a path ending in a slash still names its last part", got["slash"], ["ls projects"])
check("an escaped quote or pipe inside a pattern never splits the piece", got["escaped"], ["grep a.vue"])
check("env, timeout, sudo and variable assignments are unwrapped to the command they run", got["wrapped"], ["python3 test_install.py", "npm test", "php artisan", "node build.js"])
check("a captured command is gisted as the command inside it", got["captured"], ["comment unread", "comment read"])
check("an unknown word ending in s is a thing of the row, not a verb to conjugate", (got["paths"], got["tag"]), ("the paths of message 104", "tagging message 105"))
done()
