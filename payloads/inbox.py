from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    text = Field(str, verbatim=True)
    files = Field(object)
    kind = Field(str)


class FilePayload(Payload):
    name = Field(str)
    into = Field(str)


class DetachPayload(Payload):
    name = Field(str)
    why = Field(str)


class AttachPayload(Payload):
    files = Field(object)


class ReplyPayload(Payload):
    text = Field(str, verbatim=True)
    part = Field(str)
    follow_up = Field(str)
    options = Field(object)
    pick = Field(int)


class ProcessPayload(Payload):
    part = Field(str)
    became = Field(list)
    in_env = Field(str, key="in")
