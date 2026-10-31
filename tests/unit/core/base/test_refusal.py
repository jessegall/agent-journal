from core.base.guard.guard_refusal import GuardRefusal
from core.base.missing_rows import MissingRows
from core.base.refusal import Refusal


def test_a_refusal_says_its_reason_and_the_line_that_works():
    assert Refusal("task 12 is closed", "journal task reopen 12").text == "task 12 is closed: journal task reopen 12"
    assert Refusal("task 12 is closed").text == "task 12 is closed"


def test_not_found_names_the_noun_and_every_missing_id():
    assert MissingRows("task", (12, 14)).text == "no task 12, 14: journal task list shows what there is"


def test_a_guard_refusal_names_its_guard_and_its_skip_flag_only_when_it_has_one():
    reason = Refusal("message 5 already has your reply 9", "send it again only if it adds something new")
    assert GuardRefusal("messages.one-reply-per-message", reason, "--confirm").text == (
        "refused by messages.one-reply-per-message: message 5 already has your reply 9: send it again only if it adds something new (to pass it: --confirm)")
    assert GuardRefusal("core.lifecycle", Refusal("task 12 is completed, so it cannot start"), "").text == "refused by core.lifecycle: task 12 is completed, so it cannot start"


def test_a_guard_refusal_is_a_refusal():
    assert isinstance(GuardRefusal("core.lifecycle", Refusal("no"), ""), Refusal)
