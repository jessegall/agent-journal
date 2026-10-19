from journal.http.controllers.controller import Controller
from journal.http.model_fields import ModelFields
from journal.http.request import Request
from journal.http.response import Response
from journal.models.sequence import Sequence
from journal.models.trigger_action import TriggerAction
from journal.support.refused import Refused
from journal.repositories.sequences import Sequences
from journal.repositories.triggers import Triggers

TRIGGER = "trigger:"


class SequenceController(Controller[Sequence]):
    """Sequences with the trigger that starts each, if one does; what starts one and its steps are set from here."""

    def __init__(self, sequences: Sequences, triggers: Triggers) -> None:
        self.repository, self.triggers = sequences, triggers

    def shown_page(self, rows: list[Sequence]) -> list[dict]:
        return [{**ModelFields.of(s), "trigger_ids": [t.id for t in self.triggers.starting(s.title)]} for s in rows]

    def starts(self, request: Request) -> Response:
        """What starts a sequence: nothing but a hand, a row of a kind being created, written <table>.created, or a trigger, written trigger:<id>, which then starts it and nothing else; a start by hand or by a row takes the sequence off its triggers."""
        sequence, value = self.repository.find(request.number("id")), str(request.body.get("starts_on", ""))
        if value.startswith(TRIGGER):
            self.triggers.save(self.triggers.find(int(value.removeprefix(TRIGGER))).with_(action=TriggerAction.SEQUENCE, text=sequence.title), request.actor)
            return Response.json(self.shown(self.repository.save(sequence.with_(starts_on=""), request.actor)))
        if value and not value.endswith(".created"):
            raise Refused(f"a sequence starts by hand, when a row is created, written <table>.created, or by a trigger, written trigger:<id>; {value!r} is none of them")
        for trigger in self.triggers.starting(sequence.title):
            self.triggers.delete(trigger, request.actor)
        return Response.json(self.shown(self.repository.save(sequence.with_(starts_on=value), request.actor)))

    def steps(self, request: Request) -> Response:
        sequence = self.repository.find(request.number("id"))
        steps = tuple(str(step).strip() for step in request.body.get("steps", []) if str(step).strip())
        return Response.json(self.shown(self.repository.save(sequence.with_(steps=steps), request.actor)))
