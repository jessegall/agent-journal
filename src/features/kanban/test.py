import time

import features
from controllers.base import COMMANDS
from controllers.types import Questions, Todos, Works
from features.kanban.board import sources_of
from features.kanban.lanes import lane_of
from features.plans.controller import Plans
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def board(record, **lens) -> dict:
    return COMMANDS["todo"]["board"](Todos(record, actor=USER), **lens)


def shift(record, n: int, lane: str, **words):
    return COMMANDS["todo"]["shift"](Todos(record, actor=USER), n, lane, **words)


def lane(record, n: int) -> str:
    journal = features.FEATURES["kanban"].journal.at(record)
    return lane_of(sources_of(journal), Todos(record, actor=USER).load(n))


def test_every_to_do_sits_in_one_lane_by_its_state_and_the_first_rule_that_matches():
    features.load()
    record = fresh()
    todos = Todos(record, actor=USER)
    plain, blocked, waiting, started, asked, done, old = (todos.create(f"row {i}").n for i in range(7))
    todos.block(blocked, "the api is down")
    todos.after(waiting, plain)
    Works(record, actor=AGENT).create("building it", todo=started)
    Works(record, actor=AGENT, force="two at once for the test").create("another", todo=asked)
    Questions(record, actor=AGENT).create("which way", about=f"todo:{asked}")
    todos.complete(done, "shipped")
    todos.complete(old, "long ago")
    closed = todos.load(old)
    closed.completed = time.time() - 30 * 86400
    todos.save(closed, "updated")
    assert [lane(record, n) for n in (plain, blocked, waiting, started, asked, done)] == \
        ["todo", "held", "held", "doing", "asked", "done"], "a question outranks open work, work outranks a hold"
    on_board = {card["n"] for column in board(record)["lanes"] for card in column["cards"]}
    assert old not in on_board and done in on_board, "a row closed longer ago than done_days is off the board"
    cards = {card["n"]: card for column in board(record)["lanes"] for card in column["cards"]}
    assert (cards[plain]["targets"], cards[blocked]["targets"], cards[waiting]["targets"], cards[started]["targets"], cards[done]["targets"]) == \
        (["held", "doing", "done"], ["todo", "done"], [], [], ["todo"]), "each card carries the lanes it may move to"
    assert "waits on todo" in cards[waiting]["reason"] and cards[blocked]["reason"] == "blocked: the api is down", "a held card says why"


def test_a_row_outside_an_active_plan_stays_in_to_do_and_the_hold_is_one_line():
    features.load()
    record = fresh()
    todos = Todos(record, actor=USER)
    inside, outside = todos.create("in the plan").n, todos.create("not in it").n
    plans = Plans(record, actor=AGENT)
    plan = plans.create("Ship it", goal="shipped")
    plans.phase(plan.n, "Build", when="built")
    plans.stage(plan.n, "todos")
    plans.place(plan.n, 1, [inside])
    plans.ready(plan.n)
    plans = Plans(record, actor=USER)
    plans.approve(plan.n)
    plans.start(plan.n)
    assert (lane(record, inside), lane(record, outside)) == ("todo", "todo"), "the plan's global hold moves no card"
    assert board(record)["plan_hold"].startswith(f"Plan {plan.n} is active"), "it is said once above the lanes"


def test_a_card_moves_through_the_journals_own_actions_and_refuses_in_words_that_name_a_command():
    features.load()
    record = fresh()
    todos = Todos(record, actor=USER)
    n, other = todos.create("a card").n, todos.create("another").n
    assert refused(lambda: shift(record, n, "held")).endswith('needs --why "<why>"'), "blocking asks why"
    shift(record, n, "held", why="waiting on the api")
    assert todos.load(n).blocked == "waiting on the api", "to held blocks the row"
    shift(record, n, "todo")
    assert todos.load(n).blocked == "", "back to to do unblocks it"
    before = todos.load(n).updated
    shift(record, n, "todo")
    assert todos.load(n).updated == before, "a shift into the lane it is in writes nothing"
    todos.after(n, other)
    assert refused(lambda: shift(record, n, "done")).endswith("close that first"), "a row that waits cannot be closed"
    todos.after(n, other, off=True)
    shift(record, n, "done", how="built it")
    assert todos.load(n).outcome == "built it", "to done closes the row"
    assert "--why" in refused(lambda: shift(record, n, "todo")), "reopening asks why"
    todos.block(n, "an old block")
    shift(record, n, "todo", why="it came back")
    assert (todos.load(n).completed, lane(record, n)) == (0.0, "todo"), "back to to do reopens it and lifts an old block"
    assert "journal question ask" in refused(lambda: shift(record, n, "asked")), "only a question puts a card in needs you"
    assert refused(lambda: shift(record, n, "sideways")).startswith("a lane is one of"), "an unknown lane is refused"
    shift(record, n, "doing")
    assert "journal work end" in refused(lambda: shift(record, n, "todo")), "a card with open work is left to its agent"


def test_the_board_and_its_moves_are_refused_while_the_feature_is_off():
    features.load()
    record = fresh()
    n = Todos(record, actor=USER).create("a card").n
    record.features = {"kanban": False}
    assert (refused(lambda: board(record)), refused(lambda: shift(record, n, "held", why="x"))) == \
        ("the kanban feature is off", "the kanban feature is off"), "both commands say so"


def test_a_cards_words_pass_the_formatters_like_every_other_field():
    features.load()
    record = fresh()
    Todos(record, actor=USER).create("[!info] tagged title")
    assert [c["title"] for lane in board(record)["lanes"] for c in lane["cards"]] == ["tagged title"], "a leftover tag is taken off the card's title"


def test_a_parked_to_do_is_held_not_doing():
    record = fresh()
    row = Todos(record, actor=AGENT).create("set aside")
    Todos(record, actor=AGENT).start(row.n)
    Works(record, actor=AGENT).action("park")("waiting on the build")
    cards = {card["n"]: card for column in board(record)["lanes"] for card in column["cards"]}
    assert (lane(record, row.n), cards[row.n]["reason"]) == ("held", "parked: waiting on the build"), "parked work leaves Doing and says why"


def test_an_ended_plan_holds_none_of_its_rows():
    from features.plans.progress import held
    record = fresh()
    plans, row = Plans(record, actor=AGENT), Todos(record, actor=AGENT).create("moved between plans")
    for title in ("the old plan", "the new plan"):
        plan = plans.create(title, goal="a goal")
        plans.phase(plan.n, "one", when="done")
        plans.place(plan.n, 1, [row.n])
        plans.ready(plan.n)
    plans.abandon(plan.n - 1, why="rewritten")
    plans = Plans(record, actor=USER)
    plans.approve(plan.n)
    plans.start(plan.n)
    assert (held(record, Todos(record, actor=USER).load(row.n)), lane(record, row.n)) == (False, "todo"), \
        "only the running plan's phase counts; the abandoned one still linking the row holds nothing"
