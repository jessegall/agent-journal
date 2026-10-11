"""The fourth generated run: it plays every expectation every registration carries.

Nothing here is written by hand about any one feature. The features say what they promise where they
register, this boots them once and plays each promise through the entry the engine really uses, and a
failure is named feature/registration/index so it names the promise rather than a line number.

The tests below it are the grammar's own self-check: that the words a chapter of doc 80 names are the
words the code exports, and that the engine they are played through does what the chapter says.
"""

from dataclasses import fields

import pytest

import expects
from expects import (Answered, Changed, Dispatches, Expectation, Formats, Given, Held, Kept, NotAnOutcome, Nudged,
                     Outcome, Outcomes, Printed, Ran, Refused, Removed, Unchanged, Updated, Wrote, answering, at, counting,
                     exited, nothing)

OUTCOME_WORDS = (Dispatches, Wrote, Removed, Updated, Printed, Ran, Refused, Changed, Kept, Unchanged, Formats, Nudged, Held, Answered)
GIVEN_ARGUMENTS = ("on", "rows", "settings", "remembered", "transcript", "held", "hook", "clock", "ids", "chat", "commands", "files", "processes", "providers")
SERVICE_KINDS = ("rows", "chat", "files", "processes", "providers", "settings", "clock", "ids", "commands")


def promised():
    """Every expectation every feature carries, each with the name its failure is reported under."""
    import features
    from features.promises import PROMISED
    features.load()
    return [pytest.param(one, expectation, id=one.called(n)) for one, n, expectation in PROMISED.played()]


@pytest.mark.parametrize("promise,expectation", promised())
def test_the_registration_does_what_it_promises(promise, expectation):
    from expects.entries import played
    from expects.playing import wrong
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
    from receiving import (REGISTERED, Answerer, ExpectsNothing, Handler, Listener, NotAReceiver, ReceivesAnother,
                           ReceivesNothing, Refuser, Registration)

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

    REGISTERED.clear()
    for one in read:
        REGISTERED.add(one)
    assert len(REGISTERED.of("handle")) == 1 and len(REGISTERED.on(MessageTagged)) == 2, \
        "the registrations are kept in declaration order and read back by kind and by event"
    REGISTERED.clear()


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
    from features.adapter import CannotBeAdapted, OldHandler, moved
    from features.parts import Handler as OldStyle
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

    class RunTagCommands(OldStyle):
        def handle(self, context, event):
            minded.append("this must never run")

    registered = Registrations()
    registered.add(Registration.read("handle", TodoCreated, OldHandler(None, MindTheBoard()), [], "tickets"))
    out = Lane("project", registered, Services({TheRecord: "the tick's record"})).run(TodoCreated(n=7))

    assert minded == [(7, "the tick's record")], \
        "a 2.x handler runs as a handler of its event, against a Context built over the tick's own record"
    assert [type(one).__name__ for one in out] == ["TodoCreated"], \
        "it dispatches nothing itself: what it wrote reaches the engine as the funnel's own resource facts"
    walked(registered, set()), "the adapter is exempt from the boot rules by declaring itself adapted, not by a name the checker knows"

    with pytest.raises(CannotBeAdapted) as refusal:
        OldHandler(None, RunTagCommands())
    assert "a request and not a fact" in str(refusal.value), \
        "a handler on the sending path cannot be adapted at all, which is why those features are swept first"

    assert [one.says() for one in moved(["plans", "tickets"], {"tickets": ("MindTheBoard",)})] == \
        ["plans: moved", "tickets: adapted (MindTheBoard)"], "the listing says, per feature, moved or adapted"


def test_every_registration_gathers_what_it_promises_and_each_outcome_word_reads_the_play_itself():
    import features
    from expects import Given, Nudged, Printed, Ran, Refused, Unchanged, Wrote, answering, at, counting, exited
    from expects.playing import NotAnswered, Seen, World, wrong
    from features.promises import PROMISED

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


def test_a_feature_that_registers_an_owing_kind_without_expects_refuses_the_boot_only_when_the_walk_is_on():
    from types import SimpleNamespace
    from expects import Given, Unchanged
    from features.promises import Owing, Promise, Promises

    def promised(*registrations):
        promises = Promises()
        for kind, name, expects in registrations:
            promises.add(Promise(SimpleNamespace(name="demo"), kind, name, None, object, expects))
        return promises

    quiet = promised(("handler", "Quiet", ()))
    quiet.refuse_owing("demo")
    quiet.required = True
    with pytest.raises(Owing, match="feature demo registers handler Quiet without expects"):
        quiet.refuse_owing("demo")
    quiet.refuse_owing("other")  # a feature is refused for its own registrations only
    ready = promised(("handler", "Quiet", (Given("x") >> Unchanged(),)), ("handler", "SendOnTheClock", ()), ("append_to_line", "answered", ()), ("route", "get_page", ()))
    ready.required = True
    ready.refuse_owing("demo")  # a registration with expects, the engine's own two, a line appender and a route owe nothing


def test_a_service_nobody_serves_is_refused_by_name_rather_than_left_out():
    from expects import NoSuchService
    from expects.playing import World

    world = World.of(Given("x"))
    assert set(world.given_to({"chat": object, "clock": object})) == {"chat", "clock"}, "a service the play serves is handed over"
    with pytest.raises(NoSuchService, match="'ledger'"):
        world.given_to({"chat": object, "ledger": object})
