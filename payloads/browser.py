from __future__ import annotations

from payloads.base import Field, Payload


class AskPayload(Payload):
    op = Field(str)
    target = Field(str)
    text = Field(str)


class ResultPayload(Payload):
    ok = Field(bool)
    text = Field(str)
    files = Field(object)


class DriverPayload(Payload):
    on = Field(bool)
    url = Field(str)
    title = Field(str)
