from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    name = Field(str)
    title = Field(str)
    summary = Field(str)
    usage = Field(str)
    when = Field(str)
    entry = Field(str)
    body = Field(str, verbatim=True)


class UpdatePayload(Payload):
    title = Field(str)
    summary = Field(str)
    usage = Field(str)
    when = Field(str)
    entry = Field(str)
