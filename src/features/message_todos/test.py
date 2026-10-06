import features
from controllers.types import Agents, Messages, Nudges, Todos
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh


def test_a_reply_links_the_new_to_dos_it_names_and_points_out_the_one_it_leaves_unlinked(monkeypatch):
    import time
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    todos = Todos(record, actor=AGENT)
    now = time.time
    monkeypatch.setattr(time, "time", lambda: now() - 3600)
    old = todos.create("filed an hour ago")
    monkeypatch.setattr(time, "time", now)
    asked = Messages(record, actor=USER).create("make the tunnel restart itself and fix the label")
    named, elsewhere, forgotten = (todos.create(title).n for title in ("restart the tunnel", "already linked", "fix the label"))
    Messages(record, actor=USER).link(Messages(record, actor=USER).create("an earlier ask").n, f"todo:{elsewhere}")
    Messages(record, actor=AGENT).reply(asked.n, f"Filed as to-do {named}, to-do {elsewhere} and to-do {old.n}.")
    refs = Messages(record, actor=SYSTEM).load(asked.n).refs
    assert f"todo:{named}" in refs, "a new to-do the reply names is linked to the message it answers"
    assert f"todo:{elsewhere}" not in refs, "a to-do another message already links is left where it is"
    assert f"todo:{old.n}" not in refs, "a to-do older than the setting's minutes is not linked"
    nudged = [n.title for n in Nudges(record, actor=SYSTEM).rows.every()]
    assert f"to-do {forgotten} came from message {asked.n}?" in nudged, "a new to-do the reply leaves unnamed and unlinked is pointed out"
    Messages(record, actor=AGENT).reply(asked.n, "And one more thing.")
    assert [n.title for n in Nudges(record, actor=SYSTEM).rows.every()].count(f"to-do {forgotten} came from message {asked.n}?") == 1, "once"
