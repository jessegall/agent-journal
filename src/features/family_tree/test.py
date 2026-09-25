import features
from controllers.types import Agents, Environments
from engine.record import Record
from features.family_tree.tree import family
from resources.base import SYSTEM
from tests.conftest import fresh
from tests.kit import report


def test_the_tree_links_who_started_whom_and_who_dispatched_which_subagent():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    agents = Agents(record, actor=SYSTEM)
    main = agents.primary()
    agents.update(main.n, subagent_rows=[{"id": "t1", "task_id": "a1", "task": "Ada: review the board", "type": "claude", "running": True}])
    Environments(record, actor=SYSTEM).create("ticket-1", owner="ticket:1", launched_from=record.env)
    ticket = Record(record.root, "ticket-1")
    report(ticket, "working", "PreToolUse", session="claude-t1")
    tree = family(record)
    kinds = {(link["source"].split(":")[0], link["target"].split(":")[0], link["kind"]) for link in tree["links"]}
    assert {("agent", "sub", "dispatched"), ("agent", "agent", "started")} <= kinds, tree["links"]
    started = next(link for link in tree["links"] if link["kind"] == "started")
    assert started["source"].startswith(f"agent:{record.env}:") and started["target"].startswith("agent:ticket-1:"), \
        "the ticket's agent hangs under the agent of the environment that launched it"
    assert any(member["kind"] == "ticket" for member in tree["members"]), "a ticket's agent is marked as one"
