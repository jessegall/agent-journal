import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE))
from commands.cli import actions, parser  # noqa: E402
from controllers.base import Controller  # noqa: E402
from controllers.types import CONTROLLERS  # noqa: E402
from engine.record import Record  # noqa: E402
from resources.base import ABSTRACT_MAX, AGENT, TITLE_MAX, USER, check_abstract, check_title  # noqa: E402
from resources.types import PRIORITY, TYPES  # noqa: E402
from tests.kit import check, done  # noqa: E402



for type_, cls in TYPES.items():                          # every type describes itself under the same rules
    check(f"{type_}: has a title within the title rule", check_title(cls.title_) == cls.title_, True)
    check(f"{type_}: has an abstract within the abstract rule", (bool(cls.abstract_), check_abstract(cls.abstract_) == cls.abstract_), (True, True))
    check(f"{type_}: has a help line", bool(cls.help_), True)
    check(f"{type_}: is in the drain priority exactly once", PRIORITY.count(type_), 1)
    check(f"{type_}: has a controller that names it", CONTROLLERS[type_].resource is cls, True)

record = Record(Path(tempfile.mkdtemp()) / ".journal", "main")
for type_ in TYPES:                                       # seen: the creator has seen it, the other side has not, until it looks
    by_user = CONTROLLERS[type_](record, actor=USER)
    by_agent = CONTROLLERS[type_](record, actor=AGENT)
    r = by_user.create(f"one {type_}")
    check(f"{type_}: the user who created it has seen it, the agent has not", (r.seen, [x.n for x in by_agent.unread()]), ([USER], [1]))
    by_agent.show(1)
    check(f"{type_}: the agent's show marks it seen for the agent", (sorted(by_agent.show(1).seen), by_agent.unread()), ([AGENT, USER], []))
    w = by_agent.create(f"another {type_}")
    check(f"{type_}: the agent who created it has seen it, the user has not", (w.seen, [x.n for x in by_user.unread()]), ([AGENT], [2]))

# THE GENERATOR: one command per type per action, all the same shape, none written by hand
top = parser()
base_actions = actions(Controller)
check("the base controller's actions are the CRUD set", base_actions,
      ["all", "attach", "comment", "comments", "complete", "create", "delete", "detach", "files", "find", "folder", "force_delete", "index", "link", "linked_to", "move", "paths", "react", "read", "restore", "search", "section", "set", "show", "unlink", "unread", "update"])
subs = top._subparsers._group_actions[0].choices
check("every type is a command, beside the queries", sorted(t for t in subs if t in TYPES), sorted(TYPES))
check("the queries stand beside them", sorted(t for t in subs if t not in TYPES), ["carry", "claude", "codex", "conversation", "nothing", "open", "search", "serve", "start", "status", "upgrade", "user", "version"])
for type_ in TYPES:
    acts = subs[type_]._subparsers._group_actions[0].choices
    names = TYPES[type_].names
    check(f"{type_}: every base action is a subcommand, under the type's own name where it has one",
          all((names.get(a, a) in acts) and (a in acts or a in names) for a in base_actions), True)
    check(f"{type_}: its help is the type's own abstract", subs[type_].description, TYPES[type_].help_)

root = Path(tempfile.mkdtemp()) / ".journal"


def record_events_of(root, type_):
    return [e.action for e in Record(root, "main").events() if e.type == type_]


def cli(*argv):
    p = subprocess.run([sys.executable, "-m", "commands.cli", "--root", str(root), *argv], cwd=HERE,
                       capture_output=True, text=True, timeout=60)
    return p.returncode, (p.stdout + p.stderr).strip()


for type_ in TYPES:                                       # and each generated command runs end to end
    create = TYPES[type_].names.get("create", "create")
    code, out = cli(type_, create, f"a {type_} from the shell", "--abstract", "short")
    check(f"{type_}: create from the shell, by the type's own name ({create})", (code, f'"title": "a {type_} from the shell"' in out), (0, True))
    code, out = cli(type_, create, "a: colon")
    check(f"{type_}: the title rule holds from the shell", (code, "colon" in out), (1, True))
    finish = TYPES[type_].names.get("complete", "complete")
    code, out = cli(type_, finish, "1", "--how", "finished")
    check(f"{type_}: completing it by the type's own name ({finish}) emits completed", (code, record_events_of(root, type_)[-1]), (0, "completed"))
    code, out = cli(type_, finish, "1")
    check(f"{type_}: completing twice is refused", code, 1)
    code, out = cli(type_, "all")
    check(f"{type_}: all from the shell", out.split("\n")[-1].strip().split("  ", 1)[-1], f"a {type_} from the shell")

done()
