import time
from controllers.types import Comments, Todos
from engine.record import Record
from features.boards.controller import Boards
from features.tickets.controller import Tickets
from resources.base import AGENT, SYSTEM, USER, Refused
from tests.conftest import fresh


def test_a_ticket_belongs_to_the_project_and_one_source_event_stays_one_ticket(tmp_path):
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

    from migrations.m0055_card_backs_in_parts import run as reshape
    from migrations.m0059_tickets_name_their_provider import run as name_provider
    plain = Tickets(record, actor=AGENT).create("Plain card", brief="just words")
    lettered = Tickets(record, actor=AGENT).create("Lettered card")
    Tickets(record, actor=AGENT).update(lettered.n, brief="What: fix it Why: it breaks")
    assert reshape(record.root) == [lettered.ref], "only a card back written in run-on parts is reshaped"
    assert Tickets(record, actor=AGENT).load(lettered.n).brief == "**What:** fix it\n\n**Why:** it breaks", "each part gets its own paragraph"
    assert Tickets(record, actor=AGENT).load(plain.n).brief == "just words", "a card back without parts is left as it was"
    assert reshape(tmp_path) == [] and name_provider(tmp_path) == [], "a project without environments has nothing to reshape or name"
    Tickets(record, actor=AGENT).update(plain.n, agent="codex")
    assert name_provider(record.root) == [f"ticket {plain.n} runs on codex"], "a ticket stamped with its agent names that provider"
    assert Tickets(record, actor=AGENT).load(plain.n).provider == "codex", "the provider is now its own field"
    assert name_provider(record.root) == [], "a ticket that names its provider is left alone"


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
    assert (bound.work_environment, Environments(record).rows.by_title(bound.work_environment) is not None, tickets.bind(ticket.n).work_environment) == \
        (f"ticket-{ticket.n}", True, f"ticket-{ticket.n}"), "binding makes the ticket's environment once, named for the ticket, which its worktree takes too"
    assert tickets.agent_session(ticket.n) == "", "no session holds it until its agent starts"
    from features.dev_faults.feature import DevFaults
    assert DevFaults.on_for(Record(record.root, bound.work_environment)) is False, "a ticket's agent is not told the journal's own developer faults"
    Sessions(record.root).write("claude-old", environment=bound.work_environment, provider="claude", pid=999999)
    assert Sessions(record.root).choose("claude-new", "claude", "main", {e.title for e in Environments(record, actor=SYSTEM).all() if e.owner}) == "main", "a plain session never lands in a ticket's environment"
    Sessions(record.root).bind("claude-7", bound.work_environment, provider="claude")
    assert tickets.agent_session(ticket.n) == "claude-7", "the session is whichever one holds the ticket's environment"
    tickets.complete(ticket.n, how="still running", yes=True)
    assert Environments(record).rows.by_title(bound.work_environment) is not None, "an environment whose agent still runs is kept when its ticket closes"
    other = tickets.bind(tickets.create("Search").n)
    tickets.complete(other.n, how="shipped", yes=True)
    assert Environments(record).rows.by_title(other.work_environment) is None, "a closed ticket's idle environment goes to the attic"


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
    import agents.terminal
    from engine.sessions import Sessions
    launched = []
    monkeypatch.setattr(agents.terminal, "detached", lambda root, cwd, env, agent, args: launched.append((env, agent, args)) or 1)
    record = fresh()
    board = Boards(record, actor=USER).create("Features", stages=["Ideas", "Building"], meanings={"Building": "start"})
    tickets = Tickets(record, actor=USER)
    ticket = tickets.create("Dark mode", board=board.n)
    tickets.move(ticket.n, "Building")
    from engine.record import Record
    from features.permission_prompts.skipping import skipped
    env, agent, args = launched[0]
    assert (env, agent, args[:2], skipped(Record(record.root, f"ticket-{ticket.n}"))) == \
        (f"ticket-{ticket.n}", "claude", ["--worktree", f"ticket-{ticket.n}"], True), \
        "the start stage launches the ticket's agent in its own worktree, in auto mode, so it never stops at a permission prompt"
    kickoff = agents.terminal.launch_brief(record.root, env).read_text()
    assert "Draft a plan" in kickoff and ticket.ref in kickoff, "a fresh start opens with the ticket and how to plan it"
    from controllers.types import Environments
    from agents.terminal import launching
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
    printed.write_bytes("\x1b[2KReading the tree contract\r\n\x1b[1m❯\u00a0\x1b[2mapproved, go ahead\x1b[22m\r\n".encode())
    shown = tickets.screen(ticket.n)
    assert "Reading the tree contract" in shown, "journal ticket screen shows what the ticket agent's terminal says"
    assert "[a suggestion, not sent: approved, go ahead]" in shown, "Claude Code's dimmed next-prompt suggestion is marked, never read as typed"
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
    from features.sequences.controller import Sequences
    merging = Sequences(record, actor=USER).create("Merging a ticket", starts_on="ticket.finished")
    Sequences(record, actor=USER).section(merging.n, "Review its work", "Dispatch the ticket-reviewer.")
    Sequences(record, actor=SYSTEM).run(merging.n, about=ticket.ref)
    card = next(card for lane in tickets.board(board.n)["lanes"] for card in lane["cards"] if card["n"] == ticket.n)
    assert (card["state"], card["reason"].startswith(f"under review ({merging.title})")) == ("running", True), \
        "a ticket the orchestrator is reviewing waits on that review; it is never stuck"
    from features.tickets.calls import WAITS_ON_PEOPLE
    assert [bool(WAITS_ON_PEOPLE.search(text)) for text in ("waits for your approval", "wacht op goedkeuring", "de build draait")] == [True, True, False], \
        "a wait on a person is read in Dutch as well as English"
    Sequences(record, actor=SYSTEM).abandon(merging.n, about=ticket.ref, why="only a check", sure=True)
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
    tickets.update(ticket.n, dependencies={third.ref: "confirmed"})
    assert tickets._needing_a_look([board.n]) == [], "an agent idle because its ticket waits on an open ticket is not stuck"
    tickets.update(ticket.n, dependencies={})
    assert tickets._revive(tickets.load(ticket.n)) and launched[-1][0] == f"ticket-{ticket.n}", "its agent is started again, once"
    tickets.update(ticket.n, launched=time.time() - 120)
    assert not tickets._revive(tickets.load(ticket.n)), "a second loss is told to the orchestrator instead of restarted"
    tickets.stop(ticket.n)
    assert tickets._needing_a_look([board.n]) == [], "a ticket stopped on purpose is left alone"
    drafted = Tickets(record, actor=USER, agent="board-filler").create("Light mode", board=board.n)
    tickets.move(drafted.n, "Building")
    assert launched[-1][1] == "claude", "the agent that wrote the ticket is its author, never the provider that runs it"
    from tests.conftest import refused
    orchestrated = tickets.create("High contrast", board=board.n)
    assert "--model <model>" in refused(lambda: Tickets(record, actor=AGENT).move(orchestrated.n, "Building")), \
        "an agent starting a ticket names its model, as every dispatch does"
    Tickets(record, actor=AGENT).move(orchestrated.n, "Building", model="sonnet")
    assert launched[-1][2][:2] == ["--model", "sonnet"], "the ticket's agent starts on the model it was given"
    Comments(Record(record.root, f"ticket-{ticket.n}"), actor=AGENT).create("Measured", brief="parity holds", about=ticket.ref)
    assert "Measured" in [c.title for c in tickets.comments(ticket.n)], "a ticket agent's comment shows on its ticket from the main environment"
    queued_tickets_keep_their_order_and_refuse_what_cannot_start(monkeypatch)
    calls_fire_once_and_repeat_on_time(monkeypatch)


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
    home = git("branch", "--show-current").stdout.strip()
    from engine.worktree import branched
    git("branch", "behind")
    git("branch", "elsewhere")
    git("switch", "-q", "elsewhere")
    git("commit", "-q", "--allow-empty", "-m", "an older ticket's work")
    git("switch", "-q", home)
    git("commit", "-q", "--allow-empty", "-m", "the board moved")
    board_tip = git("rev-parse", home).stdout.strip()
    for name in ("behind", "elsewhere"):
        branched(project, name, board_tip, fresh=True)
    aside = [line.strip() for line in git("branch", "--list", "elsewhere-set-aside-*").stdout.splitlines()]
    assert (git("rev-parse", "behind").stdout.strip(), git("rev-parse", "elsewhere").stdout.strip(), len(aside)) == (board_tip, board_tip, 1), \
        "a new ticket's branch starts at the board's tip: one only behind moves up, one with other work is set aside"
    git("branch", f"worktree-{ticket.work_environment}")
    git("commit", "-q", "--allow-empty", "-m", "the board moved on")
    assert tickets.close_merged() == [], "a branch with no recorded base and a ticket that never ran is never merged, however the board moved"
    ticket = tickets.update(ticket.n, base=git("rev-parse", f"worktree-{ticket.work_environment}").stdout.strip(), launched=time.time())
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
    import agents.terminal
    monkeypatch.setattr(agents.terminal, "detached", lambda *args: 1)
    git("branch", "rewrite")
    git("switch", "-q", "rewrite")
    git("commit", "-q", "--allow-empty", "-m", "the contract")
    git("switch", "-q", home)
    rewrite = Boards(record, actor=USER).create("Rewrite", stages=["Doing", "Shipped"], meanings={"Doing": "start", "Shipped": "done"}, branch="rewrite",
                                                after_merge="echo released > released.txt")
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
    assert tickets.load(later.n).launched and not tickets.load(later.n).queued, "a ticket that waits on another starts its agent to plan ahead"
    assert tickets.merge(part.n).completed and git("branch", "--show-current").stdout.strip() == home, \
        "journal ticket merge lands it on its board's branch without touching the checkout, and it closes"
    assert (record.root.parent / "released.txt").is_file() and "After the merge, echo released > released.txt ran" in \
        [c.brief for c in Comments(record, actor=USER).linked_to(part.ref)][-1], "the board's after-merge command runs once the ticket lands, and the ticket says how it went"
    tickets.start_queued()
    later = tickets.load(later.n)
    assert later.base == started and not later.queued, "a waiting ticket starts from its board branch's tip when it starts, before what it waited on landed"
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
    spanning = across._based(spanning, across._started_at(spanning))
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

    second = tickets.bind(tickets.create("Light mode", board=board.n).n)
    git("switch", "-q", "-c", f"worktree-{second.work_environment}", home)
    (project / "clash.txt").write_text("the ticket's version\n")
    git("add", "clash.txt")
    git("commit", "-q", "-m", "the ticket's change")
    git("switch", "-q", home)
    (project / "clash.txt").write_text("the board's version\n")
    git("add", "clash.txt")
    git("commit", "-q", "-m", "the board's change")
    assert "was not merged into" in refused(lambda: tickets.merge(second.n)), "a ticket whose branch conflicts with the board's is not merged, and says why"
    unmerged = Docs(Record(record.root, second.work_environment), actor=USER).create("How light mode works")
    tickets.complete(second.n, how="dropped", yes=True)
    assert Docs(record).load(unmerged.n).deleted, "a doc a ticket proposed goes with it when the ticket closes without its branch merged"
    from features.tickets.landing import Landing
    assert tickets._clean(tickets.load(second.n)) is False, "a ticket with no worktree of its own is not clean"
    assert [Landing(project, f"worktree-{ticket.work_environment}", ticket.base, home).state(), Landing(project, f"worktree-{second.work_environment}", ticket.base, home).state()] \
        == ["merged", "changed"], "a branch is merged, changed or untouched by where its commits are"
    nested = project / "autoscaling"
    nested.mkdir()
    subprocess.run(["git", "init", "-q", "-b", "trunk"], cwd=nested, check=True, timeout=30)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "first"], cwd=nested, check=True, timeout=30)
    wide = tickets.load(tickets.create("Wide", board=rewrite.n).n)
    assert (tickets._into_at(wide, "autoscaling", nested), tickets._into_at(wide, ".", project)) == ("trunk", "rewrite"), \
        "a nested repository starts from the branch it has checked out; the project's own repository keeps the board's"
    subprocess.run(["git", "switch", "-q", "-c", "feature/activities"], cwd=nested, check=True, timeout=30)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "feature work"], cwd=nested, check=True, timeout=30)
    ahead = subprocess.run(["git", "rev-parse", "HEAD"], cwd=nested, check=True, capture_output=True, text=True, timeout=30).stdout.strip()
    assert (tickets._into_at(wide, "autoscaling", nested), tickets._started_at(wide)["autoscaling"]) == ("feature/activities", ahead), \
        "a nested repository checked out on a feature branch starts the ticket at that checkout's head, never at another branch it also has"
    from controllers.types import Environments
    environments = Environments(record, actor=SYSTEM)
    stale = [*environments.rows.summaries(), {**environments.rows.summaries()[0], "n": 999, "deleted": 0}]
    monkeypatch.setattr(environments.rows, "summaries", lambda: stale)
    assert 999 not in [env.n for env in environments.rows.every()], "an environment removed between the listing and the read is left out of the list, never raised as Missing"


def test_a_drafted_ticket_waits_for_the_user_to_confirm_it_before_it_can_start():
    from resources.base import AGENT
    from tests.conftest import refused
    record = fresh()
    board = Boards(record, actor=USER).create("Features", stages=["Ideas", "Building"], meanings={"Building": "start"})
    drafted = Tickets(record, actor=AGENT).create("Dark mode", abstract="A dark theme for the viewer", board=board.n, draft=True)
    assert ("is a draft" in refused(lambda: Tickets(record, actor=USER).move(drafted.n, "Building")), Tickets(record).load(drafted.n).stage) == \
        (True, "Ideas"), "a draft cannot start, and stays where it was"
    assert "does not let its orchestrator confirm the draft" in refused(lambda: Tickets(record, actor=AGENT).confirm(drafted.n)), "the agent cannot confirm a draft its board does not let it, and the refusal says which setting allows it"
    shown = lambda: [card["n"] for lane in Tickets(record, actor=USER).board(board.n)["lanes"] for card in lane["cards"]]
    assert drafted.n not in shown(), "a draft stays off the board"
    assert Tickets(record, actor=USER).confirm(drafted.n).draft is False, "the user confirms it"
    assert drafted.n in shown(), "once confirmed it shows on the board"


def test_a_ticket_waits_on_a_confirmed_dependency_and_starts_when_it_closes(monkeypatch):
    import agents.terminal
    from resources.base import AGENT
    from tests.conftest import refused
    launched = []
    monkeypatch.setattr(agents.terminal, "detached", lambda root, cwd, env, agent, args: launched.append(env) or 1)
    record = fresh()
    board = Boards(record, actor=USER).create("Features", stages=["Ideas", "Building"], meanings={"Building": "start"})
    user, agent = Tickets(record, actor=USER), Tickets(record, actor=AGENT)
    api, ui = user.create("An API", board=board.n), user.create("Its screen", board=board.n)
    before = len(user.rows.summaries())
    assert "already made" in refused(lambda: agent.create("Its docs", board=board.n, after="999")) and len(user.rows.summaries()) == before, \
        "a card waiting on a card that does not exist is refused before anything is written"
    docs = agent.create("Its docs", board=board.n, after=str(api.n), covers=2)
    assert (docs.covers, list(docs.dependencies)) == (["2"], [api.ref]), "a card names its waits and one clause as it is made"
    agent.delete(docs.n, why="only a check")
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
    assert "does not let its orchestrator accept or decline" in refused(lambda: agent.accept_dependencies(docs.n, why="docs follow the API")), "an agent decides a proposal only where its board lets its orchestrator"
    monkeypatch.setattr(Tickets, "_orchestrating", lambda self: [board.n])
    assert "orchestrator_accepts_waits" in refused(lambda: agent.accept_dependencies(docs.n, why="x")), "only where the board lets its orchestrator decide"
    Boards(record, actor=USER).update(board.n, orchestrator_accepts_waits=True)
    assert "say why" in refused(lambda: agent.accept_dependencies(docs.n)), "the board's orchestrator gives its reason"
    agent.accept_dependencies(docs.n, why="the docs describe the API")
    assert (user.load(docs.n).dependencies, "as the board's orchestrator: the docs describe the API" in user.comments(docs.n)[0].brief) == \
        ({api.ref: "confirmed"}, True), "the board's orchestrator decides it where the board lets it, and the ticket shows who and why"
    user.move(ui.n, "Building")
    assert (launched, user.load(ui.n).queued) == ([f"ticket-{ui.n}"], False), "a ticket waiting on an open one still starts its agent, to write its plan ahead"
    assert f"waits on ticket {api.n}" in refused(lambda: user.approve_plan(ui.n)), "its plan is not approved while the ticket it waits on is open"
    user.complete(api.n, how="shipped")
    assert "has no plan waiting" in refused(lambda: user.approve_plan(ui.n)), "once its dependency closes, the wait no longer holds the plan"
    first, left, right, last = (user.create(title, board=board.n) for title in ("First", "Left", "Right", "Last"))
    for waiting, on in ((left, first), (right, first), (last, left), (last, right)):
        user.update(waiting.n, dependencies={**user.load(waiting.n).dependencies, on.ref: "confirmed"})
    assert "would wait on itself" in refused(lambda: user.depend(first.n, last.n)), "a cycle through two ways to the same ticket is found, and each way is followed once"
    user.update(last.n, dependencies={"ticket:999": "confirmed"})
    assert user._waiting_on(user.load(last.n)) == [], "a wait on a ticket that is gone holds nothing"


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
    assert "does not let its orchestrator approve the plan" in refused(lambda: Tickets(record, actor=AGENT).approve_plan(ticket.n)), "an agent approves a ticket's plan only where its board lets its orchestrator, and the refusal never sends it to the user"
    Boards(record, actor=USER).update(board.n, orchestrator_approves_plans=True, orchestrator_confirms_drafts=True)
    import features
    from features.sequences.shipped import ship
    from tests.kit import nudges, report, tick
    features.load()
    report(record, "working", "PreToolUse")
    ship(record)
    before = refused(lambda: Tickets(record, actor=AGENT).approve_plan(ticket.n))
    assert f"does not orchestrate board {board.n}" in before and f"--set orchestrator={record.env}" in before and "only the user" not in before, \
        "before the board is started, no agent orchestrates it, so none may approve; the refusal names the board's orchestrator and how to take it, and never sends the agent to the user"
    Boards(record, actor=USER).start(board.n)
    assert Boards(record, actor=USER).load(board.n).orchestrator == record.env, "Play records the environment that runs the board"
    for elsewhere in ("ticket-1", "ticket-2"):
        assert f"{elsewhere} does not orchestrate board {board.n} ({record.env} does)" in refused(lambda: Tickets(Record(record.root, elsewhere), actor=AGENT).approve_plan(ticket.n)), \
            "neither the ticket's own agent nor a sibling ticket's may approve the plan, and the refusal names the environment that does"
    tick(record)
    assert any("Reviewing a ticket's plan, step 1 of 3" in line for line in nudges(record)), \
        "the minute check hands the orchestrator the review of the waiting plan, ahead of the board it runs"
    Boards(record, actor=AGENT).orchestrate("off")
    assert [waiting.n for waiting in Tickets(record, actor=SYSTEM)._awaiting_orchestrator()] == [ticket.n], \
        "who orchestrates is the board's orchestrator field: once Play's run has ended, its waiting plans still reach that environment"
    Tickets(record, actor=AGENT).approve_plan(ticket.n)
    assert plans.load(plan.n).status == APPROVED, "the orchestrator, the agent on the board's own environment, approves it, with or without a live run"
    assert "no plan waiting for you to approve" in refused(lambda: tickets.approve_plan(ticket.n)), "a plan that is already approved is not approved again"
    Plans(Record(record.root, "ticket-1"), actor=SYSTEM).update(plan.n, status="ready")
    tickets.approve_plan(ticket.n)
    assert plans.load(plan.n).status == APPROVED, "you approve the plan from its ticket's card as well"
    from features.plans.controller import ACTIVE, WAITING
    Plans(Record(record.root, "ticket-1"), actor=SYSTEM).update(plan.n, status=WAITING)
    drafted = tickets.create("A drafted card", board=board.n, draft=True, abstract="One more card")
    import time
    started = time.time()
    from controllers.types import Environments, Messages, Questions, Works
    orchestrating = Works(record, actor=AGENT)
    orchestrating.update(orchestrating.create("run the board", force="the orchestrator's own work").n, awaiting="the tickets to finish")
    place = Record(record.root, "ticket-1")
    asked = Questions(place, actor=AGENT).create("Which theme?", options=[{"title": "Light"}, {"title": "Dark"}], pick=1)
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
    assert nudges(record).count(f"ticket {ticket.n}, Dark mode, is waiting - the parity run over Chronos") == 0, \
        "an agent waiting on its own run never nudges the orchestrator: it is not waiting on anyone"
    told = []
    monkeypatch.setattr(Tickets, "tell", lambda self, n, note: told.append((n, note)))
    Environments(record, actor=SYSTEM).create("ticket-1", owner=ticket.ref)
    Questions(place, actor=USER).complete(asked.n, how="Dark")
    assert told == [(ticket.n, f"Your question {asked.n}, Which theme?, is answered: Dark")], "an answered question wakes the ticket's agent with the answer"
    assert any(f"ticket {drafted.n}, A drafted card, is a draft waiting for you" in line for line in nudges(record)), \
        "the orchestrator is told when a proposal it may decide waits"
    monkeypatch.setattr(Tickets, "agent_session", lambda self, n: "claude-t1")
    monkeypatch.setattr(Tickets, "tell", lambda self, n, note: (_ for _ in ()).throw(Refused("the note stayed in its input box")))
    Tickets(record, actor=AGENT).continue_plan(ticket.n)
    assert plans.load(plan.n).status == ACTIVE, \
        "the orchestrator lets it go on, so the board does not wait for the user overnight, even when its note to the agent does not land"


def test_drafts_carry_one_line_and_the_agent_answers_the_panel_briefly():
    from features.boards.resource import PANEL_REPLY
    from features.tickets.limits import CARD_LINE, CARD_TITLE
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
    agent.read(request.n)
    assert "journal board say" in refused(lambda: agent.reply(request.n, "Five tickets drafted.")), "a request made on the board is answered on the board"
    assert "shorter" in refused(lambda: agent.comment(request.n, "y" * (PANEL_REPLY + 1))), "an answer the panel cannot show whole is refused"
    assert agent.comment(request.n, "Five tickets drafted, pick the ones to keep.").brief.endswith("pick the ones to keep."), "a short answer goes through"


def calls_fire_once_and_repeat_on_time(monkeypatch):
    import features
    from features.tickets import calls as ticket_calls, handlers
    from features.trigger import MINUTE
    from features import trigger
    from tests.kit import nudges, report, tick
    features.load()
    record = fresh()
    board = Boards(record, actor=USER).create("Features", stages=["Ideas", "Building"], meanings={"Building": "start"})
    ticket = Tickets(record, actor=USER).create("Dark mode", board=board.n)
    report(record, "working", "PreToolUse")
    moments, held = [], [[("ticket_replied", "message:1", {"text": "done?"}, 0), (ticket_calls.PLAN_DONE_CALL, "plan:5", {}, 15), ("ticket_asks", "question:2", {"question": 2, "text": "which one", "env": "ticket-1"}, 15)]]
    monkeypatch.setattr(handlers, "watched", lambda tickets: [ticket])
    monkeypatch.setattr(handlers, "calls", lambda tickets, found: held[0])
    monkeypatch.setattr(Tickets, "raise_moment", lambda self, n, moment, **data: moments.append(moment))
    now = [time.time()]
    monkeypatch.setattr(trigger.time, "time", lambda: now[0])
    sent = lambda: [n for n in nudges(record) if "Dark mode, answered" in n]
    tick(record)
    assert [moment for moment in moments if moment == "finished"] == ["finished"] and len(sent()) == 1, \
        "a reply is told once and a finished plan raises its moment, while a question is left to the nudge that repeats it"
    tick(record)
    assert moments.count("finished") == 1 and len(sent()) == 1, "nothing is said again at once"
    now[0] += 16 * MINUTE
    tick(record)
    assert moments.count("finished") == 2 and len(sent()) == 1, "the plan that is still finished raises its moment again after its window, and the reply is not repeated"
    held[0] = []
    now[0] += 16 * MINUTE
    tick(record)
    assert moments.count("finished") == 2, "a ticket with nothing to call about raises nothing"

    root = record.root
    ticket_calls.PEOPLE[str(root)] = ["jesse"]
    assert [ticket_calls.waits_on_people(root, text) for text in ("waits for jesse", "asks the user", "the build runs")] == [True, True, False], \
        "a wait is on a person when it names the user, an approval or the one who owns the git config"
    monkeypatch.setattr(Tickets, "_plan_status", lambda self, found: ticket_calls.PLAN_DONE)
    monkeypatch.setattr(Tickets, "_clean", lambda self, found: True)
    tickets = Tickets(record, actor=SYSTEM)
    assert ticket_calls.handed_in(tickets, ticket), "a done plan on a clean branch with its agent idle is handed in"
    monkeypatch.setattr(Tickets, "_clean", lambda self, found: False)
    assert not ticket_calls.handed_in(tickets, ticket), "a dirty branch is not handed in"
    from types import SimpleNamespace
    from controllers.types import Questions
    whispered = []
    context = SimpleNamespace(record=record, agent=SimpleNamespace(whisper=lambda line, **values: whispered.append(line)), every=lambda *args: True)
    monkeypatch.setattr(Tickets, "_orchestrating", lambda self: [])
    monkeypatch.setattr(Tickets, "_needing_a_look", lambda self, boards: [(ticket, SimpleNamespace(kind="stopped", text="its agent is gone"))])
    monkeypatch.setattr(Tickets, "_revive", lambda self, found: True)
    handlers.look_at_stuck(context, tickets)
    assert whispered == ["ticket_restarted"] and handlers.STUCK not in moments, "a ticket whose agent died is restarted and the orchestrator hears of it"
    monkeypatch.setattr(Tickets, "_revive", lambda self, found: False)
    handlers.look_at_stuck(context, tickets)
    assert moments[-1] == handlers.STUCK, "one that cannot be restarted is raised to the orchestrator"
    delivered = []
    monkeypatch.setattr(Tickets, "_owned_by", lambda self, env, kind: ticket.n)
    monkeypatch.setattr(Tickets, "tell", lambda self, n, note: delivered.append(note))
    question = Questions(record, actor=AGENT).create("Which one?", options=[{"title": "A"}, {"title": "B"}], pick=1)
    Questions(record, actor=USER).complete(question.n, how="Both")
    assert delivered == [f"Your question {question.n}, Which one?, is answered: Both"], "a ticket's agent is told when the user answers its question"
    monkeypatch.setattr(Tickets, "tell", lambda self, n, note: (_ for _ in ()).throw(Refused("no agent")))
    handlers.WakeTheTicketAgent().handle(context, SimpleNamespace(n=question.n))
    monkeypatch.setattr(Tickets, "_owned_by", lambda self, env, kind: 0)
    handlers.WakeTheTicketAgent().handle(context, SimpleNamespace(n=question.n))


def queued_tickets_keep_their_order_and_refuse_what_cannot_start(monkeypatch):
    import agents.terminal
    from tests.conftest import refused
    monkeypatch.setattr(agents.terminal, "detached", lambda root, cwd, env, agent, args: 1)
    record = fresh()
    board = Boards(record, actor=USER).create("Queue", stages=["Ideas", "Building"], meanings={"Building": "start"})
    record.set_setting("tickets", {"running": 1})
    tickets = Tickets(record, actor=USER)
    first, second, third, fourth, fifth = (tickets.create(title, board=board.n) for title in ("One", "Two", "Three", "Four", "Five"))
    for ticket in (first, second, third):
        tickets.move(ticket.n, "Building")
    assert [tickets.load(t.n).queued for t in (first, second, third)] == [False, True, True], "past the limit the later tickets wait in the order they were moved"
    tickets.queue_before(third.n, second.n)
    assert tickets._queue() == [third.n, second.n], "a queued ticket moves before another queued one"
    assert "only a queued" in refused(lambda: tickets.queue_before(first.n, second.n)), "a ticket that is not waiting has no place in the queue"
    tickets.start_next(second.n)
    assert tickets._queue() == [second.n, third.n], "a ticket told to start next goes to the front of the queue"
    assert "is not queued" in refused(lambda: tickets.start_next(first.n)), "only a queued ticket starts next"
    tickets.place(third.n, second.n)
    assert tickets._queue() == [third.n, second.n], "dropping one queued ticket on another reorders the queue"
    tickets.place(first.n, third.n)
    assert tickets.load(first.n).queued is False, "dropping a ticket that is not queued only moves it within its column"
    from features.tickets.cards import ago, ordinal
    assert [ordinal(n) for n in (1, 2, 3, 4, 11, 12, 13, 21, 22, 103)] == ["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "103rd"], \
        "a place in the queue is written as an ordinal"
    assert [ago(seconds) for seconds in (30, 120, 7200)] == ["30s", "2m", "2h"], "a quiet time is written in its largest whole unit"
    reasons = lambda: {card["n"]: card["reason"] for lane in tickets.board(board.n)["lanes"] for card in lane["cards"]}
    assert (reasons()[third.n].startswith("1st in the queue, starts when one of 1 agents finishes"), reasons()[second.n].startswith("2nd in the queue, starts when")) == (True, True), \
        "a queued card says its place and what it waits for"
    record.set_setting("tickets", {"running": 0})
    assert reasons()[third.n].startswith("1st in the queue, starts with the next minute's check"), "with no limit a queued card waits only for the next check"
    record.set_setting("tickets", {"running": 1})
    assert "no agent running to look at" in refused(lambda: tickets.screen(second.n)), "a queued ticket has no screen to show"
    assert "no agent running to tell" in refused(lambda: tickets.tell(second.n, "hello")), "a queued ticket has no agent to tell"
    from types import SimpleNamespace
    typed = []
    with monkeypatch.context() as scoped:
        scoped.setattr(Tickets, "_driver", lambda self, found, doing: SimpleNamespace(send=lambda text, now, by: typed.append(text) or bool(text)))
        tickets.tell(second.n, "  hello  ")
        assert (typed, "told" in tickets.load(second.n).data) == (["hello"], True), "a note to a ticket's agent is typed into its terminal and remembered"
        scoped.setattr(Tickets, "_driver", lambda self, found, doing: SimpleNamespace(send=lambda text, now, by: False))
        assert "stayed in its input box" in refused(lambda: tickets.tell(second.n, "again")), "a note the terminal would not take says its agent may be stuck"
    assert "no provider 'nowhere'" in refused(lambda: tickets.start(fourth.n, provider="nowhere")), "a provider the journal does not know is refused before anything starts"
    assert "never started" in refused(lambda: tickets.merge(fifth.n)), "a ticket that never started has no branch to merge"
    from commands.http import dispatch
    from resources.base import Refused
    asked_to_start = []

    def refusing(*given):
        raise Refused("no room")

    with monkeypatch.context() as scoped:
        scoped.setattr(Tickets, "start", lambda self, n: asked_to_start.append(n) or refusing())
        tickets.start_queued()
        scoped.setattr(Tickets, "start", lambda self, n: asked_to_start.append(n) or SimpleNamespace(queued=True))
        tickets.start_queued()
        scoped.setattr(Tickets, "complete", lambda self, n, **given: refusing())
        tickets._closed([tickets.load(first.n)])
        assert not tickets.load(first.n).completed, "a ticket that cannot be closed stays open"
    assert len(asked_to_start) == len(tickets._queue()) + 1, "the queue is walked until one ticket stays queued, and a ticket that cannot start is passed over"
    with monkeypatch.context() as scoped:
        scoped.setattr("engine.organization.organization", refusing)
        assert dispatch("GET", f"/api/{record.env}/ticket/{first.n}/choices", record.root, {}, {}).body["owner"] == [], "a project with no organization offers no owners"
    choices = dispatch("GET", f"/api/{record.env}/ticket/{first.n}/choices", record.root, {}, {}).body
    assert ([found["label"] for found in choices["board"]], [found["key"] for found in choices["stage"]]) == (["Queue"], ["Ideas", "Building"]), \
        "a ticket's form offers the boards and the stages of its own board"
    from controllers.base import COMMANDS
    Todos(Record(record.root, tickets.load(fourth.n).work_environment), actor=AGENT).create("Draw the dark theme")
    held = COMMANDS["ticket"]["todos"](tickets)
    assert [(found["ticket"], [row["title"] for row in found["todos"]]) for found in held] == [(fourth.n, ["Draw the dark theme"])], \
        "the to-dos a ticket's own agent keeps are listed under their ticket"
    from features.tickets.cards import SILENT_AFTER
    from resources.types import IDLE
    tickets.update(fifth.n, dependencies={first.ref: "proposed"})
    tickets.update(fourth.n, dependencies={first.ref: "confirmed"})
    assert (reasons()[fifth.n], tickets._runtime(tickets.load(fourth.n), {}, 0).text.startswith(f"waiting on ticket {first.n}")) == (f"the agent proposes it waits on ticket {first.n}", True), \
        "a card says which ticket its agent proposed it waits on, and which it is held by"
    watching = lambda **row: tickets._live_state(SimpleNamespace(**{"asking": False, "at": 5.0, "quiet_for": 0.0, "status": "working", "background_run": False, "command_running": False, "tool": "", "file": "", **row}), "ticket-x").text
    assert [watching(asking=True), watching(at=0.0), watching(quiet_for=SILENT_AFTER + 120), watching(status=IDLE, quiet_for=SILENT_AFTER + 120),
            watching(quiet_for=SILENT_AFTER + 120, command_running=True)] == \
        ["waiting for you", "starting", "silent for 7m", "idle for 7m with nothing running in the background", "working"], \
        "a ticket's agent is called waiting, starting, silent or idle by what it last did and how long ago, and is never silent while a command runs"
