import features
from controllers.types import Agents, Nudges
from features.session_briefing.start import start_block
from features.work_modes.details import MODES, NAME
from features.work_modes.modes import choose_board, filing, mode_of, pick, taking
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh, refused


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


def test_the_board_picked_for_new_work_switches_what_the_agent_is_told_to_file():
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    from commands.http import dispatch
    from controllers.types import Boards
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


def test_the_offer_of_the_next_row_is_worded_by_the_mode_the_agent_is_in():
    features.load()
    record = fresh()
    assert taking(record) == MODES["builder"].taking, "builder: the agent does the work itself"
    pick(record, "orchestrator", USER)
    assert "send a helper or subagent to do it" in taking(record), "orchestrator: the agent sends the work out"
    pick(record, "solo", USER)
    assert "no helpers or subagents here" in taking(record), "solo: there is nobody to send it to"


def test_starting_a_board_picks_orchestrator_and_rebuilds_the_start_file_after_the_moment():
    from controllers.types import Boards
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
