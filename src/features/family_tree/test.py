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


def test_agents_that_wrote_to_each_other_are_linked_by_the_notes_in_their_transcripts(tmp_path, monkeypatch):
    from types import SimpleNamespace
    from engine.transcript import PEER, SENT, PeerNote, Turn
    from features.family_tree import tree
    transcript = tmp_path / "main.jsonl"
    transcript.write_text("a")
    reads = []
    turns = [Turn(1, "agent", peer=PeerNote(SENT, "ada")), Turn(2, "agent", peer=PeerNote(PEER, "uds:grace", "grace")),
             Turn(3, "agent"), Turn(4, "agent", peer=PeerNote(PEER, "hopper", "Grace H"))]
    provider = lambda: SimpleNamespace(turns=lambda path: reads.append(path) or turns)
    monkeypatch.setattr(tree, "PROVIDERS", {"claude": provider})
    tree.MESSAGED.clear()
    row = SimpleNamespace(provider="claude", transcript=str(transcript))
    members = {}
    links = tree.messaged(row, "agent:main:1", members, {"hopper": "agent:other:2"})
    assert [(link.source, link.target) for link in links] == [("agent:main:1", "peer:ada"), ("peer:uds:grace", "agent:main:1"), ("agent:other:2", "agent:main:1")], \
        "a note sent links the writer to its addressee and a note received links the sender back, naming known agents by their own id"
    assert sorted(members) == ["agent:other:2", "peer:ada", "peer:uds:grace"], "everyone a note names joins the tree, and a name no agent answers to becomes a peer of its own"
    tree.messaged(row, "agent:main:1", {}, {})
    assert len(reads) == 1, "a transcript that did not grow is not read again"
    transcript.write_text("ab")
    turns.append(Turn(5, "agent", peer=PeerNote(SENT, "linus")))
    again = tree.messaged(row, "agent:main:1", {}, {})
    assert len(again) == 4 and len(reads) == 2, "a transcript that grew keeps what it held and adds the notes after it"
    assert tree.messaged(SimpleNamespace(provider="claude", transcript=str(tmp_path / "gone.jsonl")), "agent:main:1", {}, {}) == [] \
        and tree.messaged(SimpleNamespace(provider="nobody", transcript=str(transcript)), "agent:main:1", {}, {}) == [], \
        "an agent whose transcript is gone or whose provider is unknown has no messages to show"


def test_the_questions_of_the_environments_working_under_one_are_listed_with_its_own_each_named_for_its_environment():
    from controllers.types import Questions
    from resources.base import AGENT, USER
    from surfaces.listing import Listing, listing
    features.load()
    record = fresh()
    Environments(record, actor=SYSTEM).create("ticket-5", owner="ticket:5", launched_from=record.env)
    Environments(record, actor=SYSTEM).create("ticket-1", owner="ticket:1", launched_from="ticket-5")
    Environments(record, actor=SYSTEM).create("elsewhere", owner="ticket:2", launched_from="no-one")
    options = [{"label": "yes"}, {"label": "no"}]
    Questions(record, actor=AGENT).create("Mine?", options=options, pick=1)
    Questions(Record(record.root, "ticket-5"), actor=AGENT).create("Helper's?", options=options, pick=1)
    Questions(Record(record.root, "ticket-1"), actor=AGENT).create("Ticket's?", options=options, pick=1)
    Questions(Record(record.root, "elsewhere"), actor=AGENT).create("Not under me?", options=options, pick=1)
    rows = listing(Questions(record, actor=USER), record, Listing.from_query({}))["rows"]
    assert [(row.get("env", ""), row["title"]) for row in rows] == [("", "Mine?"), ("ticket-5", "Helper's?"), ("ticket-1", "Ticket's?")], \
        "its own question, then those of the environments launched from it and from them, and none of another's"
    assert rows[1]["ref"] == "ticket-5/question:1", "a question from below is referred to with its environment, so it is answered where it was asked"
