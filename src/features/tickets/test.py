from engine.record import Record
from features.boards.controller import Boards
from features.tickets.controller import Tickets
from resources.base import AGENT, USER
from tests.conftest import fresh


def test_a_ticket_belongs_to_the_project_and_one_source_event_stays_one_ticket():
    record = fresh()
    Boards(record, actor=USER).create("Bugs", stages=["New", "Doing", "Done"])
    made = Tickets(record, actor=USER).create("Checkout fails on empty cart", brief="the pay button errors", board=1)
    elsewhere = Tickets(Record(record.root, "other"), actor=AGENT)
    assert (elsewhere.load(made.n).title, made.source, made.board, made.stage) == ("Checkout fails on empty cart", USER, 1, "New"), \
        "a ticket is the whole project's, and says who made it"
    first = elsewhere.create("TypeError in checkout", brief="first seen", source="sentry", source_id="evt-1")
    again = elsewhere.create("TypeError in checkout", brief="seen 40 times", source="sentry", source_id="evt-1")
    other = elsewhere.create("TypeError in checkout", source="sentry", source_id="evt-2")
    assert (again.n, again.brief, other.n != first.n) == (first.n, "seen 40 times", True), \
        "the same event from the same source updates its ticket; another event makes another"


def test_a_board_holds_its_tickets_in_its_own_stages_and_marks_what_they_mean():
    from resources.base import Refused
    from tests.conftest import refused
    record = fresh()
    boards, tickets = Boards(record, actor=USER), Tickets(record, actor=USER)
    board = boards.create("Features", stages=["Ideas", "Building"])
    boards.stage(board.n, "Shipped", "done")
    boards.meaning(board.n, "Building", "start")
    assert (boards.load(board.n).stages, boards.load(board.n).meanings) == (["Ideas", "Building", "Shipped"], {"Shipped": "done", "Building": "start"}), \
        "stages are free, and a stage is marked with what it means"
    assert "not" in refused(lambda: boards.meaning(board.n, "Ideas", "someday")), "a stage means start, review or done, nothing else"
    ticket = tickets.create("Dark mode", board=board.n)
    assert (ticket.stage, tickets.move(ticket.n, "Shipped").stage) == ("Ideas", "Shipped"), "a ticket starts in its board's first stage and moves between them"
    assert "has no stage" in refused(lambda: tickets.move(ticket.n, "Nowhere")), "a stage the board does not have is refused"
    lanes = tickets.board(board.n)["lanes"]
    assert [(lane["title"], [(card["n"], card["type"], card["targets"]) for card in lane["cards"]]) for lane in lanes] == \
        [("Ideas", []), ("Building", []), ("Shipped", [(ticket.n, "ticket", ["Ideas", "Building"])])], "the board shows its stages as lanes, each ticket movable to the others"
    assert tickets.create("Search", board=board.n, stage="Building").stage == "Building", "a ticket can start in a stage it names"


def test_a_ticket_is_bound_to_one_environment_its_worktree_and_session_share():
    from controllers.types import Environments
    from engine.sessions import Sessions
    record = fresh()
    tickets = Tickets(record, actor=USER)
    ticket = tickets.create("Dark mode")
    bound = tickets.bind(ticket.n)
    assert (bound.work_environment, Environments(record)._titled(bound.work_environment) is not None, tickets.bind(ticket.n).work_environment) == \
        (f"ticket-{ticket.n}", True, f"ticket-{ticket.n}"), "binding makes the ticket's environment once, named for the ticket, which its worktree takes too"
    assert tickets.agent_session(ticket.n) == "", "no session holds it until its agent starts"
    Sessions(record.root).write("claude-old", environment=bound.work_environment, provider="claude", pid=999999)
    assert Sessions(record.root).choose("claude-new", "claude", "main") == "main", "a plain session never lands in a ticket's environment"
    Sessions(record.root).bind("claude-7", bound.work_environment, provider="claude")
    assert tickets.agent_session(ticket.n) == "claude-7", "the session is whichever one holds the ticket's environment"
    tickets.complete(ticket.n, how="still running", yes=True)
    assert Environments(record)._titled(bound.work_environment) is not None, "an environment whose agent still runs is kept when its ticket closes"
    other = tickets.bind(tickets.create("Search").n)
    tickets.complete(other.n, how="shipped", yes=True)
    assert Environments(record)._titled(other.work_environment) is None, "a closed ticket's idle environment goes to the attic"


def test_an_agent_runs_under_a_supervisor_with_no_terminal(tmp_path):
    import json
    import os
    import signal
    import subprocess
    import sys
    import time
    from pathlib import Path
    root = tmp_path / ".journal"
    root.mkdir()
    spec = {"root": str(root), "cwd": str(tmp_path), "env": "ticket-1", "agent": "claude", "worker": ["sleep", "20"], "heal": ["true"],
            "ended": ["true"], "args": [], "headless": True,
            "command": [sys.executable, "-c", "import time; print('agent up', flush=True); time.sleep(20)"], "environ": dict(os.environ)}
    supervisor = Path(__file__).resolve().parents[2] / "supervisor.py"
    child = subprocess.Popen([sys.executable, str(supervisor), json.dumps(spec)], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                             stderr=subprocess.DEVNULL, start_new_session=True)
    try:
        printed = lambda: b"".join(p.read_bytes() for p in (root / "runtime" / "sessions").glob("*/printed"))
        deadline = time.time() + 10
        while b"agent up" not in printed() and time.time() < deadline:
            time.sleep(0.1)
        time.sleep(1)
        assert (b"agent up" in printed(), child.poll()) == (True, None), \
            "the agent starts, its output is captured, and with no keyboard it keeps running"
    finally:
        for launched in (root / "runtime" / "sessions").glob("*/launched.json"):
            os.kill(json.loads(launched.read_text())["pid"], signal.SIGKILL)
        os.killpg(child.pid, signal.SIGKILL)
        child.wait(timeout=5)


def test_moving_a_ticket_to_its_start_stage_launches_its_agent_once_in_its_worktree(monkeypatch):
    import engine.terminal
    from engine.sessions import Sessions
    launched = []
    monkeypatch.setattr(engine.terminal, "detached", lambda root, cwd, env, agent, args: launched.append((env, agent, args)) or 1)
    record = fresh()
    board = Boards(record, actor=USER).create("Features", stages=["Ideas", "Building"], meanings={"Building": "start"})
    tickets = Tickets(record, actor=USER)
    ticket = tickets.create("Dark mode", board=board.n)
    tickets.move(ticket.n, "Building")
    from engine.record import Record
    from features.permission_prompts.feature import skipped
    env, agent, args = launched[0]
    assert (env, agent, args[:4], skipped(Record(record.root, f"ticket-{ticket.n}"))) == \
        (f"ticket-{ticket.n}", "claude", ["--permission-mode", "auto", "--worktree", f"ticket-{ticket.n}"], False), \
        "the start stage launches the ticket's agent in its own worktree, in a named permission mode, never skipping prompts"
    assert "Draft a plan" in args[-1] and ticket.ref in args[-1], "a fresh start opens with the ticket and how to plan it"
    Sessions(record.root).bind("claude-9", f"ticket-{ticket.n}", provider="claude")
    tickets.start(ticket.n)
    assert len(launched) == 1, "a ticket whose agent runs is not started twice"
    from tests.kit import report
    report(Record(record.root, f"ticket-{ticket.n}"), "working", "PreToolUse", session="claude-9")
    card = next(card for lane in tickets.board(board.n)["lanes"] for card in lane["cards"] if card["n"] == ticket.n)
    assert card["reason"] == f"working in ticket-{ticket.n}", "the card says what its agent is doing and where"
    record.set_setting("tickets", {"running": 1})
    second = tickets.create("Search", board=board.n)
    assert (tickets.move(second.n, "Building").queued, len(launched)) == (True, 1), "past the limit a ticket waits queued instead of launching"
    Sessions(record.root).unbind("claude-9")
    tickets.start_queued()
    assert (tickets.load(second.n).queued, launched[-1][0]) == (False, f"ticket-{second.n}"), "when a slot frees, the queued ticket starts"


def test_a_started_ticket_closes_when_its_branch_is_merged_and_not_before():
    import subprocess
    from tests.conftest import refused
    record = fresh()
    project = record.root.parent

    def git(*args):
        return subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=project, check=True, capture_output=True, text=True, timeout=30)

    git("init", "-q")
    git("commit", "-q", "--allow-empty", "-m", "start")
    board = Boards(record, actor=USER).create("Features", stages=["Doing", "Shipped"], meanings={"Shipped": "done"})
    tickets = Tickets(record, actor=USER)
    ticket = tickets.bind(tickets.create("Dark mode", board=board.n).n)
    home = git("branch", "--show-current").stdout.strip()
    git("switch", "-q", "-c", f"worktree-{ticket.work_environment}")
    git("commit", "-q", "--allow-empty", "-m", "dark mode")
    git("switch", "-q", home)
    import features
    from controllers.types import Docs
    from engine.record import Record
    features.load()
    written = Docs(Record(record.root, ticket.work_environment), actor=USER).create("How dark mode works")
    assert (bool(Docs(record).load(written.n).completed), Docs(record).load(written.n).data.get("proposed_for")) == (True, ticket.ref), \
        "a doc written from the ticket's environment waits as a proposal for that ticket"
    assert "is not merged" in refused(lambda: tickets.complete(ticket.n)), "a started ticket is not closed while its branch is unmerged"
    assert tickets.close_merged() == [], "nothing unmerged is closed"
    tickets.keep_branches()
    assert git("rev-parse", f"refs/journal/worktrees/{ticket.work_environment}").stdout == git("rev-parse", f"worktree-{ticket.work_environment}").stdout, \
        "the backup ref follows the ticket's branch to its latest commit"
    git("merge", "-q", "--no-edit", f"worktree-{ticket.work_environment}")
    tickets.close_merged()
    closed = tickets.load(ticket.n)
    assert (bool(closed.completed), closed.stage) == (True, "Shipped"), "once merged it closes by itself, in its board's done stage"
    assert Docs(record).load(written.n).completed == 0.0, "and what it proposed counts from the merge on"


def test_a_drafted_ticket_waits_for_the_user_to_confirm_it_before_it_can_start():
    from resources.base import AGENT
    from tests.conftest import refused
    record = fresh()
    board = Boards(record, actor=USER).create("Features", stages=["Ideas", "Building"], meanings={"Building": "start"})
    drafted = Tickets(record, actor=AGENT).create("Dark mode", board=board.n, draft=True)
    assert ("is a draft" in refused(lambda: Tickets(record, actor=USER).move(drafted.n, "Building")), Tickets(record).load(drafted.n).stage) == \
        (True, "Ideas"), "a draft cannot start, and stays where it was"
    assert "only the user confirms" in refused(lambda: Tickets(record, actor=AGENT).confirm(drafted.n)), "the agent cannot confirm its own draft"
    assert Tickets(record, actor=USER).confirm(drafted.n).draft is False, "the user confirms it"
