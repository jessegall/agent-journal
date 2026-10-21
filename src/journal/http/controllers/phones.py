from datetime import datetime, timezone

from journal.features.phone.support.phone_connector import PhoneConnector
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.repositories.phones import Phones
from journal.support.response import Response


class PhoneController:
    """The desk's side of the phone: a code to pair one, the phone paired now, without its key, and its disconnection."""

    def __init__(self, pairing: PhoneConnector, phones: Phones) -> None:
        self.pairing, self.phones = pairing, phones

    def connect(self, request: Request) -> Response:
        suggestion = self.pairing.proposal(int(request.body.get("days", 7)), request.actor, datetime.now(timezone.utc))
        return Response.json({"link": suggestion.link, "short": suggestion.short, "address": suggestion.address, "until": suggestion.expires_at.isoformat()})

    def index(self, request: Request) -> Response:
        present = self.phones.active(datetime.now(timezone.utc))
        return Response.json({"phones": [{key: value for key, value in ModelFields.build(phone).items() if key != "key"} for phone in present]})

    def disconnect(self, request: Request) -> Response:
        phone = self.pairing.disconnect(self.phones.all_phones(int(request.params["id"])), request.actor, datetime.now(timezone.utc))
        return Response.json({"disconnected": phone.id})
