"""Answering a request: the answerers run, the request reduces what they said, and the answer leaves.

Nothing here writes and nothing here ticks. The fact that follows the answer is dispatched on the
session's lane afterwards, and everything that writes about it is a handler there, so a hook never
waits on work that was never its to do.
"""

from collections.abc import Callable

from events import Request
from events.answers import Allowed, Answer, Rewritten
from receiving import ANSWER, Registrations
from receiving.ticks import Services


class AnswersNothing(TypeError):
    @classmethod
    def of(cls, request: type) -> "AnswersNothing":
        return cls(f"{request.__name__} does not say how it is answered; a request names the rule it reduces its answerers' answers by")


def answered(request: Request, registered: Registrations, services: Services, switched_on: Callable[[str], bool] = lambda feature: True) -> Answer:
    """The one answer that leaves. The answerers of the features switched on run in declared order, read-only, and the request reduces what they said once."""
    reduce = getattr(type(request), "answered", None)
    if reduce is None:
        raise AnswersNothing.of(type(request))
    said = []
    for one in registered.of(ANSWER):
        if one.event is not type(request) or not switched_on(one.feature):
            continue
        answer = one.receiver.answer(request, **services.given(one.name, one.feature, type(one.receiver).wants()))
        if isinstance(answer, Rewritten):
            request = request.rewritten(answer.text)
        said.append(answer)
    return reduce([one for one in said if one is not None]) if said else Allowed()
