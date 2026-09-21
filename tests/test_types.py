import subprocess
import sys
from pathlib import Path

from commands.cli import actions, parser
from controllers.base import Controller
from controllers.types import CONTROLLERS
from engine.record import Record
from resources.base import AGENT, USER, check_abstract, check_title
from resources.types import PRIORITY, TYPES

HERE = Path(__file__).resolve().parents[1]


def test_every_type_describes_itself_under_the_same_rules():
    for type_, cls in TYPES.items():
        assert (check_title(cls.title_) == cls.title_) is True, f"{type_}: has a title within the title rule"
        assert (bool(cls.abstract_), check_abstract(cls.abstract_) == cls.abstract_) == (True, True), \
            f"{type_}: has an abstract within the abstract rule"
        assert bool(cls.help_) is True, f"{type_}: has a help line"
        assert PRIORITY.count(type_) == 1, f"{type_}: is in the drain priority exactly once"
        assert (CONTROLLERS[type_].resource is cls) is True, f"{type_}: has a controller that names it"


def test_seen_the_creator_has_seen_it_the_other_side_has_not_until_it_looks(tmp_path):
    record = Record(tmp_path / ".journal", "main")
    for type_ in TYPES:
        by_user = CONTROLLERS[type_](record, actor=USER)
        by_agent = CONTROLLERS[type_](record, actor=AGENT)
        r = by_user.create(f"one {type_}")
        assert (r.seen, [x.n for x in by_agent.unread()]) == ([USER], [1]), \
            f"{type_}: the user who created it has seen it, the agent has not"
        by_agent.show(1)
        assert (sorted(by_agent.show(1).seen), by_agent.unread()) == ([AGENT, USER], []), \
            f"{type_}: the agent's show marks it seen for the agent"
        w = by_agent.create(f"another {type_}")
        assert (w.seen, [x.n for x in by_user.unread()]) == ([AGENT], [2]), \
            f"{type_}: the agent who created it has seen it, the user has not"


def test_the_generator_makes_one_command_per_type_per_action_all_the_same_shape():
    top = parser()
    base_actions = actions(Controller)
    assert base_actions == \
        ["all", "attach", "comment", "comments", "complete", "create", "delete", "detach", "files", "find", "folder", "force_delete",
         "index", "link", "linked_to", "move", "paths", "react", "read", "read_all", "reopen", "restore", "search", "section", "set",
         "show", "stamp", "tag", "unlink", "unread", "update"], "the base controller's actions are the CRUD set"
    subs = top._subparsers._group_actions[0].choices
    assert sorted(t for t in subs if t in TYPES) == sorted(TYPES), "every type is a command, beside the queries"
    assert sorted(t for t in subs if t not in TYPES) == \
        ["carry", "claude", "codex", "conversation", "disable", "enable", "help", "nothing", "open", "search", "serve", "services",
         "settings", "speed", "start", "status", "stop", "tidy", "upgrade", "user", "verify", "version"], "the queries stand beside them"
    for type_ in TYPES:
        acts = subs[type_]._subparsers._group_actions[0].choices
        names = TYPES[type_].names
        assert all((names.get(a, a) in acts) and (a in acts or a in names) for a in base_actions) is True, \
            f"{type_}: every base action is a subcommand, under the type's own name where it has one"
        assert subs[type_].description == TYPES[type_].help_, f"{type_}: its help is the type's own abstract"


def test_each_generated_command_runs_end_to_end_through_the_shell(tmp_path):
    root = tmp_path / ".journal"

    def record_events_of(root, type_):
        return [e.action for e in Record(root, "main").events() if e.type == type_]

    def cli(*argv):
        p = subprocess.run([sys.executable, "-m", "commands.cli", "--root", str(root), *argv], cwd=HERE,
                           capture_output=True, text=True, timeout=60)
        return p.returncode, (p.stdout + p.stderr).strip()

    for type_ in TYPES:
        create = TYPES[type_].names.get("create", "create")
        code, out = cli(type_, create, f"a {type_} from the shell", "--abstract", "short")
        assert (code, f'"title": "a {type_} from the shell"' in out) == (0, True), \
            f"{type_}: create from the shell, by the type's own name ({create})"
        code, out = cli(type_, create, "a: colon")
        assert (code, "colon" in out) == (1, True), f"{type_}: the title rule holds from the shell"
        finish = TYPES[type_].names.get("complete", "complete")
        n = "2" if type_ == "environment" else "1"
        code, out = cli(type_, finish, n, "--how", "finished")
        assert (code, record_events_of(root, type_)[-1]) == (0, "deleted" if type_ == "environment" else "completed"), \
            f"{type_}: completing it by the type's own name ({finish}) emits its terminal event"
        code, out = cli(type_, finish, n)
        assert code == 1, f"{type_}: completing twice is refused"
        code, out = cli(type_, "all")
        assert out.split("\n")[-1].strip().split("  ", 1)[-1] == \
            ("main" if type_ == "environment" else f"a {type_} from the shell" + ("  [done]" if type_ == "todo" else "")), \
            f"{type_}: all from the shell"
