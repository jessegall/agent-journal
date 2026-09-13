from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    text = Field(str, verbatim=True)
    files = Field(object)


class FilePayload(Payload):
    name = Field(str)
    into = Field(str)


class ProcessPayload(Payload):
    part = Field(str)
    became = Field(list)
