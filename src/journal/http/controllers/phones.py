from datetime import datetime, timezone

from journal.features.phone.support.pairing import Pairing
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.repositories.phones import Phones
from journal.support.actor_kind import ActorKind
from journal.support.refused import Refused
from journal.support.response import Response


class PhoneController:
    """The desk's side of the phone: a code to pair one, the phone paired now, without its key, and its disconnection."""

    def __init__(self, pairing: Pairing, phones: Phones) -> None:
        self.pairing, self.phones = pairing, phones

    def connect(self, request: Request) -> Response:
        offer = self.pairing.offer(int(request.body.get("days", 7)), request.actor, datetime.now(timezone.utc))
        return Response.json({"link": offer.link, "short": offer.short, "address": offer.address, "until": offer.until.isoformat()})

    def index(self, request: Request) -> Response:
        live = self.phones.live(datetime.now(timezone.utc))
        return Response.json({"phones": [{key: value for key, value in ModelFields.of(phone).items() if key != "key"} for phone in live]})

    def disconnect(self, request: Request) -> Response:
        """The phone stops being paired at once, from the desk; only the user disconnects it."""
        if request.actor.kind != ActorKind.USER:
            raise Refused("only the user disconnects a phone")
        phone = self.phones.anywhere(int(request.params["id"]))
        self.phones.save(phone.ended(datetime.now(timezone.utc)), request.actor)
        return Response.json({"disconnected": phone.id})
