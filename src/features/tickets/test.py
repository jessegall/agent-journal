from engine.record import Record
from features.boards.controller import Boards
from features.tickets.controller import Tickets
from resources.base import AGENT, SYSTEM, USER, Refused
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
    plain = boards.create("Bugs")
    assert (plain.stages, plain.meanings) == (["To do", "Doing", "Review", "Done"], {"Done": "done"}), "a board made without stages starts with four, Done marked"
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
    from features.dev_faults.feature import Faults
    assert Faults.on_for(Record(record.root, bound.work_environment)) is False, "a ticket's agent is not told the journal's own developer faults"
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
            "command": [sys.executable, "-c", "import time, tty\ntty.setraw(0)\nprint('agent up', flush=True)\nfor n in range(200): print(f'tick {n}', flush=True); time.sleep(0.1)"],
            "environ": dict(os.environ)}
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
        from engine import typist
        session = next((root / "runtime" / "sessions").glob("*/printed")).parent.name
        assert typist.send(root, session, b"x" * 8192), "the typing reaches the supervisor"
        before = len(printed())
        time.sleep(1.5)
        assert len(printed()) > before, "typing an agent never reads never stops its output being captured"
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
    from controllers.types import Environments
    from engine.terminal import launching
    from features.parts import in_background
    assert in_background(Record(record.root, f"ticket-{ticket.n}")), "the ticket's environment belongs to its ticket, so its agent works in the background"
    monkeypatch.setenv("CLAUDE_CODE_CHILD_SESSION", "1")
    monkeypatch.setenv("CLAUDECODE", "1")
    environ = launching(record.root, record.root.parent, f"ticket-{ticket.n}", "claude", [])["environ"]
    assert not {"CLAUDE_CODE_CHILD_SESSION", "CLAUDECODE"} & set(environ), \
        "an agent launched from inside a Claude session does not inherit its markers, so its transcript is saved"
    Sessions(record.root).bind("claude-7", f"ticket-{ticket.n}", provider="claude")
    from controllers.types import Agents
    Agents(Record(record.root, f"ticket-{ticket.n}"), actor=USER).create("claude-7")
    Sessions(record.root).bind("claude-9", f"ticket-{ticket.n}", provider="claude")
    from engine import runtime
    from engine.seats import terminal_of
    printed = runtime.session_file(record.root, terminal_of(record.root, "claude-9"), "printed")
    printed.parent.mkdir(parents=True, exist_ok=True)
    printed.write_bytes("\x1b[2KReading the tree contract\r\n\x1b[1m❯ \x1b[0m\r\n".encode())
    assert "Reading the tree contract" in tickets.screen(ticket.n), "journal ticket screen shows what the ticket agent's terminal says"
    tickets.start(ticket.n)
    assert len(launched) == 1, "a ticket whose agent runs is not started twice"
    from tests.kit import report
    report(Record(record.root, f"ticket-{ticket.n}"), "working", "PreToolUse", session="claude-9")
    card = next(card for lane in tickets.board(board.n)["lanes"] for card in lane["cards"] if card["n"] == ticket.n)
    assert card["reason"].startswith(f"working in ticket-{ticket.n} · "), \
        "the card says what its agent is doing, where, and how long ago, read from the session that reports, not a silent terminal row"
    report(Record(record.root, f"ticket-{ticket.n}"), "idle", "Stop", session="claude-9",
           shell_rows=[{"command": "go test ./engine/...", "running": True}])
    card = next(card for lane in tickets.board(board.n)["lanes"] for card in lane["cards"] if card["n"] == ticket.n)
    assert card["reason"].startswith(f"waiting on its run: go test ./engine/... in ticket-{ticket.n} · "), \
        "an agent idle behind its own running command is waiting on it, never idle"
    record.set_setting("tickets", {"running": 1})
    second = tickets.create("Search", board=board.n)
    assert (tickets.move(second.n, "Building").queued, len(launched)) == (True, 1), "past the limit a ticket waits queued instead of launching"
    Sessions(record.root).unbind("claude-9")
    Sessions(record.root).unbind("claude-7")
    tickets.start_queued()
    assert (tickets.load(second.n).queued, launched[-1][0]) == (False, f"ticket-{second.n}"), "when a slot frees, the queued ticket starts"
    record.set_setting("tickets", {"running": 0})
    third = tickets.create("Share", board=board.n)
    assert (tickets.move(third.n, "Building").queued, launched[-1][0]) == (False, f"ticket-{third.n}"), \
        "with no limit, every started ticket gets its agent at once"
    import time
    record.set_setting("tickets", {"running": 5})
    assert tickets.load(ticket.n).agent_seen and not tickets.load(ticket.n).launched, "an agent that reported is remembered as seen"
    assert [(t.n, state.kind) for t, state in tickets._needing_a_look([board.n])] == [(ticket.n, "stopped")], \
        "a ticket whose agent was seen working and then died needs a look, long after its launch"
    tickets.update(ticket.n, launched=time.time() - 120)
    assert [(t.n, state.kind) for t, state in tickets._needing_a_look([board.n])] == [(ticket.n, "stopped")], \
        "a started ticket whose agent is gone needs a look; one launched a moment ago does not yet"
    assert tickets._revive(tickets.load(ticket.n)) and launched[-1][0] == f"ticket-{ticket.n}", "its agent is started again, once"
    tickets.update(ticket.n, launched=time.time() - 120)
    assert not tickets._revive(tickets.load(ticket.n)), "a second loss is told to the orchestrator instead of restarted"
    tickets.stop(ticket.n)
    assert tickets._needing_a_look([board.n]) == [], "a ticket stopped on purpose is left alone"


def test_a_started_ticket_closes_when_its_branch_is_merged_and_not_before(monkeypatch):
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
    ticket = tickets.update(ticket.n, base=git("rev-parse", "HEAD").stdout.strip())
    home = git("branch", "--show-current").stdout.strip()
    git("branch", f"worktree-{ticket.work_environment}")
    assert tickets.close_merged() == [], "a branch still at the commit its ticket started from is not merged: the ticket has done nothing yet"
    git("switch", "-q", f"worktree-{ticket.work_environment}")
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
    tickets.merge(ticket.n)
    closed = tickets.load(ticket.n)
    assert (bool(closed.completed), closed.stage) == (True, "Shipped"), "once merged it closes by itself, in its board's done stage"
    shipped = [card for lane in tickets.board(board.n)["lanes"] for card in lane["cards"] if card["n"] == ticket.n]
    assert [(card["n"], card["state"]) for card in shipped] == [(ticket.n, "done")], "and stays in that column, so the board shows what is done"
    assert Docs(record).load(written.n).completed == 0.0, "and what it proposed counts from the merge on"
    import engine.terminal
    monkeypatch.setattr(engine.terminal, "detached", lambda *args: 1)
    git("branch", "rewrite")
    git("switch", "-q", "rewrite")
    git("commit", "-q", "--allow-empty", "-m", "the contract")
    git("switch", "-q", home)
    rewrite = Boards(record, actor=USER).create("Rewrite", stages=["Doing", "Shipped"], meanings={"Doing": "start", "Shipped": "done"}, branch="rewrite")
    part = tickets.create("Tree contract", board=rewrite.n)
    tickets.move(part.n, "Doing")
    part = tickets.load(part.n)
    started = git("rev-parse", "rewrite").stdout.strip()
    assert (part.base, git("rev-parse", f"worktree-{part.work_environment}").stdout.strip()) == (started, started), \
        "a board on a branch of its own starts each ticket's branch from that branch's tip, not the checked-out one"
    git("switch", "-q", f"worktree-{part.work_environment}")
    git("commit", "-q", "--allow-empty", "-m", "the tree")
    git("switch", "-q", home)
    git("merge", "-q", "--no-edit", f"worktree-{part.work_environment}")
    tickets.close_merged()
    assert not tickets.load(part.n).completed, "merged into the checked-out branch instead, it stays open"
    later = tickets.create("Engine on the tree", board=rewrite.n)
    tickets.depend(later.n, part.n)
    tickets.move(later.n, "Doing")
    assert tickets.load(later.n).queued, "a ticket that waits on another queues"
    assert tickets.merge(part.n).completed and git("branch", "--show-current").stdout.strip() == home, \
        "journal ticket merge lands it on its board's branch without touching the checkout, and it closes"
    tickets.start_queued()
    later = tickets.load(later.n)
    assert later.base == git("rev-parse", "rewrite").stdout.strip() and not later.queued, \
        "a queued ticket starts from its board branch's tip at launch, after what it waited on landed"
    tickets.close_merged()
    assert not tickets.load(later.n).completed, "so it is not taken for merged the minute after it starts"
    elsewhere = Boards(record, actor=USER).create("Gone", stages=["Doing"], meanings={"Doing": "start"}, branch="missing")
    lost = tickets.create("Nowhere", board=elsewhere.n)
    assert "does not exist" in refused(lambda: tickets.start(lost.n)), "a board's branch that does not exist is named, not guessed"
    racing = tickets.bind(tickets.create("Racing", board=rewrite.n).n)
    git("branch", f"worktree-{racing.work_environment}", "rewrite")
    tickets.update(racing.n, base=git("rev-list", "--max-parents=0", "HEAD").stdout.split()[0])
    monkeypatch.setattr(tickets, "complete", lambda *args, **kwargs: (_ for _ in ()).throw(Refused("not merged after all")))
    tickets.close_merged()
    assert tickets.load(racing.n).stage != "Shipped", "a ticket whose close is refused stays where it was, never in Done while its agent works"
    monkeypatch.undo()
    git("commit", "-q", "--allow-empty", "-m", "only on the checked-out branch")
    stray = tickets.update(tickets.bind(tickets.create("Stray", board=rewrite.n).n).n, base=git("rev-parse", home).stdout.strip())
    assert ("not on rewrite" in tickets._off_branch(stray), tickets._off_branch(tickets.load(later.n))) == (True, ""), \
        "a ticket that started from a commit its board's branch lacks is flagged with the rebase it needs; one on the branch is not"
    assert Boards(record, actor=USER).start(board.n).branch == home, "a board with no branch keeps the branch checked out when it starts"
    many = fresh()
    for repo in ("site", "chronos"):
        (many.root.parent / repo).mkdir()
        for args in (["init", "-q"], ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"]):
            subprocess.run(["git", *args], cwd=many.root.parent / repo, check=True, capture_output=True, timeout=30)
    across = Tickets(many, actor=USER)
    spanning = across.bind(across.create("Across both", board=Boards(many, actor=USER).create("Both", stages=["Shipped"], meanings={"Shipped": "done"}).n).n)
    spanning = across._based(spanning, across._started_at(spanning, "HEAD"))
    branch = f"worktree-{spanning.work_environment}"
    site = lambda *args: subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=many.root.parent / "site", check=True, capture_output=True, text=True, timeout=30)
    for repo in ("site", "chronos"):
        subprocess.run(["git", "branch", branch], cwd=many.root.parent / repo, check=True, timeout=30)
    trunk = site("branch", "--show-current").stdout.strip()
    site("switch", "-q", branch)
    site("commit", "-q", "--allow-empty", "-m", "site work")
    site("switch", "-q", trunk)
    assert (sorted(spanning.bases), across.close_merged()) == (["chronos", "site"], []), \
        "a ticket across repositories keeps a base for each, and stays open while the one it changed is unmerged"
    assert [(repo["name"], repo["state"]) for repo in across._repository_states(across.load(spanning.n))] == [("chronos", "untouched"), ("site", "changed")], \
        "its card names each repository and where its branch stands"
    assert across.merge(spanning.n).completed and "site work" in site("log", "-1", "--format=%s").stdout, \
        "journal ticket merge merges each repository it changed, skips the untouched one, and closes it"


def test_a_drafted_ticket_waits_for_the_user_to_confirm_it_before_it_can_start():
    from resources.base import AGENT
    from tests.conftest import refused
    record = fresh()
    board = Boards(record, actor=USER).create("Features", stages=["Ideas", "Building"], meanings={"Building": "start"})
    drafted = Tickets(record, actor=AGENT).create("Dark mode", abstract="A dark theme for the viewer", board=board.n, draft=True)
    assert ("is a draft" in refused(lambda: Tickets(record, actor=USER).move(drafted.n, "Building")), Tickets(record).load(drafted.n).stage) == \
        (True, "Ideas"), "a draft cannot start, and stays where it was"
    assert "only the user confirms" in refused(lambda: Tickets(record, actor=AGENT).confirm(drafted.n)), "the agent cannot confirm its own draft"
    shown = lambda: [card["n"] for lane in Tickets(record, actor=USER).board(board.n)["lanes"] for card in lane["cards"]]
    assert drafted.n not in shown(), "a draft stays off the board"
    assert Tickets(record, actor=USER).confirm(drafted.n).draft is False, "the user confirms it"
    assert drafted.n in shown(), "once confirmed it shows on the board"


def test_a_ticket_waits_on_a_confirmed_dependency_and_starts_when_it_closes(monkeypatch):
    import engine.terminal
    from resources.base import AGENT
    from tests.conftest import refused
    launched = []
    monkeypatch.setattr(engine.terminal, "detached", lambda root, cwd, env, agent, args: launched.append(env) or 1)
    record = fresh()
    board = Boards(record, actor=USER).create("Features", stages=["Ideas", "Building"], meanings={"Building": "start"})
    user, agent = Tickets(record, actor=USER), Tickets(record, actor=AGENT)
    api, ui = user.create("An API", board=board.n), user.create("Its screen", board=board.n)
    agent.depend(ui.n, api.n)
    assert user.load(ui.n).dependencies == {api.ref: "proposed"}, "the agent only proposes a dependency"
    user.decline_dependencies(ui.n)
    assert user.load(ui.n).dependencies == {}, "a declined proposal is gone and holds nothing"
    docs = user.create("Its docs", board=board.n)
    agent.depend(ui.n, api.n)
    agent.depend(ui.n, docs.n)
    user.accept_dependencies(ui.n, only=str(api.n))
    kept = user.load(ui.n)
    assert (kept.dependencies, kept.declined) == ({api.ref: "confirmed"}, [docs.ref]), "only the links the user kept hold"
    assert f"declined its proposed wait on {docs.ref}" in user._kickoff(kept), "the ticket's agent hears which wait was declined"
    assert "would wait on itself" in refused(lambda: user.depend(api.n, ui.n)), "a cycle is refused"
    agent.depend(docs.n, api.n)
    assert "only the user" in refused(lambda: agent.accept_dependencies(docs.n, why="docs follow the API")), "an agent never decides a proposal"
    monkeypatch.setattr(Tickets, "_orchestrating", lambda self: [board.n])
    monkeypatch.setattr("features.work_tracking.auto.automatic", lambda record: True)
    assert "orchestrator_accepts_waits" in refused(lambda: agent.accept_dependencies(docs.n, why="x")), "only where the board lets its orchestrator decide"
    Boards(record, actor=USER).update(board.n, orchestrator_accepts_waits=True)
    assert "say why" in refused(lambda: agent.accept_dependencies(docs.n)), "the board's orchestrator gives its reason"
    agent.accept_dependencies(docs.n, why="the docs describe the API")
    assert (user.load(docs.n).dependencies, "as the board's orchestrator, under auto mode: the docs describe the API" in user.comments(docs.n)[0].brief) == \
        ({api.ref: "confirmed"}, True), "under auto mode the board's orchestrator decides it, and the ticket shows who and why"
    user.move(ui.n, "Building")
    assert (launched, user.load(ui.n).queued) == ([], True), "a ticket waiting on an open one does not start"
    user.complete(api.n, how="shipped")
    user.start_queued()
    assert (launched, user.load(ui.n).queued) == ([f"ticket-{ui.n}"], False), "once its dependency closes, the sweep starts it"


def test_a_plan_waiting_for_approval_is_read_and_approved_from_its_card(monkeypatch):
    from features.plans.controller import APPROVED, Plans
    from tests.conftest import refused
    record = fresh()
    board = Boards(record, actor=USER).create("Features", stages=["Ideas", "Building"])
    tickets = Tickets(record, actor=USER)
    ticket = tickets.update(tickets.create("Dark mode", board=board.n).n, work_environment="ticket-1")
    plans = Plans(Record(record.root, "ticket-1"), actor=AGENT)
    from controllers.types import Works
    waiting = Works(Record(record.root, "ticket-1"), actor=AGENT)
    waiting.update(waiting.create("the theme").n, awaiting="the user's pick of theme")
    running = Works(Record(record.root, "ticket-1"), actor=AGENT, agent="sub-1")
    running.update(running.create("the long run").n, awaiting="the parity run over Chronos")
    plan = plans.create("Dark mode plan", goal="a dark theme")
    plans.phase(plan.n, "Build it", when="it is built")
    plans.stage(plan.n, "todos")
    from controllers.types import Todos
    plans.place(plan.n, 1, [Todos(Record(record.root, "ticket-1"), actor=AGENT).create("Add the theme tokens").n])
    plans.ready(plan.n)
    tickets.update(ticket.n, plan=plan.n)
    card = tickets.board(board.n)["lanes"][0]["cards"][0]
    assert ([action["label"] for action in card["actions"]], card["state"]) == (["Approve plan", "Read plan"], "you"), \
        "a plan waiting for approval puts Approve plan and Read plan on its ticket's card, and the card waits on the user"
    assert "only the user" in refused(lambda: Tickets(record, actor=AGENT).approve_plan(ticket.n)), "only the user approves a ticket's plan"
    Boards(record, actor=USER).update(board.n, orchestrator_approves_plans=True, orchestrator_confirms_drafts=True)
    monkeypatch.setattr("features.work_tracking.auto.automatic", lambda record: True)
    import features
    from features.sequences.shipped import ship
    from tests.kit import nudges, report, tick
    features.load()
    report(record, "working", "PreToolUse")
    ship(record)
    assert "never the agent that wrote it" in refused(lambda: Tickets(record, actor=AGENT).approve_plan(ticket.n)), \
        "before the board is started, no agent orchestrates it, so none may approve"
    Boards(record, actor=USER).start(board.n)
    for elsewhere in ("ticket-1", "ticket-2"):
        assert "never the agent that wrote it" in refused(lambda: Tickets(Record(record.root, elsewhere), actor=AGENT).approve_plan(ticket.n)), \
            "neither the ticket's own agent nor a sibling ticket's may approve the plan"
    tick(record)
    assert any("Reviewing a ticket's plan, step 1 of 3" in line for line in nudges(record)), \
        "the minute check hands the orchestrator the review of the waiting plan, ahead of the board it runs"
    assert "Review it yourself" in tickets._review(tickets.load(ticket.n)), "by default the orchestrator reviews the plan itself"
    Boards(record, actor=USER).update(board.n, plan_reviewer="subagent")
    assert "Dispatch a reviewer subagent" in tickets._review(tickets.load(ticket.n)), "a board can hand the review to a reviewer subagent"
    Tickets(record, actor=AGENT).approve_plan(ticket.n)
    assert plans.load(plan.n).status == APPROVED, "the orchestrator, the agent on the board's own environment, approves it"
    from features.plans.controller import ACTIVE, WAITING
    Plans(Record(record.root, "ticket-1"), actor=SYSTEM).update(plan.n, status=WAITING)
    drafted = tickets.create("A drafted card", board=board.n, draft=True, abstract="One more card")
    import time
    started = time.time()
    from controllers.types import Environments, Messages, Questions, Works
    orchestrating = Works(record, actor=AGENT)
    orchestrating.update(orchestrating.create("run the board", force="the orchestrator's own work").n, awaiting="the tickets to finish")
    place = Record(record.root, "ticket-1")
    asked = Questions(place, actor=AGENT).create("Which theme?")
    tickets.update(ticket.n, told=time.time() - 1)
    Messages(place, actor=AGENT).create("Dark it is, as the card says")
    monkeypatch.setattr(time, "time", lambda: started + 120)
    tick(record)
    assert any("Passing a checkpoint, step 1 of 2" in line for line in nudges(record)), \
        "a ticket's plan that stops at a checkpoint is handed to the orchestrator too"
    assert (f"ticket {ticket.n}, Dark mode, asks question {asked.n} - Which theme?" in nudges(record),
            f"ticket {ticket.n}, Dark mode, is waiting - the user's pick of theme" in nudges(record),
            f"ticket {ticket.n}, Dark mode, answered - Dark it is, as the card says" in nudges(record)) == (True, True, True), \
        "the orchestrator is told when a ticket's agent asks a question, waits on something, or answers after being told"
    asked_count = lambda: nudges(record).count(f"ticket {ticket.n}, Dark mode, asks question {asked.n} - Which theme?")
    tick(record)
    monkeypatch.setattr(time, "time", lambda: started + 120 + 300)
    tick(record)
    assert asked_count() == 2, "while the question still waits, the orchestrator is reminded every five minutes, not every minute"
    assert nudges(record).count(f"ticket {ticket.n}, Dark mode, is waiting - the parity run over Chronos") == 1, \
        "an agent waiting on its own run is announced once, not every five minutes"
    told = []
    monkeypatch.setattr(Tickets, "tell", lambda self, n, note: told.append((n, note)))
    Environments(record, actor=SYSTEM).create("ticket-1", owner=ticket.ref)
    Questions(place, actor=USER).complete(asked.n, how="Dark")
    assert told == [(ticket.n, f"Your question {asked.n}, Which theme?, is answered: Dark")], "an answered question wakes the ticket's agent with the answer"
    assert any(f"ticket {drafted.n}, A drafted card, is a draft waiting for you" in line for line in nudges(record)), \
        "under auto mode the orchestrator is told when a proposal it may decide waits"
    monkeypatch.setattr(Tickets, "agent_session", lambda self, n: "claude-t1")
    monkeypatch.setattr(Tickets, "tell", lambda self, n, note: (_ for _ in ()).throw(Refused("the note stayed in its input box")))
    Tickets(record, actor=AGENT).continue_plan(ticket.n)
    assert plans.load(plan.n).status == ACTIVE, \
        "the orchestrator lets it go on, so the board does not wait for the user overnight, even when its note to the agent does not land"


def test_drafts_carry_one_line_and_the_agent_answers_the_panel_briefly():
    from features.tickets.limits import CARD_LINE, CARD_TITLE, PANEL_REPLY
    from controllers.types import Messages
    from tests.conftest import refused
    record = fresh()
    board = Boards(record, actor=USER).create("Shared Journal")
    drafting = Tickets(record, actor=AGENT)
    assert "one line" in refused(lambda: drafting.create("Sign in", board=board.n, draft=True)), "a draft without its one line is refused"
    assert "one line" in refused(lambda: drafting.create("Sign in", abstract="x" * (CARD_LINE + 1), board=board.n, draft=True)), \
        "a line too long for the card is refused"
    made = drafting.create("Sign in", abstract="Everyone signs in", board=board.n, draft=True)
    assert "one line" in refused(lambda: drafting.update(made.n, abstract="x" * (CARD_LINE + 1))), "an edit keeps the line short too"
    assert "title" in refused(lambda: drafting.update(made.n, title="t" * (CARD_TITLE + 1))), "a title too long for the card is refused"
    request = Boards(record, actor=USER).request(board.n, "I want to share")
    agent = Messages(record, actor=AGENT)
    assert "shorter" in refused(lambda: agent.reply(request.n, "y" * (PANEL_REPLY + 1))), "a reply the panel cannot show whole is refused"
    assert agent.reply(request.n, "Five tickets drafted, pick the ones to keep.").brief.endswith("pick the ones to keep."), "a short reply goes through"
