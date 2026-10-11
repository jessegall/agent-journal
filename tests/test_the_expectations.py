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
