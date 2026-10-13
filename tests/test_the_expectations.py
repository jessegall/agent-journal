"""The fourth generated run: it plays every expectation every registration carries.

Nothing here is written by hand about any one feature. The features say what they promise where they
register, this boots them once and plays each promise through the entry the engine really uses, and a
failure is named feature/registration/index so it names the promise rather than a line number.

The tests below it are the grammar's own self-check: that the words a chapter of doc 80 names are the
words the code exports, and that the engine they are played through does what the chapter says.
"""

import tempfile
from dataclasses import fields
from pathlib import Path

import pytest

import commands.cli  # noqa: F401  wires the command line a tag runs its command through, as every process that runs the journal does
import expects
from expects import (Answered, Changed, Dispatches, Expectation, Formats, Given, Held, Kept, NotAnOutcome, Nudged, Set, Whispered,
                     Outcome, Outcomes, Printed, Ran, Refused, Removed, Unchanged, Updated, Wrote, answering, at, counting,
                     exited, nothing)

OUTCOME_WORDS = (Dispatches, Wrote, Removed, Updated, Printed, Ran, Refused, Changed, Kept, Unchanged, Formats, Nudged, Held, Answered, Set, Whispered)
GIVEN_ARGUMENTS = ("on", "earlier", "rows", "settings", "remembered", "transcript", "held", "hook", "clock", "ids", "chat", "commands", "files", "processes", "providers")
SERVICE_KINDS = ("rows", "chat", "files", "processes", "providers", "settings", "clock", "ids", "commands")


def promised():
    """Every expectation every feature carries, of both registries, each with the name its failure is reported under.

    A 2.x registration is a Promise and a 3.0 one a Registration, and neither knows about the other: receiving sits
    below framework and may not name it. They are brought together here, which is the only place that plays either.
    """
    import features
    from framework.promises import PROMISED, Promise
    from receiving import REGISTERED
    features.load()
    moved = [(Promise.of(one), n, expectation)
             for one in REGISTERED.each for n, expectation in enumerate(one.expects)]
    return [pytest.param(one, expectation, id=one.called(n)) for one, n, expectation in [*PROMISED.played(), *moved]]


@pytest.mark.parametrize("promise,expectation", promised())
def test_the_registration_does_what_it_promises(promise, expectation):
    from expects.playing import wrong
    from framework.played import played
    from tests import isolation

    assert (said := wrong(expectation, played(promise, expectation, isolation.world()))) == [], \
        f"{promise.feature.name}'s {promise.name} does not keep its promise: " + "; ".join(said)


def test_every_word_the_chapter_names_is_exported_and_every_export_is_named():
    named = {word.__name__ for word in OUTCOME_WORDS}
    assert named <= set(expects.__all__), f"the chapter names outcome words the module does not export: {named - set(expects.__all__)}"
    assert all(hasattr(expects, name) for name in expects.__all__), "every word the module declares is really there"
    assert {"Given", "Expectation", "SERVICES", "nothing", "at", "counting", "answering", "exited"} <= set(expects.__all__), \
        "the Given, the arrow's result, the services and the helpers a Given is written with"
    assert all(issubclass(word, Outcome) for word in OUTCOME_WORDS), "every outcome word is an Outcome, so it joins with &"
    assert [f.name for f in fields(Given)] == list(GIVEN_ARGUMENTS), "Given takes the arguments the chapter names, in that order"
    assert expects.SERVICES == SERVICE_KINDS, "a Given answers for the nine services the chapter lists and no others"
    assert all(callable(helper) for helper in (at, counting, answering, exited)), "the helpers a Given is written with"


def test_an_expectation_reads_as_the_chapter_writes_it():
    expectation = (Given("the fact", rows=("a row",), settings={"command_tags.reader": "agent"}, clock=at(1_000.0),
                         ids=counting(40), commands=answering({"message reply 12": exited(1, "no such message")}))
                   >> Dispatches("the refusal", claimed="tag|12") & Nudged("tags.refused", tag="reply") & Unchanged())
    assert isinstance(expectation, Expectation) and len(expectation.outcomes.each) == 3, \
        "the arrow takes the first outcome and & joins the rest onto the same expectation, though >> binds tighter"
    assert expectation.given.clock == at(1_000.0) and expectation.given.ids == counting(40), \
        "time and ids come from the Given, never from the module, so an expectation is exact"
    assert Nudged("tags.refused", tag="reply") == Nudged("tags.refused", tag="reply"), "an outcome is a value, compared by what it says"
    assert (Given("x") >> Dispatches(nothing)).outcomes.each == (Dispatches(nothing),), "a registration that stays quiet says so"
    assert Updated("a row", title="new") != Updated("a row", title="old"), "Updated names the fields that changed and their values"


def test_an_expectation_can_only_be_joined_with_outcomes():
    with pytest.raises(NotAnOutcome) as refusal:
        _ = Given("x") >> "wrote a row"
    assert "not with str" in str(refusal.value), "the refusal names what was joined instead"
    assert Outcomes.of(Kept()) == Outcomes((Kept(),)), "one outcome reads as a list of one"


def test_the_four_registration_kinds_name_their_event_and_the_boot_walk_checks_it():
    from dataclasses import dataclass

    from events import Fact, Request
    from receiving import (Answerer, ExpectsNothing, Handler, Listener, NotAReceiver, ReceivesAnother,
                           ReceivesNothing, Refuser, Registration, Registrations)

    @dataclass(frozen=True, kw_only=True)
    class AgentMessageSent(Fact):
        turn: str
        text: str

    @dataclass(frozen=True, kw_only=True)
    class MessageTagged(Fact):
        turn: str
        tag: str

    @dataclass(frozen=True, kw_only=True)
    class ToolCallAsked(Request):
        tool: str

    class TagsInText(Listener[AgentMessageSent]):
        def listen(self, event: AgentMessageSent, settings: dict) -> list[Fact]:
            return [MessageTagged(turn=event.turn, tag="reply").once(f"{event.turn}|reply")]

    class RunTagCommand(Handler[MessageTagged]):
        def handle(self, event: MessageTagged, commands: dict) -> list[Fact]:
            return []

    class HeldByGate(Answerer[ToolCallAsked]):
        def answer(self, event: ToolCallAsked) -> str:
            return ""

    class NoDuplicateTitles(Refuser[MessageTagged]):
        def refuse(self, event: MessageTagged) -> None:
            return None

    assert TagsInText.receives() is AgentMessageSent and TagsInText.wants() == {"settings": dict}, \
        "a receiver says which event it takes and which services it asks for by type, both read at boot"
    assert RunTagCommand.wants() == {"commands": dict} and HeldByGate.wants() == {}, \
        "the services are what follows the event, so a receiver that asks for none says so"
    assert TagsInText().listen(AgentMessageSent(turn="t1", text="[!reply:12] x"), {})[0].claim == "t1|reply", \
        "a fact dispatched once carries the key the engine claims for it, so the listener itself never claims"

    kinds = [("listen", AgentMessageSent, TagsInText()), ("handle", MessageTagged, RunTagCommand()),
             ("answer", ToolCallAsked, HeldByGate()), ("refuse", MessageTagged, NoDuplicateTitles())]
    read = [Registration.read(kind, event, receiver, ["an expectation"], "command_tags") for kind, event, receiver in kinds]
    assert [one.kind for one in read] == ["listen", "handle", "answer", "refuse"] and all(one.feature == "command_tags" for one in read), \
        "all four kinds register, each naming its event class first"
    assert Registration.read("handle", MessageTagged, RunTagCommand(), ["x"], after=(TagsInText,)).after == (TagsInText,), \
        "a handler that must follow another names it, rather than carrying a priority number"

    for broken, raises, why in (
        (lambda: Registration.read("listen", MessageTagged, TagsInText(), ["x"]), ReceivesAnother, "receives AgentMessageSent"),
        (lambda: Registration.read("listen", AgentMessageSent, RunTagCommand(), ["x"]), NotAReceiver, "is not a Listener"),
        (lambda: Registration.read("listen", AgentMessageSent, TagsInText(), []), ExpectsNothing, "registers no expectations"),
    ):
        with pytest.raises(raises) as refusal:
            broken()
        assert why in str(refusal.value), f"the refusal says what is wrong: {refusal.value}"

    class SaysNothing(Listener):
        def listen(self, event, settings: dict) -> list[Fact]:
            return []

    with pytest.raises(ReceivesNothing) as refusal:
        SaysNothing.receives()
    assert "does not say which event it receives" in str(refusal.value), "a receiver written without its event is refused at boot, not at the first event"

    held = Registrations()
    for one in read:
        held.add(one)
    assert len(held.of("handle")) == 1 and len(held.on(MessageTagged)) == 2, \
        "the registrations are kept in declaration order and read back by kind and by event"
    assert [one.name for one in Registrations().each] == [], "a test that wants an empty registry builds one; the journal's own is never emptied under it"


def test_handlers_on_one_fact_are_ordered_by_name_and_the_boot_walk_checks_it():
    from dataclasses import dataclass

    from events import Fact
    from receiving import Handler, Registration
    from receiving.ordering import OrdersAnUnknown, OrdersInACircle, WriteTheSameUnordered, ordered
    from serving import Chat, Clock, Rows

    @dataclass(frozen=True, kw_only=True)
    class TagRefused(Fact):
        turn: str

    class Todo:
        pass

    class FileTheTodo(Handler[TagRefused]):
        def handle(self, event: TagRefused, todos: Rows[Todo]) -> list[Fact]:
            return []

    class AlsoFileATodo(Handler[TagRefused]):
        def handle(self, event: TagRefused, todos: Rows[Todo], clock: Clock) -> list[Fact]:
            return []

    class RestoreTheWords(Handler[TagRefused]):
        def handle(self, event: TagRefused, chat: Chat) -> list[Fact]:
            return []

    def on(receiver, after=()):
        return Registration.read("handle", TagRefused, receiver, ["an expectation"], "command_tags", after)

    files, also, restores = on(FileTheTodo()), on(AlsoFileATodo()), on(RestoreTheWords())
    assert (files.writes, restores.writes) == ({"Todo"}, {"Chat"}), \
        "what a handler writes is keyed by the kind of row, not by the service, so Clock and the others count for nothing"
    assert [one.name for one in ordered(TagRefused, [files, restores])] == ["FileTheTodo", "RestoreTheWords"], \
        "two handlers that write different things commute, so neither has to name the other"
    assert [one.name for one in ordered(TagRefused, [on(AlsoFileATodo(), after=("FileTheTodo",)), files])] == ["FileTheTodo", "AlsoFileATodo"], \
        "a handler that names the one it follows runs after it, whatever order the features registered in"

    for broken, raises, why in (
        (lambda: ordered(TagRefused, [on(FileTheTodo(), after=("Nobody",))]), OrdersAnUnknown, "handles no TagRefused"),
        (lambda: ordered(TagRefused, [files, also]), WriteTheSameUnordered, "both write Todo"),
        (lambda: ordered(TagRefused, [on(FileTheTodo(), after=("AlsoFileATodo",)), on(AlsoFileATodo(), after=("FileTheTodo",))]),
         OrdersInACircle, "wait on each other in a circle"),
    ):
        with pytest.raises(raises) as refusal:
            broken()
        assert why in str(refusal.value), f"the refusal names the handlers and what is wrong: {refusal.value}"


def test_a_chain_of_facts_runs_tick_by_tick_on_its_lane_and_a_raise_leaves_no_partial_write():
    from dataclasses import dataclass

    from events import Fact
    from receiving import Handler, Listener, Registration, Registrations
    from receiving.ticks import Lane, Services, TickFailed, TooManyTicks
    from serving import Chat

    @dataclass(frozen=True, kw_only=True)
    class AgentMessageSent(Fact):
        text: str

    @dataclass(frozen=True, kw_only=True)
    class MessageTagged(Fact):
        tag: str

    @dataclass(frozen=True, kw_only=True)
    class TagCommandRan(Fact):
        tag: str

    ran = []

    class TagsInText(Listener[AgentMessageSent]):
        def listen(self, event: AgentMessageSent) -> list[Fact]:
            return [MessageTagged(tag="reply")] if "[!" in event.text else []

    class RunTagCommand(Handler[MessageTagged]):
        def handle(self, event: MessageTagged, chat: Chat) -> list[Fact]:
            ran.append(event.tag)
            return [TagCommandRan(tag=event.tag)]

    class Shout(Handler[TagCommandRan]):
        def handle(self, event: TagCommandRan, chat: Chat) -> list[Fact]:
            ran.append("shouted")
            raise ValueError("the tag names no message")

    registered = Registrations()
    for kind, event, receiver in (("listen", AgentMessageSent, TagsInText()), ("handle", MessageTagged, RunTagCommand()),
                                  ("handle", TagCommandRan, Shout())):
        registered.add(Registration.read(kind, event, receiver, ["an expectation"]))

    lane = Lane("claude-1", registered, Services({Chat: "the chat"}))
    out = lane.run(AgentMessageSent(text="[!reply:12] the answer"))
    assert [type(one).__name__ for one in out] == ["AgentMessageSent", "MessageTagged", "TagCommandRan", "TickFailed"], \
        "each fact waits for the next tick, so a listener never sees a write its own fact caused"
    assert [one.cause for one in out] == ["", out[0].id, out[1].id, out[2].id] and len(set(one.id for one in out)) == 4, \
        "every fact points back at the event whose tick dispatched it, so a chain reads to its origin"
    assert isinstance(out[-1], TickFailed) and out[-1].error == "the tag names no message" and out[-1].failed == "TagCommandRan", \
        "a handler that raises leaves a TickFailed naming the fact and the error in place of what it would have written"
    assert ran == ["reply", "shouted"] and len(lane.ran) == 4, "the lane runs on after the failure instead of dying with the handler"

    @dataclass(frozen=True, kw_only=True)
    class RoundAndRound(Fact):
        n: int

    class Again(Handler[RoundAndRound]):
        def handle(self, event: RoundAndRound, chat: Chat) -> list[Fact]:
            return [RoundAndRound(n=event.n + 1)]

    circling = Registrations()
    circling.add(Registration.read("handle", RoundAndRound, Again(), ["an expectation"]))
    with pytest.raises(TooManyTicks) as refusal:
        Lane("project", circling, Services({Chat: "the chat"})).run(RoundAndRound(n=0))
    assert "causes itself" in str(refusal.value) and "RoundAndRound caused RoundAndRound" in str(refusal.value), \
        "a lane that never empties is reported with the chain of causes, not left spinning"


def test_the_boot_walk_resolves_every_service_and_refuses_a_synchronous_receiver_that_writes():
    from dataclasses import dataclass

    from events import Fact, Request
    from receiving import Answerer, Handler, Registration, Registrations
    from receiving.boot import (AsksForNothingKnown, AsksForWhatIsNotServed, AsksForWhatMightBeMissing,
                                WritesSynchronously, walked)
    from serving import Chat, Clock, Rows

    @dataclass(frozen=True, kw_only=True)
    class ToolCallAsked(Request):
        tool: str

    @dataclass(frozen=True, kw_only=True)
    class ToolCallAnswered(Fact):
        tool: str

    class Todo:
        pass

    class HeldByGate(Answerer[ToolCallAsked]):
        def answer(self, event: ToolCallAsked, chat: Chat) -> str:
            return ""

    class ReadsTheClock(Answerer[ToolCallAsked]):
        def answer(self, event: ToolCallAsked, clock: Clock) -> str:
            return ""

    class CountTheRefusal(Handler[ToolCallAnswered]):
        def handle(self, event: ToolCallAnswered, todos: Rows[Todo]) -> list[Fact]:
            return []

    class AsksForAString(Handler[ToolCallAnswered]):
        def handle(self, event: ToolCallAnswered, note: str) -> list[Fact]:
            return []

    def registered(*ones):
        held = Registrations()
        for kind, event, receiver in ones:
            held.add(Registration.read(kind, event, receiver, ["an expectation"]))
        return held

    walked(registered(("answer", ToolCallAsked, ReadsTheClock()), ("handle", ToolCallAnswered, CountTheRefusal())), {Chat, Clock, Rows})

    class MightNotHaveRows(Handler[ToolCallAnswered]):
        def handle(self, event: ToolCallAnswered, todos: Rows[Todo] | None) -> list[Fact]:
            return []

    for broken, served, raises, why in (
        (registered(("handle", ToolCallAnswered, MightNotHaveRows())), {Chat, Clock, Rows}, AsksForWhatMightBeMissing, "might be missing"),
        (registered(("answer", ToolCallAsked, HeldByGate())), {Chat, Clock}, WritesSynchronously, "is an answerer and writes Chat"),
        (registered(("handle", ToolCallAnswered, CountTheRefusal())), {Chat, Clock}, AsksForWhatIsNotServed, "serves to nobody"),
        (registered(("handle", ToolCallAnswered, AsksForAString())), {Chat, Clock}, AsksForNothingKnown, "is not a service"),
    ):
        with pytest.raises(raises) as refusal:
            walked(broken, served)
        assert why in str(refusal.value), f"the refusal names the receiver and what it asked for: {refusal.value}"


def test_each_request_reduces_as_specified_and_answering_one_writes_nothing_and_ticks_nothing():
    from events.answers import Allowed, Kept, Refused, Rewritten
    from events.asking import AgentMessageSending, RowWriting, TextFormatting, ToolCallAsked
    from receiving import Answerer, Registration, Registrations
    from receiving.asking import AnswersNothing, answered
    from receiving.ticks import Lane, Services
    from serving import Clock

    assert ToolCallAsked(tool="Bash", input="rm -rf .").answered([Allowed(), Refused(why="plan 4 is open")]) == Refused(why="plan 4 is open"), \
        "a tool call stops on the first refusal, whatever the answerers after it said"
    assert AgentMessageSending(text="[!reply:12] x").answered([Rewritten(text="x"), Kept()]) == Kept(), \
        "a turn kept out of the chat wins over a change to its text"
    assert TextFormatting(text="[!reply:12] x").answered([Rewritten(text="x")]) == Rewritten(text="x"), \
        "formatting composes and nothing wins"
    assert RowWriting(type="todo", action="create").answered([Refused(why="a to-do called x already stands")]) == Refused(why="a to-do called x already stands"), \
        "a row about to be written stops on a refusal, before the write and not after it"

    class HeldByGate(Answerer[ToolCallAsked]):
        def answer(self, event: ToolCallAsked, clock: Clock):
            return Refused(why="plan 4 is open") if "rm" in event.input else Allowed()

    class DryRunIt(Answerer[ToolCallAsked]):
        def answer(self, event: ToolCallAsked):
            return Rewritten(text=f"{event.input} --dry-run")

    registered = Registrations()
    for receiver in (HeldByGate(), DryRunIt()):
        registered.add(Registration.read("answer", ToolCallAsked, receiver, ["an expectation"]))
    services = Services({Clock: "the clock"})

    assert answered(ToolCallAsked(tool="Bash", input="rm -rf ."), registered, services) == Refused(why="plan 4 is open"), \
        "the answerers run in declared order and the request reduces what they said once"
    assert answered(ToolCallAsked(tool="Bash", input="ls"), registered, services) == Rewritten(text="ls --dry-run"), \
        "with nothing refusing, the rewrites compose"
    assert answered(AgentMessageSending(text="plain words"), registered, services) == Allowed(), \
        "a request nobody answers is allowed, rather than held while something is looked for"

    lane = Lane("claude-1", registered, services)
    answered(ToolCallAsked(tool="Bash", input="rm -rf ."), registered, services)
    assert lane.ran == [], "answering a request runs no tick at all, so a hook never waits on work that belongs after its answer"


def test_the_engine_claims_a_fact_at_dispatch_so_the_same_turn_read_three_ways_is_handled_once():
    from dataclasses import dataclass

    from events import Fact
    from receiving import Handler, Listener, Registration, Registrations
    from receiving.ticks import Claims, Lane, Services
    from serving import Chat

    @dataclass(frozen=True, kw_only=True)
    class AgentMessageSent(Fact):
        turn: str
        text: str

    @dataclass(frozen=True, kw_only=True)
    class MessageTagged(Fact):
        turn: str
        tag: str

    replied = []

    class TagsInText(Listener[AgentMessageSent]):
        def listen(self, event: AgentMessageSent) -> list[Fact]:
            return [MessageTagged(turn=event.turn, tag="reply").once(f"{event.turn}|reply")]

    class RunTagCommand(Handler[MessageTagged]):
        def handle(self, event: MessageTagged, chat: Chat) -> list[Fact]:
            replied.append(event.turn)
            return []

    registered = Registrations()
    registered.add(Registration.read("listen", AgentMessageSent, TagsInText(), ["an expectation"]))
    registered.add(Registration.read("handle", MessageTagged, RunTagCommand(), ["an expectation"]))

    claims, services, dropped = Claims(), Services({Chat: "the chat"}), []
    for _ in ("the display stream", "the transcript catch-up", "the Stop hook"):
        lane = Lane("claude-1", registered, services, claims)
        lane.run(AgentMessageSent(turn="t1", text="[!reply:12] the answer"))
        dropped.append(len(lane.dropped))

    assert replied == ["t1"] and dropped == [0, 1, 1], \
        "the same turn reaching the journal three ways is handled once: the first dispatch takes the claim and the others are dropped"
    assert MessageTagged(turn="t1", tag="reply").once("t1|reply").claim == "t1|reply", \
        "the listener says which key the fact is claimed under and never claims it, which is what keeps a listener read-only"
    assert claims.take("t2|reply") and not claims.take("t2|reply"), "a key is taken once and refused after"

    from engine.state import State
    kept = Path(tempfile.mkdtemp()) / "once.json"
    assert Claims(State(kept)).take("t3|reply") and not Claims(State(kept)).take("t3|reply"), \
        "a claim taken in one process is refused in the next: an upgrade mid-turn must not hand the held turn out again"


def test_a_tick_holds_what_it_remembers_until_it_ends_so_order_within_it_never_matters():
    from dataclasses import dataclass

    from controllers.types import Todos
    from engine.record import Record
    from events import Fact
    from receiving import Handler, Registration, Registrations
    from receiving.ticks import Lane, Services
    from resources.base import SYSTEM
    from serving import Rows
    from tests.conftest import fresh

    @dataclass(frozen=True, kw_only=True)
    class AgentBeat(Fact):
        at: float

    @dataclass(frozen=True, kw_only=True)
    class Counted(Fact):
        how_many: int

    class Todo:
        pass

    scratch = fresh()
    record = Record(scratch.root, scratch.env, memo=True)
    Todos(record, actor=SYSTEM).create("a row that is already there")
    read = lambda: len(Todos(record, actor=SYSTEM).rows.standing())
    assert read() == 1, "the tick's record remembers one row before anything in the tick runs"

    class WriteOne(Handler[AgentBeat]):
        def handle(self, event: AgentBeat, todos: Rows[Todo]) -> list[Fact]:
            Todos(record, actor=SYSTEM).create("written by this tick")
            return []

    class CountThem(Handler[AgentBeat]):
        def handle(self, event: AgentBeat, todos: Rows[Todo]) -> list[Fact]:
            return [Counted(how_many=read())]

    registered = Registrations()
    registered.add(Registration.read("handle", AgentBeat, WriteOne(), ["an expectation"]))
    registered.add(Registration.read("handle", AgentBeat, CountThem(), ["an expectation"], after=("WriteOne",)))

    out = Lane("project", registered, Services({Rows: "the rows"}), record=record).run(AgentBeat(at=1_000.0))
    counted = [one.how_many for one in out if isinstance(one, Counted)]
    assert counted == [1], \
        f"a handler reads the rows its tick began with, not what another handler of the same tick wrote, so their order never matters; it read {counted}"
    assert read() == 2, "the tick let its snapshot go when it ended, so the next read sees the world as it now is"
    assert len(Todos(Record(scratch.root, scratch.env), actor=SYSTEM).rows.standing()) == 2, \
        "the write really happened: it was the snapshot that hid it, not the write that failed"


def test_an_unswept_2x_handler_runs_on_the_adapter_and_the_sending_path_cannot():
    from dataclasses import dataclass

    from events import Fact
    from framework.adapter import OldHandler, moved
    from framework.parts import Handler as OldStyle
    from receiving import Registration, Registrations
    from receiving.boot import walked
    from receiving.ticks import Lane, Services
    from serving import Adapted as TheRecord

    @dataclass(frozen=True, kw_only=True)
    class TodoCreated(Fact):
        n: int

    minded = []

    class MindTheBoard(OldStyle):
        def handle(self, context, event):
            minded.append((event.n, context.record))

    registered = Registrations()
    registered.add(Registration.read("handle", TodoCreated, OldHandler(None, MindTheBoard()), [], "tickets"))
    out = Lane("project", registered, Services({TheRecord: "the tick's record"})).run(TodoCreated(n=7))

    assert minded == [(7, "the tick's record")], \
        "a 2.x handler runs as a handler of its event, against a Context built over the tick's own record"
    assert [type(one).__name__ for one in out] == ["TodoCreated"], \
        "it dispatches nothing itself: what it wrote reaches the engine as the funnel's own resource facts"
    walked(registered, set()), "the adapter is exempt from the boot rules by declaring itself adapted, not by a name the checker knows"


    assert [one.says() for one in moved(["plans", "tickets"], {"tickets": ("MindTheBoard",)}, {})] == \
        ["plans: moved", "tickets: adapted (MindTheBoard)"], "the listing says, per feature, moved or adapted"


def test_every_registration_gathers_what_it_promises_and_each_outcome_word_reads_the_play_itself():
    import features
    from expects import Given, Nudged, Printed, Ran, Refused, Unchanged, Wrote, answering, at, counting, exited
    from expects.playing import NotAnswered, Seen, World, wrong
    from framework.promises import PROMISED

    features.load()
    assert len(PROMISED.each) > 200 and {one.kind for one in PROMISED.each} >= {"handler", "formatter", "interceptor"}, \
        "every registration of an owing kind is gathered as the features are wired, with the part itself and its event"
    owes = [one for one in PROMISED.each if one.owes]
    owed, carried = PROMISED.owed(), [one for one in owes if one.expects]
    assert len(owed) + len(carried) == len(owes) and not {one.named_as for one in owed} & {one.named_as for one in carried}, \
        "every owing registration either carries its expectations or is counted as owing them; the count is how phase 2 measures its progress"
    assert len({one.named_as for one in PROMISED.each}) == len(PROMISED.each), \
        "and the registry holds one entry per registration however often the features are loaded"
    assert carried, "and at least one carries some, so the gathering is really reading what the features declare"
    assert PROMISED.each[0].called(0).count("/") == 2, "a failure is named feature/registration/index, so it names the promise and not a line"

    world = World.of(Given("the event", clock=at(1_000.0), ids=counting(40),
                           commands=answering({"message reply 12": exited(0, "replied")})))
    assert (world.clock.now(), world.ids.next(), world.ids.next()) == (1_000.0, 40, 41), \
        "time and ids come from the Given, so an expectation is exact and never flaky"
    assert world.commands.run("message reply 12") == exited(0, "replied"), "a command answers what the Given said it answers"
    with pytest.raises(NotAnswered) as refusal:
        world.commands.run("todo done 7")
    assert "name it in the Given" in str(refusal.value), \
        "an ask the Given does not name is a failure naming the ask, never a silent empty answer"
    asks = {"commands": lambda: world.commands.run("todo done 7"), "files": lambda: world.files.read("notes.md"),
            "processes": lambda: world.processes.start(("ffmpeg",)), "providers": lambda: world.providers.of("transcript")}
    for service, ask in asks.items():
        with pytest.raises(NotAnswered) as unnamed:
            ask()
        assert f"what {service} answers" in str(unnamed.value), \
            f"every Fake that answers reads that one rule, so {service} names itself and the ask rather than inventing an answer"

    seen = Seen(said=["todo 7"], nudged=[("tags.refused", "The reply tag did not run", "it named no message: reply")], ran=[("journal", "todo", "done", "7")])
    holds = Given("x") >> Printed("todo 7") & Nudged("tags.refused", tag="reply") & Ran(("journal", "todo", "done", "7"))
    assert wrong(holds, seen) == [], "an expectation that holds of the play says nothing"
    assert wrong(Given("x") >> Printed("todo 8") & Refused("nope"), seen) == \
        ["it did not say 'todo 8'; it said ['todo 7']", "it refused with None, not with 'nope'"], \
        "and one that does not holds says what the play did instead, word by word"
    assert wrong(Given("x") >> Unchanged(), Seen()) == [] and wrong(Given("x") >> Unchanged(), seen) == [], \
        "Unchanged is about the world, not about what was said: saying something changes nothing"


def test_a_feature_that_registers_an_owing_kind_without_expects_refuses_the_boot():
    from types import SimpleNamespace
    from expects import Given, Unchanged
    from framework.promises import Owing, Promise, Promises

    def promised(*registrations):
        promises = Promises()
        for kind, name, expects in registrations:
            promises.add(Promise(SimpleNamespace(name="demo"), kind, name, None, object, expects))
        return promises

    quiet = promised(("handler", "Quiet", ()))
    with pytest.raises(Owing, match="feature demo registers handler Quiet without expects"):
        quiet.refuse_owing("demo")
    quiet.refuse_owing("other")  # a feature is refused for its own registrations only
    ready = promised(("handler", "Quiet", (Given("x") >> Unchanged(),)), ("handler", "SendOnTheClock", ()), ("append_to_line", "answered", ()), ("route", "get_page", ()))
    ready.refuse_owing("demo")  # a registration with expects, the engine's own two, a line appender and a route owe nothing


def test_a_service_nobody_serves_is_refused_by_name_rather_than_left_out():
    import serving
    from receiving.ticks import NoSuchService, Services

    services = Services({serving.Clock: object(), serving.Ids: object()})
    assert set(services.given("Demo", "demo", {"clock": serving.Clock, "ids": serving.Ids})) == {"clock", "ids"}, "a service the play serves is handed over"
    with pytest.raises(NoSuchService, match="ledger"):
        services.given("Demo", "demo", {"clock": serving.Clock, "ledger": object})


def test_a_handler_run_in_the_world_an_expectation_states_is_held_to_it_off_its_path_and_one_that_did_not_do_it_is_told(tmp_path):
    import time
    import features
    from controllers.types import Agents
    from events.chat_etiquette import ShopTalkInChat
    from framework.lanes import lane_services
    from framework.played import scratch
    from expects.watching import BROKEN, WAIT, Watch
    from framework.promises import Promise
    from receiving import REGISTERED
    from receiving.ticks import Services
    from resources.types import AgentRow

    features.load()
    promise = Promise.of(next(one for one in REGISTERED.each if one.name == "NameShopTalk"))
    live = Given(ShopTalkInChat(agent=1, words="Your message is answered"), rows=[AgentRow(n=1, title="claude-1")])
    told = []
    BROKEN.add(None, lambda record, title, brief: told.append((title, brief)))
    try:
        for ran in (False, True):
            record, told[:] = scratch(live, tmp_path), []
            watch, event, began = Watch(background=False), live.on, time.time() - 1
            if ran:
                services = Services(lane_services(record, lambda: Agents(record, actor="system").peek(1)))
                promise.part.handle(event, **services.given(promise.name, promise.feature.name, type(promise.part).wants()))
            watch.ran(promise, event, record, began)
            assert (watch.inbox.qsize(), watch.pending) == (1, []), "the run's own path only notes that it ran; nothing is tested there"
            watch.settle()
            assert [one.number for one in watch.pending] == [0], "the live world is the world the first expectation states, its numbers read as the live ones"
            assert watch.pending[0].binding.numbers == {("agent", 1): 1}, "the row the Given states, agent 1, is bound to the live row under its own kind"
            watch.sweep(began + WAIT - 1)
            assert told == [], "nothing is looked at before its wait is over"
            watch.sweep(began + WAIT + 1)
            assert [title for title, _ in told] == ([] if ran else [told[0][0]]), "a promise that came true says nothing; one that did not is told"
            assert ran or "agent 1→1" in told[0][1], "what was told names the numbers bound"
        other = Given(live.on, rows=[])
        watch = Watch(background=False)
        watch.ran(promise, other.on, scratch(other, tmp_path), time.time())
        watch.settle()
        assert watch.pending == [], "a world no expectation states is one the handler never promised anything about"
        watch.ran(promise, other.on, None, time.time())
        assert watch.inbox.qsize() == 0, "a run with no record cannot be watched: there is nothing to read what it did from"
    finally:
        BROKEN.entries = [entry for entry in BROKEN.entries if entry.owner is not None]


def test_an_old_handler_beside_the_bus_is_registered_on_the_adapter_and_the_listing_says_where_each_feature_stands():
    from types import SimpleNamespace

    import features
    from events import Fact, Request
    from framework.adapter import ADAPTED, CannotBeAdapted, LoggedHandler, OldEvent, listing
    from framework.parts import Handler as OldStyle
    from framework.promises import PROMISED
    from receiving import HANDLE, Registration, Registrations
    from receiving.ticks import Lane, Services
    from resources.base import Event
    from serving import Adapted as TheRecord

    features.load()
    said = dict(line.split(": ", 1) for line in listing().splitlines())
    assert any(line.startswith("adapted (") for line in said.values()), "a feature whose handlers all run on the adapter says which"
    assert said["sequences"].endswith("; cannot be adapted (KeepOutOfTheChat), swept first"), \
        "a handler on the sending path cannot run there, so its feature is not moved and the listing says it is swept first"
    assert said["command_tags"] == said["chat_etiquette"] == said["acknowledgements"] == "moved", "and a feature swept onto the 3.0 engine says so"
    handled = {one.feature.name for one in PROMISED.each if one.kind == "handler"}
    assert all(said[name] != "moved" for name in handled) and all(said[name] == "moved" for name in said if name not in handled), \
        "a feature reads as moved when it holds no old handler, and as adapted or stuck while it holds one"
    adapted = ADAPTED.of(HANDLE)
    assert len({(one.feature, one.name) for one in adapted}) == len(adapted) and {one.name for one in adapted} >= {"SendOnTheClock"}, \
        "each registers under its old handler's own name, so the ordering can tell them apart and none is registered twice"

    ran = []

    class MindTheBoard(OldStyle):
        hooks = ()

        def handle(self, context, event):
            raise AssertionError("the adapter runs the bus's own run, never the handler directly")

    class Switched:
        on = True

        def enabled(self, record) -> bool:
            return self.on

    kind = SimpleNamespace(marked_as=Fact, patterns=lambda hooks: ("todo.created",))
    feature = Switched()
    registered = Registrations()
    registered.add(Registration.read(HANDLE, OldEvent, LoggedHandler(feature, MindTheBoard(), lambda logged, record: ran.append((logged.n, record)), kind), [], "tickets"))
    lane = lambda: Lane("project", registered, Services({TheRecord: "the tick's record"}))
    lane().run(OldEvent(logged=Event(1, 0.0, "todo", 3, "created", "agent")))
    lane().run(OldEvent(logged=Event(2, 0.0, "todo", 4, "updated", "agent")))
    feature.on = False
    lane().run(OldEvent(logged=Event(3, 0.0, "todo", 5, "created", "agent")))
    assert ran == [(3, "the tick's record")], "the old handler runs for the events the bus would have given it and while its feature is on, and for no other"
    with pytest.raises(CannotBeAdapted):
        LoggedHandler(feature, MindTheBoard(), None, SimpleNamespace(marked_as=Request, patterns=lambda hooks: ()))


def test_a_told_event_is_a_tick_on_a_lane_over_the_old_handlers_in_the_order_the_bus_ran_them():
    """The cut-over: what the bus walked inline now runs inside a tick, in the order the bus walked it, and a raise is told instead of escaping into the write."""
    from receiving.ticks import Remembered
    from contextlib import contextmanager
    from engine import bus
    from expects.watching import BROKEN
    from framework.adapter import BusListener, OldEvent, Ticking
    from receiving import HANDLE, Registration, Registrations
    from resources.base import SYSTEM, Event

    class Held:
        @contextmanager
        def snapshot(self):
            yield self

        def state(self, owner: str):
            return Remembered()

    ran: list[str] = []
    registered = Registrations()
    for name, pattern in (("OnTheAction", "created"), ("OnTheType", "todo"), ("OnEverything", "*"), ("OnBoth", "todo.created")):
        listener = lambda logged, record, name=name: ran.append(name)  # noqa: E731  one listener per name, as the bus holds them
        listener.__qualname__ = name
        registered.add(Registration.read(HANDLE, OldEvent, BusListener(listener, pattern, lambda record: True), ()))
    ticking = Ticking(registered, Registrations())
    ticking.resolve()

    logged = Event(id=1, at=1.0, type="todo", n=1, action="created", actor=SYSTEM, data={}, pid=0, handled=False, env="main")
    ticking.reaches(logged, Held())
    assert [one.split(":")[0] for one in ran] == ["OnEverything", "OnTheType", "OnTheAction", "OnBoth"], \
        "the lane runs the old handlers widest pattern first, which is the order bus.patterns put them in"

    ran.clear()
    ticking.reaches(Event(id=2, at=1.0, type="message", n=1, action="updated", actor=SYSTEM, data={}, pid=0, handled=False, env="main"), Held())
    assert ran == ["OnEverything"], "a handler whose pattern the event does not name is not run, as the bus did not run it"

    told: list[tuple[str, str]] = []
    listening, BROKEN.entries = BROKEN.entries, []
    BROKEN.add(None, lambda record, title, brief: told.append((title, brief)))
    try:
        raises = lambda logged, record: 1 / 0  # noqa: E731
        raises.__qualname__ = "Raises"
        registered.add(Registration.read(HANDLE, OldEvent, BusListener(raises, "*", lambda record: True), ()))
        ticking.resolve()
        ran.clear()
        ticking.reaches(logged, Held())
        assert told and told[0][0] == "A tick on OldEvent failed", f"a handler that raises is told as a broken tick, not left to break the write: {told}"
    finally:
        BROKEN.entries = listening

    import features
    assert bus._dispatch.reaches.__self__ is __import__("framework.adapter", fromlist=["TICKING"]).TICKING, \
        "seating the features puts every told event on the lane; features.load is what wires it"
    assert features.FEATURES, "the features are seated in this run, so the assertion above is about the real wiring"


def test_a_write_made_inside_a_tick_is_caused_by_the_event_the_tick_is_handling():
    """The activity list shows a chain as a tree, which it can only do when the cause names an event rather than the actor who set it off."""
    from engine import bus
    from engine.record import Record
    from framework.adapter import BusListener, OldEvent, Ticking
    from receiving import HANDLE, Registration, Registrations
    from controllers.types import Todos
    from resources.base import SYSTEM, Event
    from tests.conftest import fresh

    scratch = fresh()
    record = Record(scratch.root, scratch.env, memo=True)
    registered = Registrations()
    writes = lambda logged, record: Todos(record, actor=SYSTEM).create("written by the handler")  # noqa: E731
    writes.__qualname__ = "WritesOnce"
    registered.add(Registration.read(HANDLE, OldEvent, BusListener(writes, "*", lambda record: True), ()))
    ticking = Ticking(registered, Registrations())
    ticking.resolve()

    logged = Event(id=71, at=1.0, type="todo", n=1, action="created", actor=SYSTEM, data={}, pid=0, handled=False, env=scratch.env)
    ticking.reaches(logged, record)
    assert len(Todos(record, actor=SYSTEM).rows.standing()) == 1, "the handler ran and wrote its row"
    written = [e for e in record.event_log.events() if e.type == "todo" and e.action == "created"][-1]
    assert written.data.get("caused_by") == "project:71:0:OldEvent", \
        f"a write made by a handler is caused by the engine's name for the event being handled, which names the lane and the run: {written.data.get('cause')}"
    assert bus.caused_by() == "", "and the name is the tick's alone: it is given back when the tick ends"


def test_a_3_0_registration_is_played_by_the_same_run_and_judged_by_the_same_words():
    """The four 3.0 kinds have an entry of their own, so a feature that moves keeps its promises checked.

    Without this the sweep would move a feature to listen, handle, answer or refuse and every promise it carries would
    stop being played, silently, with the suite still green because nothing ran.
    """
    from dataclasses import dataclass

    from events import Fact
    from expects import Answered, Dispatches, Given, Kept, Refused as RefusedOutcome, nothing
    from framework.loaded import FEATURES
    from expects.playing import wrong
    from framework.played import played
    from framework.promises import Promise
    from receiving import Answerer, Listener, Refuser
    from resources.base import Refused
    from tests import isolation

    @dataclass(frozen=True, kw_only=True)
    class TurnWritten(Fact):
        text: str

    @dataclass(frozen=True, kw_only=True)
    class TagFound(Fact):
        tag: str

    class TagsInText(Listener[TurnWritten]):
        def listen(self, event: TurnWritten) -> list[Fact]:
            return [TagFound(tag="reply")] if "[!" in event.text else []

    class RefuseAnEmptyTurn(Refuser[TurnWritten]):
        def refuse(self, event: TurnWritten) -> None:
            if not event.text.strip():
                raise Refused("say something")

    class SayItPlainly(Answerer[TurnWritten]):
        def answer(self, event: TurnWritten) -> str:
            return event.text.strip()

    import features
    features.load()
    feature = next(iter(FEATURES.values()))
    played_as = lambda kind, receiver, expectation: played(
        Promise(feature, kind, type(receiver).__name__, receiver, TurnWritten, (expectation,)), expectation, isolation.world())

    dispatching = Given(TurnWritten(text="[!reply:12] yes")) >> Dispatches(TagFound(tag="reply"))
    assert wrong(dispatching, played_as("listen", TagsInText(), dispatching)) == [], \
        "a listener is played through its own listen and the facts it dispatches are judged"
    quiet = Given(TurnWritten(text="plain words")) >> Dispatches(nothing)
    assert wrong(quiet, played_as("listen", TagsInText(), quiet)) == [], "a listener that recognises nothing dispatches nothing"
    missed = Given(TurnWritten(text="plain words")) >> Dispatches(TagFound(tag="reply"))
    assert wrong(missed, played_as("listen", TagsInText(), missed)) != [], "and a listener that does not keep its promise is caught"

    refusing = Given(TurnWritten(text="   ")) >> RefusedOutcome("say something")
    assert wrong(refusing, played_as("refuse", RefuseAnEmptyTurn(), refusing)) == [], "a refuser's reason is judged by the word that reads a refusal"
    letting = Given(TurnWritten(text="a turn")) >> Kept()
    assert wrong(letting, played_as("refuse", RefuseAnEmptyTurn(), letting)) == [], "and a write it lets through is kept"

    answering_it = Given(TurnWritten(text="  a turn  ")) >> Answered("a turn")
    assert wrong(answering_it, played_as("answer", SayItPlainly(), answering_it)) == [], "an answerer is read-only, so what it answers is the outcome"


def test_a_moved_feature_runs_on_the_lane_beside_an_adapted_one_and_each_runs_once():
    """The bridge: a receiver written for the 3.0 engine runs where the adapted 2.x handlers run.

    Before this the lane was built on the adapted registry alone, so a feature that moved was registered and never
    called - and the suite stayed green because nothing ran. The two registries stay apart, because the adapted ones
    are exempt by name from the boot walk's rules and the moved ones are not; the LANE reads both.
    """
    from framework.adapter import ADAPTED, TICKING, ordered_once_the_features_have_registered
    from receiving import REGISTERED

    import features
    features.load()
    ordered_once_the_features_have_registered()
    running = {(one.kind, one.feature, one.name) for one in TICKING.running.each}
    assert {(one.kind, one.feature, one.name) for one in ADAPTED.each} <= running, "every adapted handler runs on the lane"
    assert {(one.kind, one.feature, one.name) for one in REGISTERED.each} <= running, "and so does every receiver a feature wrote for the 3.0 engine"
    assert len(running) == len(TICKING.running.each), "each of them once, since a registration of one name replaces the one before it"


def test_a_moved_handler_hears_a_logged_event_as_its_catalogue_fact_and_not_while_its_feature_is_off():
    """A swept feature registers on a catalogue class, and the bus tells a logged event: the lane names one as the other, or a moved handler is registered and never run."""
    from engine.record import Record
    from events import Fact
    from events.agents import SENT, AgentMessageSent
    from framework.adapter import Ticking
    from receiving import HANDLE, Handler, Registration, Registrations
    from receiving.ticks import Lane, Services
    from resources.base import AGENT, SYSTEM, Event
    from tests.conftest import fresh

    import features
    features.load()
    scratch = fresh()
    record = Record(scratch.root, scratch.env, memo=True)
    received: list[AgentMessageSent] = []

    class Receives(Handler[AgentMessageSent]):
        def handle(self, event: AgentMessageSent) -> list[Fact]:
            received.append(event)
            return []

    moved = Registrations()
    moved.add(Registration.read(HANDLE, AgentMessageSent, Receives(), ["an expectation"], "chat_etiquette"))
    ticking = Ticking(Registrations(), moved)
    ticking.resolve()
    ticking.reaches(Event(id=1, at=1.0, type="agent", n=3, action=SENT, actor=AGENT, data={"text": "the answer", "turn": "t1"}, pid=0, handled=False, env=scratch.env), record)
    assert [(one.agent, one.text, one.turn) for one in received] == [(3, "the answer", "t1")], f"the logged event reaches the moved handler as the fact it registered on: {received}"

    received.clear()
    ticking.reaches(Event(id=2, at=1.0, type="todo", n=1, action="created", actor=SYSTEM, data={}, pid=0, handled=False, env=scratch.env), record)
    assert received == [], "an event the catalogue class does not name is not dispatched as it"

    Lane("project:3", moved, Services({}), record=record, switched_on=lambda feature: feature != "chat_etiquette").run(AgentMessageSent(agent=3, text="the answer"))
    assert received == [], "a receiver of a feature switched off for the lane's record is not run"


def test_a_moved_feature_runs_live_from_a_sent_turn_to_its_nudge_and_its_reminder_waits_for_its_trigger():
    """The first swept feature, played for real rather than in a Given: a turn the agent sends reaches its listener as the catalogue fact, the handler speaks through the feature's own chat, and a fact dispatched with due goes on only when the feature's trigger says so."""
    from controllers.types import Agents
    from engine import chat, ran
    from tests.conftest import fresh
    from tests.kit import nudges, report

    import features
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    agent = Agents(record, actor="system").by_session("claude-1")
    chat.send(record, agent, "Your message is answered. Now the terminal view.")
    chat.send(record, agent, "The header is fixed and committed.")
    assert [n for n in nudges(record) if "journal's workings" in n] == ['your chat talked about the journal\'s workings - "Your message is answered"'], \
        "the turn about the journal's workings is named back, as the feature's own line, and the plain one is not"

    reminded = lambda: [n for n in nudges(record) if n.startswith("chat etiquette")]  # noqa: E731
    for _ in range(19):
        ran.announce(record, agent.n, ran.DELIVERED, "2 new messages 314, 315")
    assert not reminded(), "nineteen journal lines are counted against the trigger and pass without a reminder"
    ran.announce(record, agent.n, ran.DELIVERED, "todo 5 next")
    assert len(reminded()) == 1, "the twentieth is due, so the fact goes on and the agent is reminded once"


def test_a_tagged_turn_runs_its_command_live_and_a_refused_one_keeps_its_words():
    """The sending path on the 3.0 engine, played for real: the turn is asked of the answerers before anything is written, told as written, and its tag's command runs on the lane, once per turn."""
    from controllers.types import Agents, Comments, Messages, Todos
    from engine import chat
    from resources.base import AGENT, USER
    from tests.conftest import fresh
    from tests.kit import nudges, report

    import features
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    agent = Agents(record, actor="system").by_session("claude-1")
    asked = Messages(record, actor=USER).create("are you there?")
    Messages(record, actor=AGENT).read(asked.n)
    shown = lambda: [m.brief for m in Messages(record, actor="system").all() if m.seen[:1] == ["agent"]]  # noqa: E731

    chat.send(record, agent, "Checking the build next.")
    chat.send(record, agent, f"[!reply:{asked.n}] yes, here")
    assert shown() == ["Checking the build next."], "a plain turn reaches the chat, and a reply is not copied into it"
    assert [c.title for c in Comments(record, actor="system").linked_to(asked.ref)] == ["yes, here"], "the reply tag ran its command"

    chat.send(record, agent, "[!reply:99999] this one cannot be written")
    assert shown()[-1] == "this one cannot be written", "a reply whose command was refused is not swallowed: its words reach the chat after all"
    assert any("reply" in n and "99999" in n for n in nudges(record)), f"and the refusal is named back to the agent: {nudges(record)}"

    chat.send(record, agent, '[!todo="Repeated work"] first')
    chat.send(record, agent, '[!todo="Repeated work"] first')
    assert [todo.title for todo in Todos(record, actor="system").all()] == ["Repeated work", "Repeated work"], "the same tag in two turns runs twice, once for each"


def test_a_turn_that_only_nods_at_a_journal_line_is_kept_out_of_the_chat_live():
    """Two answerers of one request, played for real: a nod at a journal line is kept out and filed as an acknowledgement, and a turn that tells the user something reaches the chat."""
    from controllers.types import Agents, Messages, Nudges
    from engine import chat
    from payload import JOURNAL
    from tests.conftest import fresh
    from tests.kit import report

    import features
    features.load()
    record = fresh()
    report(record, "idle", "Stop")
    agents = Agents(record, actor="system")
    row = agents.by_session("claude-1")
    reminder = Nudges(record, actor="system").create("a reminder")

    def answered(text):
        agents.update(row.n, prompted=JOURNAL, delivered=[f"nudge:{reminder.n}"])
        chat.send(record, agents.load(row.n), text)
        return [bool(m.data.get("acknowledgement")) for m in Messages(record).all() if m.brief == text]

    assert answered("Noted.") == [True], "a bare acknowledgement of a journal line is kept as a message the chat leaves out"
    assert answered("Which branch should I use for it?") == [False], "a question reaches the chat"


def test_a_tool_call_a_swept_feature_refuses_is_refused_at_the_gate():
    """The hook path asks the 3.0 request: an answerer of ToolCallAsked that refuses stops the call, with its own reason, before any 2.x policy is read."""
    from dataclasses import replace
    from events.answers import Allowed, Answer, Refused
    from events.asking import ToolCallAsked
    from engine import bus
    from engine.gates import HookCall
    from payload import BashCall
    from runner.gate import refused_by_a_feature
    from types import SimpleNamespace

    asked: list[ToolCallAsked] = []

    def answering(request, record) -> Answer:
        asked.append(request)
        return Refused(why="plan 4 is open") if "rm" in request.input else Allowed()

    was = bus._dispatch.asks
    bus.answered_by(answering)
    try:
        provider = SimpleNamespace(is_subagent=lambda hook: False)
        call = HookCall(provider, SimpleNamespace(), SimpleNamespace(tool=BashCall.from_payload("Bash", {"command": "rm -rf build"}, {}), cwd="/work/app"), SimpleNamespace(title="claude-1"))
        assert refused_by_a_feature(call) == "plan 4 is open", "a refusing answer is the gate's reason"
        assert refused_by_a_feature(replace(call, hook=SimpleNamespace(tool=BashCall.from_payload("Bash", {"command": "ls"}, {}), cwd="/work/app"))) is None, "and an allowed one refuses nothing"
        assert (asked[0].tool, asked[0].input, asked[0].session, asked[0].cwd, asked[0].subagent) == ("Bash", "rm -rf build", "claude-1", "/work/app", False), \
            "a shell call is asked by its command, for the session that made it, in the folder it runs in"
    finally:
        bus.answered_by(was)


def test_a_dispatch_a_swept_feature_refuses_is_refused_at_the_gate_with_the_dispatch_as_read():
    """A subagent dispatch is its own request: an answerer reads the dispatch as the provider read the call - its kind, its model and the models offered - and its refusal stops it."""
    from events.answers import Allowed, Answer, Refused
    from engine import bus
    from engine.gates import HookCall
    from payload import Dispatch
    from runner.gate import dispatch_refused
    from types import SimpleNamespace

    def answering(request, record) -> Answer:
        return Refused(why="name the model") if not request.model and request.model_supported else Allowed()

    was = bus._dispatch.asks
    bus.answered_by(answering)
    try:
        call = HookCall(SimpleNamespace(is_subagent=lambda hook: False), SimpleNamespace(), SimpleNamespace(), SimpleNamespace(title="claude-1"))
        assert dispatch_refused(call, Dispatch(kind="Explore", model=None, model_supported=True, models=("haiku", "sonnet"))) == "name the model", \
            "a dispatch that names no model where the provider takes one is refused with the answerer's reason"
        assert dispatch_refused(call, Dispatch(kind="Explore", model="haiku", model_supported=True)) is None, "and one that names it goes on"
    finally:
        bus.answered_by(was)


def test_an_answered_tool_call_is_told_on_the_lane_after_its_answer():
    """What writes about a tool call runs after the gate answered it: the hook path tells ToolCallAnswered, and a swept feature's handler of it hears what was asked and why it was refused."""
    from events import Fact
    from events.agents import ToolCallAnswered
    from framework.adapter import TICKING
    from providers import PROVIDERS
    from receiving import HANDLE, Handler, Registration
    from runner.hooks import handle
    from tests.conftest import fresh
    from tests.kit import report

    import features
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    received: list[ToolCallAnswered] = []

    class Receives(Handler[ToolCallAnswered]):
        def handle(self, event: ToolCallAnswered) -> list[Fact]:
            received.append(event)
            return []

    registration = Registration.read(HANDLE, ToolCallAnswered, Receives(), ["an expectation"], "chat_etiquette")
    TICKING.moved.add(registration)
    TICKING.resolve()
    try:
        handle(PROVIDERS["claude"](), record.root, record.env,
               {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": "ls"}})
    finally:
        TICKING.moved.forget(registration.kind, registration.feature, registration.name)
        TICKING.resolve()
    assert [(one.tool, one.input, one.why) for one in received] == [("Bash", "ls", "")], f"the call is told with what it asked, and no reason, since it may run: {received}"


def test_a_spaced_fact_is_held_back_from_its_lane_and_runs_on_its_own_when_its_span_is_up():
    """A fact dispatched with spaced is not run where it was dispatched: the lane hands it to whoever holds it back, which runs the newest one later, so a busy moment writes once and the last state still lands."""
    from dataclasses import dataclass, replace
    from events import Fact
    from receiving import HANDLE, LISTEN, Handler, Listener, Registration, Registrations
    from receiving.ticks import Lane, Services

    @dataclass(frozen=True, kw_only=True)
    class Reported(Fact):
        n: int

    @dataclass(frozen=True, kw_only=True)
    class BarStale(Fact):
        n: int

    ran: list[int] = []

    class SpotStaleBar(Listener[Reported]):
        def listen(self, event: Reported) -> list[Fact]:
            return [BarStale(n=event.n).spaced("bar", 1.0)]

    class DrawTheBar(Handler[BarStale]):
        def handle(self, event: BarStale) -> list[Fact]:
            ran.append(event.n)
            return []

    registered = Registrations()
    registered.add(Registration.read(LISTEN, Reported, SpotStaleBar(), ["an expectation"]))
    registered.add(Registration.read(HANDLE, BarStale, DrawTheBar(), ["an expectation"]))
    held: list[Fact] = []
    lane = Lane("project", registered, Services({}), held_back=lambda fact: held.append(fact) or True)
    for n in (1, 2, 3):
        lane.run(Reported(n=n))
    assert ran == [] and [one.n for one in held] == [1, 2, 3], "the lane runs none of them where they were dispatched, and hands each one over"
    Lane("later", registered, Services({})).run(replace(held[-1], spacing=()))
    assert ran == [3], "and the one run when the span is up is the newest, the last state landing"


def test_a_refuser_on_the_write_path_stops_a_controller_write_with_its_reason():
    """The refuse kind is live: before a controller writes, it asks RowWriting, a swept feature's refuser that refuses raises with its reason, and nothing is written."""
    import pytest
    from controllers.types import Todos
    from events.asking import RowWriting
    from receiving import REFUSE, REGISTERED, Refuser, Registration
    from resources.base import SYSTEM, Refused
    from tests.conftest import fresh

    class NoForbiddenTitles(Refuser[RowWriting]):
        def refuse(self, event: RowWriting) -> None:
            if event.type == "todo" and event.action == "create" and dict(event.fields).get("title") == "forbidden":
                raise Refused("that title is not for a to-do")

    import features
    features.load()
    record = fresh()
    registration = Registration.read(REFUSE, RowWriting, NoForbiddenTitles(), ["an expectation"], "chat_etiquette")
    REGISTERED.add(registration)
    try:
        todos = Todos(record, actor=SYSTEM)
        with pytest.raises(Refused, match="not for a to-do"):
            todos.create("forbidden")
        todos.create("allowed")
        assert [row.title for row in todos.all()] == ["allowed"], "the refused write left nothing, and the other went through"
    finally:
        REGISTERED.forget(registration.kind, registration.feature, registration.name)


def test_a_feature_registered_for_both_engines_is_refused_at_boot():
    """There is no skip to write: a swept feature registers no 2.x handler, so the only way to run twice is to register twice.

    A half-swept feature would put a handler on the bus and a receiver on the lane, and the lane runs both, so every
    handler of that feature would fire twice. The boot refuses it instead, naming both halves.
    """
    import pytest

    from framework.adapter import ADAPTED, HalfSwept, no_feature_is_half_swept
    from receiving import HANDLE, REGISTERED, Registration

    from dataclasses import dataclass

    from events import Fact
    from receiving import Handler, Listener

    @dataclass(frozen=True, kw_only=True)
    class TurnWritten(Fact):
        text: str

    class TagsInText(Listener[TurnWritten]):
        def listen(self, event: TurnWritten) -> list[Fact]:
            return []

    class RunTheTags(Handler[TurnWritten]):
        def handle(self, event: TurnWritten) -> list[Fact]:
            return []

    import features
    features.load()
    no_feature_is_half_swept()
    moved = Registration.read("listen", TurnWritten, TagsInText(), ["an expectation"], "command_tags")
    adapted = Registration.read(HANDLE, TurnWritten, RunTheTags(), ["an expectation"], "command_tags")
    REGISTERED.add(moved)
    ADAPTED.add(adapted)
    try:
        with pytest.raises(HalfSwept) as refusal:
            no_feature_is_half_swept()
        assert "command_tags" in str(refusal.value) and "fire twice" in str(refusal.value), \
            f"the refusal names the feature and why both halves cannot run: {refusal.value}"
    finally:
        REGISTERED.forget(moved.kind, moved.feature, moved.name)
        ADAPTED.forget(adapted.kind, adapted.feature, adapted.name)
    no_feature_is_half_swept()
