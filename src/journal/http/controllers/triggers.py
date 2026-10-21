from journal.http.controllers.controller import Controller
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.triggers import Triggers


class TriggerController(Controller[Trigger]):
    """Words that make the journal act when they come up, and what it does."""

    def __init__(self, triggers: Triggers) -> None:
        self.repository = triggers

    def update(self, request: Request) -> Response:
        trigger, body = self.repository.find(request.number("id")), request.body
        action = TriggerAction(body["action"]) if body.get("action") in {item.value for item in TriggerAction} else trigger.action
        phrases = tuple(str(w).strip() for w in body.get("phrases", trigger.phrases) if str(w).strip())
        return Response.json(self.repository.save(trigger.with_(action=action, phrases=phrases, text=body.get("text", trigger.text)), request.actor))
