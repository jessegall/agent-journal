from suites.coding.modules.workers.rules.context_full_error_compaction_rule import ContextFullErrorCompactionRule

PROMPT_TOO_LONG = {"error": "invalid_request", "last_assistant_message": "Prompt is too long", "error_details": "prompt is too long: 210000 tokens > 200000 maximum"}


def test_the_error_value_and_its_words_decide_a_full_context():
    assert ContextFullErrorCompactionRule.is_full_context(PROMPT_TOO_LONG)


def test_the_error_value_alone_is_no_full_context():
    assert not ContextFullErrorCompactionRule.is_full_context({"error": "invalid_request", "error_details": "the PDF is too large"})


def test_words_decide_when_the_error_value_is_missing():
    assert ContextFullErrorCompactionRule.is_full_context({"error_details": "Prompt is too long"})
    assert not ContextFullErrorCompactionRule.is_full_context({"error_details": "overloaded"})


def test_a_different_error_value_is_not_a_full_context_whatever_the_words():
    assert not ContextFullErrorCompactionRule.is_full_context({**PROMPT_TOO_LONG, "error": "authentication_failed"})
