import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Nudges, Pins, Rules  # noqa: E402
from engine.hooks import handle, whispered  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import USER  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

features.unload()
features.load()

claude = PROVIDERS["claude"]()
record = fresh()


def use(tool, given, session="claude-1"):
    return handle(claude, record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": session, "tool_name": tool, "tool_input": given})


def said(session="claude-1"):
    return whispered(record, session)


rule = Rules(record, actor=USER).create("Never change the git branch", brief="A branch change belongs to the user", keywords=["git checkout", "git switch"])
pin = Pins(record, actor=USER).create("The viewer is built from web/", brief="web/dist is what the server serves", keywords=["npm run build"])

# A COMMAND THAT TOUCHES A RULE is whispered the rule, and the command still runs
check("a command with none of the words says nothing", (use("Bash", {"command": "ls -la"}), said()), ({}, ""))
check("a command carrying a rule's word is not refused", use("Bash", {"command": "git checkout -b spike"}).get("hookSpecificOutput", {}).get("permissionDecision"), None)
check("and the rule is whispered, naming it and its reasoning", said(), f"rule {rule.n} — Never change the git branch — A branch change belongs to the user")

# ONCE PER SESSION, so a common word does not nag
use("Bash", {"command": "git checkout main"})
check("the same rule is not said twice to the same session", said(), "")
use("Bash", {"command": "git checkout main"}, session="claude-2")
check("another session hears it once of its own", said("claude-2").startswith(f"rule {rule.n} —"), True)

# WHAT IS WRITTEN counts too, not only the command
use("Write", {"file_path": "notes.md", "content": "then npm run build"})
check("a pin whose word is in what is being written is whispered", said().startswith(f"pin {pin.n} —"), True)

# WITH NO KEYWORDS nothing is whispered, however the row reads
Rules(record, actor=USER).create("Write clean code")
use("Bash", {"command": "write clean code"})
check("a row with no keywords is never whispered", said(), "")

# THE ROW SAYS WHAT ITS KEYWORDS ARE, so the viewer can show them, and set reads a list
check("keywords are a field of the type, not loose data", "keywords" in type(rule).fields, True)
Rules(record, actor=USER).set(rule.n, "keywords", '["git checkout", "git rebase"]')
check("set reads a list the same way --set does", Rules(record).load(rule.n).data["keywords"], ["git checkout", "git rebase"])
Rules(record, actor=USER).set(rule.n, "keywords", "git checkout, git rebase")
check("plain words are read as the list they plainly are", Rules(record).load(rule.n).data["keywords"], ["git checkout", "git rebase"])
Rules(record, actor=USER).set(rule.n, "keywords", "git checkout")
check("one word is a list of one", Rules(record).load(rule.n).data["keywords"], ["git checkout"])
check("something that is no kind of list is refused", "keywords is a list" in refused(lambda: Rules(record, actor=USER).set(rule.n, "keywords", "7")), True)

done()
