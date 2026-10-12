import time

import features
from controllers.types import Agents, Nudges, Works
from features.session_briefing.start import start_block
from features.work_modes.details import MODES, NAME
from features.work_modes.modes import choose_board, filing, mode_of, pick, taking
from features.work_modes.share import share
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, USER
from runner.hooks import handle
from tests.conftest import fresh, refused

DISPATCH = {"subagent_type": "Explore", "model": "haiku", "description": "Dr. Einstein: find the slow hook"}


def called(record, tool: str, given: dict) -> dict:
    return handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": tool,
                                                                  "tool_input": given, "cwd": str(record.root.parent)})


def mode_nudges(record, words: str) -> list:
    return [n for n in Nudges(record, actor=SYSTEM).all() if words in n.title]


def test_a_picked_mode_is_kept_told_to_the_agent_and_carried_into_every_start():
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    Agents(record, actor=SYSTEM).create("claude-2")
    assert mode_of(record) == "builder" and "WORK MODE" not in start_block(record), "builder is the default, and a start says nothing of it"
    assert "one of builder, orchestrator, solo" in refused(lambda: pick(record, "lazy", USER)), "only the three modes are taken"
    from commands.http import dispatch
    assert dispatch("POST", f"/api/{record.env}/mode", record.root, {}, {"mode": "lazy"}).code == 400, "the viewer's switch refuses another mode in words"
    assert dispatch("POST", f"/api/{record.env}/mode", record.root, {}, {"mode": "orchestrator"}).body == {"mode": "orchestrator"}, \
        "the viewer's mode switch picks the mode"
    assert mode_of(record) == "orchestrator" and "WORK MODE: orchestrator" in start_block(record), "the mode is kept and carried after a restart or compaction"
    told = mode_nudges(record, "work mode to orchestrator")
    assert sorted(n.session for n in told) == ["claude-1", "claude-2"], "every agent that is running is told once when it changes, not only the first"
    assert all(MODES["orchestrator"].written in n.brief for n in told), "and it is told the mode's own words, the ones the instructions now carry, not only its name"
    assert all(n.data.get("lead") for n in told), "as the line that comes first in what it is handed"
    from features.sequences.shipped import shipped_sequences
    routines = {shipped.title: shipped for shipped in shipped_sequences()}
    assert [title in routines for title in ("Taking a helper's report", "Routing a user's report", "Cutting a patch release")] == [True] * 3, \
        "the orchestrator's routines ship with the journal, whether or not a board is in play"
    assert "Search it yourself first" in [step for step, _ in routines["Routing a user's report"].steps], \
        "routing a report starts by searching in a few commands, before a subagent is sent for a quick question"
    assert NAME in [e.data.get("setting") for e in record.event_log.events()], "the viewer hears the change and follows it"
    pick(record, "orchestrator", USER)
    assert len(mode_nudges(record, "work mode to orchestrator")) == 2, "picking the same mode again tells nothing"
    from features.journal_laws.briefing import briefing_files
    written = lambda: [(record.root.parent / name).read_text() for name in briefing_files() if (record.root.parent / name).is_file()]
    carried = lambda: "\n".join(written())
    assert "How you work here" in carried() and "You are the orchestrator here" in carried(), \
        "picking a mode writes it into the files the agent reads at a start, at once, rather than saying it once in a line it drifts away from"
    pick(record, "builder", USER)
    assert "You are the builder here" in carried() and "orchestrator here" not in carried(), \
        "and changing the mode rewrites it, so the files never carry the mode before last"


def test_solo_refuses_a_subagent_and_a_helper_and_hands_on_lets_both_through():
    features.load()
    record = fresh()
    helper = {"command": 'journal helper dispatch Rhea "a job" --provider codex --model gpt-5.5'}
    assert called(record, "Agent", DISPATCH) == {}, "builder lets a subagent through"
    assert "solo" not in called(record, "Bash", helper).get("reason", ""), "builder lets a helper through"
    pick(record, "solo", USER)
    agents = record.root.parent / ".claude" / "agents"
    agents.mkdir(parents=True, exist_ok=True)
    (agents / "auditor.md").write_text("---\nname: auditor\ntools: Bash, Read, Grep, Glob\n---\n")
    (agents / "fixer.md").write_text("---\nname: fixer\ntools: Bash, Read, Edit, Write\n---\n")

    def solo_refuses(kind: str) -> bool:
        return "set this environment to solo" in called(record, "Agent", {**DISPATCH, "subagent_type": kind}).get("reason", "")

    assert (solo_refuses("Explore"), solo_refuses("Plan"), solo_refuses("auditor")) == (False, False, False), \
        "solo lets a subagent that only reads through: a built-in reader, or an agent file whose tools cannot edit"
    assert (solo_refuses("general-purpose"), solo_refuses("fixer"), solo_refuses("nobody-knows")) == (True, True, True), \
        "solo refuses a subagent that can write, and one whose tools it cannot read"
    assert "set this environment to solo" in called(record, "Bash", helper).get("reason", ""), "solo refuses a helper"


def test_orchestrator_reminds_the_agent_after_its_own_edits_and_hands_on_never(monkeypatch):
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    Works(record, actor=AGENT).create("a piece of work")
    edit = {"file_path": str(record.root.parent / "code.py"), "old_string": "a", "new_string": "b"}
    for _ in range(9):
        called(record, "Edit", edit)
    assert not mode_nudges(record, "orchestrator here"), "builder is never reminded"
    pick(record, "orchestrator", USER)
    for _ in range(7):
        called(record, "Edit", edit)
    assert not mode_nudges(record, "orchestrator here"), "a few edits of its own are fine"
    called(record, "Edit", edit)
    assert mode_nudges(record, "orchestrator here and have made 8 edits"), "the eighth edit brings a gentle reminder"


def test_an_upgrade_turns_auto_mode_on_and_renames_the_hands_on_mode():
    from migrations.m0060_auto_mode_on_everywhere import run as auto_on
    from migrations.m0061_hands_on_is_builder import run as rename

    record = fresh()
    record.set_setting("features", {"work_tracking.auto": False, "kept": True})
    record.set_setting(NAME, {"mode": "hands-on", "other": 1})
    assert auto_on(record.root) == ["t: auto mode on"], "an environment that switched auto mode off gets it back"
    assert record.setting("features") == {"work_tracking.auto": True, "kept": True}, "only auto mode changes"
    assert auto_on(record.root) == [], "an environment with auto mode on is left alone"
    assert rename(record.root) == ["t: the work mode hands-on is now builder"], "the old mode name is renamed"
    assert record.setting(NAME) == {"mode": "builder", "other": 1}, "the other work-mode settings stay"
    assert rename(record.root) == [], "a mode that is already named builder is left alone"


def test_the_board_picked_for_new_work_switches_what_the_agent_is_told_to_file():
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    from commands.http import dispatch
    from features.boards.controller import Boards
    board = Boards(record, actor=USER).create("Rewrite", stages=["Doing", "Done"])
    pick(record, "orchestrator", USER)
    assert "NEW WORK" not in start_block(record) and "journal todo create" in filing(record), "with no board picked, new work is filed as to-dos as before"
    assert "no board 99" in refused(lambda: choose_board(record, 99, USER)), "a board that is not there is refused"
    assert dispatch("POST", f"/api/{record.env}/mode/board", record.root, {}, {"board": board.n}).body == {"board": board.n}, "the viewer's selector picks the board"
    assert f"NEW WORK: file each new request as a ticket on board {board.n}, Rewrite" in start_block(record), "a start carries where new work goes"
    assert len(mode_nudges(record, "where new work goes")) == 1 and "journal ticket create" in mode_nudges(record, "where new work goes")[0].brief and "journal todo create" not in mode_nudges(record, "where new work goes")[0].brief, "the agent is told once, to file tickets on the board it picked, never to-dos"
    choose_board(record, board.n, USER)
    assert len(mode_nudges(record, "where new work goes")) == 1, "picking the same board tells nothing"
    pick(record, "builder", USER)
    assert "NEW WORK" not in start_block(record) and "journal todo create" in filing(record), "outside orchestrator mode the board is not used: to-dos"
    pick(record, "orchestrator", USER)
    choose_board(record, 0, USER)
    assert "NEW WORK" not in start_block(record) and len(mode_nudges(record, "where new work goes")) == 2, "None goes back to to-dos and the agent is told"


def ran(at: float, edits: int) -> dict:
    return {"id": f"r{at}", "command": "Edit", "tool": "Edit", "at": at, "done": at, "changed": {"edited": edits}}


def test_the_builder_is_told_when_most_of_a_stretch_was_edited_by_its_helpers():
    features.load()
    record = fresh()
    agents = Agents(record, actor=SYSTEM)
    Works(record, actor=AGENT).create("a piece of work")
    then = time.time()
    main = agents.create("claude-1", provider="claude",
                         subagent_rows=[{"id": "t1", "session": "sub-1", "task": "Lady Lovelace: the sweep", "type": "claude", "running": False}])
    sub = agents.create("sub-1", provider="claude", parent="claude-1")
    agents.update(main.n, commands=[ran(then, 3)])
    agents.update(sub.n, commands=[ran(then + 1, 9)])
    assert share(record) == (3, 9), "the agent's own edits and its subagents' are counted over the one stretch"
    edit = {"file_path": str(record.root.parent / "code.py"), "old_string": "a", "new_string": "b"}
    for _ in range(7):
        called(record, "Edit", edit)
    assert not mode_nudges(record, "of the edits in this stretch"), "the share is read every eighth edit of its own, not sooner"
    called(record, "Edit", edit)
    assert mode_nudges(record, "25% of the edits in this stretch were your own"), "a quarter of its own is below the share a builder keeps"
    agents.update(sub.n, commands=[ran(then + 1, 1)])
    edit_nudge_count = len(mode_nudges(record, "of the edits in this stretch"))
    for _ in range(8):
        called(record, "Edit", edit)
    assert len(mode_nudges(record, "of the edits in this stretch")) == edit_nudge_count, "three of its own against one of theirs is a builder working"


def test_the_offer_of_the_next_row_is_worded_by_the_mode_the_agent_is_in():
    features.load()
    record = fresh()
    assert taking(record) == MODES["builder"].taking, "builder: the agent does the work itself"
    pick(record, "orchestrator", USER)
    assert "send a helper or subagent to do it" in taking(record), "orchestrator: the agent sends the work out"
    pick(record, "solo", USER)
    assert "no helpers or subagents here" in taking(record), "solo: there is nobody to send it to"


def test_starting_a_board_picks_orchestrator_and_rebuilds_the_start_file_after_the_moment():
    from features.boards.controller import Boards
    features.load()
    record = fresh()
    start = record.root / "runtime" / f"start-{record.env}.md"
    board = Boards(record, actor=USER).create("Rewrite", stages=["Doing", "Done"])
    assert mode_of(record) != "orchestrator", "before Play the environment is not orchestrating"
    Boards(record, actor=USER).start(board.n)
    assert (mode_of(record), "ORCHESTRATING:" in start.read_text(), "WORK MODE: orchestrator" in start.read_text()) == ("orchestrator", True, True), \
        "the handlers on the board's moments pick the mode and rebuild the start file the call used to rebuild itself"
    Boards(record, actor=AGENT).orchestrate("off")
    assert "ORCHESTRATING:" not in start.read_text(), "turning orchestrating off rebuilds the start file too"
