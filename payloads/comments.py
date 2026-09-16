from __future__ import annotations

from payloads.base import Field, Payload
from payloads.common import ListingPayload


class ListPayload(ListingPayload):
    about = Field(str)


class StorePayload(Payload):
    about = Field(str)
    text = Field(str, verbatim=True)


class DonePayload(Payload):
    how = Field(str)
    became = Field(list)
