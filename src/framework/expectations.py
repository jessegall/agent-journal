"""What each feature promises, in words: every expectation its registrations carry, said as the Settings page and the skill the agent reads show them."""

from expects.words import humanly, said
from framework.promises import PROMISED, Promise
from receiving import REGISTERED

AGENT_FACING = ("Nudged", "Whispered", "Held")
"""The outcomes that are about the agent: what it is told, and when its writes wait."""
ASKS_ABOUT_THE_AGENT = ("ToolCallAsked", "AgentDispatching", "AgentMessageSending", "HookResponding")
"""The requests whose answer reaches the agent: a call refused, a dispatch refused, a turn kept out of the chat, a text handed over."""


def promises_of(feature: str) -> list[Promise]:
    return [*(one for one in PROMISED.each if one.feature.name == feature), *(Promise.of(one) for one in REGISTERED.each if one.feature == feature)]


def concerns_the_agent(expectation) -> bool:
    outcomes = [type(one).__name__ for one in expectation.outcomes.each]
    asked = type(expectation.given.on).__name__
    return any(name in AGENT_FACING for name in outcomes) or (asked in ASKS_ABOUT_THE_AGENT and "Refused" in outcomes + [type(getattr(one, "answer", None)).__name__ for one in expectation.outcomes.each])


SAID: dict = {}


def words_of(feature: str, agent_only: bool = False) -> list[str]:
    """Each promise of the feature as one line: the registration, then given what it meets, what it does. A line said twice is said once. The promises do not change while the features stay loaded, so they are said once for as many as there are."""
    key = (feature, agent_only, len(PROMISED.each), len(REGISTERED.each))
    if key not in SAID:
        SAID[key] = said_lines(feature, agent_only)
    return SAID[key]


def said_lines(feature: str, agent_only: bool) -> list[str]:
    lines = []
    for promise in promises_of(feature):
        for expectation in promise.expects:
            if agent_only and not concerns_the_agent(expectation):
                continue
            line = f"{humanly(promise.name)}: {said(expectation)}"
            if line not in lines:
                lines.append(line)
    return lines
