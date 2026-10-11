"""Doc 80's chapter 'The expects grammar' and src/expects must say the same thing.

Every word the chapter names is listed here by hand, on purpose: the lists are the chapter,
so a word added to one and not the other fails here rather than in a reader's head.
"""

from dataclasses import fields

import pytest

import expects
from expects import (Answered, Changed, Dispatches, Expectation, Formats, Given, Held, Kept, NotAnOutcome, Nudged,
                     Outcome, Outcomes, Printed, Ran, Refused, Unchanged, Updated, Wrote, answering, at, counting,
                     exited, nothing)

OUTCOME_WORDS = (Dispatches, Wrote, Updated, Printed, Ran, Refused, Changed, Kept, Unchanged, Formats, Nudged, Held, Answered)
GIVEN_ARGUMENTS = ("on", "rows", "settings", "clock", "ids", "chat", "commands", "files", "processes", "providers")
SERVICE_KINDS = ("rows", "chat", "files", "processes", "providers", "settings", "clock", "ids", "commands")


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


def test_each_request_says_how_its_answerers_answers_are_reduced():
    from receiving.answers import (Allowed, Asked, FirstRefusalWins, KeepingWins, Kept, NotTheRequestsAnswer,
                                   Refused, Rewritten, TextsCompose)

    class ToolCallAsked(Asked):
        reduces = FirstRefusalWins

    class AgentMessageSending(Asked):
        reduces = KeepingWins

    class TextFormatting(Asked):
        reduces = TextsCompose

    assert ToolCallAsked.answered([Allowed(), Refused(why="plan 4 is open"), Rewritten(text="rm -rf .")]) == Refused(why="plan 4 is open"), \
        "one refusal stops a tool call, whatever the answerers after it said"
    assert ToolCallAsked.answered([Rewritten(text="a"), Rewritten(text="b")]) == Rewritten(text="b") and ToolCallAsked.answered([]) == Allowed(), \
        "with nothing refusing, the rewrites compose in declared order and no answerer at all lets the call through"
    assert AgentMessageSending.answered([Rewritten(text="the brief"), Kept()]) == Kept(), \
        "a turn kept out of the chat wins, because its words belong to the row its tag writes"
    assert TextFormatting.answered([Rewritten(text="stripped")]) == Rewritten(text="stripped") and TextFormatting.answered([]) == Allowed(), \
        "formatting has no winning answer: each formatter reads what the one before it wrote"
    with pytest.raises(NotTheRequestsAnswer) as refusal:
        ToolCallAsked.answered(["allowed"])
    assert "not with str" in str(refusal.value), "an answerer that gives back something that is not an Answer is named, not quietly ignored"


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
    from receiving.boot import AsksForNothingKnown, AsksForWhatIsNotServed, WritesSynchronously, walked
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

    for broken, served, raises, why in (
        (registered(("answer", ToolCallAsked, HeldByGate())), {Chat, Clock}, WritesSynchronously, "is an answerer and writes Chat"),
        (registered(("handle", ToolCallAnswered, CountTheRefusal())), {Chat, Clock}, AsksForWhatIsNotServed, "serves to nobody"),
        (registered(("handle", ToolCallAnswered, AsksForAString())), {Chat, Clock}, AsksForNothingKnown, "is not a service"),
    ):
        with pytest.raises(raises) as refusal:
            walked(broken, served)
        assert why in str(refusal.value), f"the refusal names the receiver and what it asked for: {refusal.value}"
