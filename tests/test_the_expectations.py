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
