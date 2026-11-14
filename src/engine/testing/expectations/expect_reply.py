from engine.driver.hook_reply import HookReply
from engine.testing.expectations.text_match import ExpectedText, contains_line, contains_text


def expect_reply_line(reply: HookReply, *texts: ExpectedText) -> None:
    missing = [text for text in texts if not contains_line(reply.lines, text)]
    assert not missing, f"the hook's lines {list(reply.lines)} hold none of {missing}"


def expect_absent_reply_line(reply: HookReply, *texts: ExpectedText) -> None:
    matching = [text for text in texts if contains_line(reply.lines, text)]
    assert not matching, f"the hook's lines {list(reply.lines)} hold {matching}"


def expect_reply_refusal(reply: HookReply, reason: ExpectedText) -> None:
    assert contains_text(reply.refusal, reason), f"the hook's refusal {reply.refusal!r} does not say {reason!r}"


def expect_absent_reply_refusal(reply: HookReply, reason: ExpectedText) -> None:
    assert not contains_text(reply.refusal, reason), f"the hook's refusal {reply.refusal!r} says {reason!r}"


def expect_reply_allowed(reply: HookReply) -> None:
    assert not reply.refusal, f"the hook was refused: {reply.refusal}"
