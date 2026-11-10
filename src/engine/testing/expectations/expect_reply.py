from engine.driver.hook_reply import HookReply


def expect_reply_line(reply: HookReply, *texts: str) -> None:
    missing = [text for text in texts if not any(text in line for line in reply.lines)]
    assert not missing, f"the hook's lines {list(reply.lines)} hold none of {missing}"


def expect_absent_reply_line(reply: HookReply, *texts: str) -> None:
    matching = [text for text in texts if any(text in line for line in reply.lines)]
    assert not matching, f"the hook's lines {list(reply.lines)} hold {matching}"


def expect_reply_refusal(reply: HookReply, reason: str) -> None:
    assert reason in reply.refusal, f"the hook's refusal {reply.refusal!r} does not say {reason!r}"


def expect_absent_reply_refusal(reply: HookReply, reason: str) -> None:
    assert reason not in reply.refusal, f"the hook's refusal {reply.refusal!r} says {reason!r}"


def expect_reply_allowed(reply: HookReply) -> None:
    assert not reply.refusal, f"the hook was refused: {reply.refusal}"
