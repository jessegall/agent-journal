from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    subject = Field(str)
    title = Field(str)
    decision = Field(str)
    when = Field(str)
    body = Field(str, verbatim=True)


class UpdatePayload(Payload):
    title = Field(str)
    decision = Field(str)
    when = Field(str)
