from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    title = Field(str)
    goal = Field(str)
    body = Field(str, verbatim=True)


class PhasePayload(Payload):
    title = Field(str)
    when = Field(str)
    checkpoint = Field(bool)


class TodosPayload(Payload):
    phase = Field(int)
    todos = Field(list)
    off = Field(bool)
    reopen = Field(str)


class FromDocPayload(Payload):
    doc = Field(str)


class AutoPayload(Payload):
    on = Field(bool)


class LinkPayload(Payload):
    ref = Field(str)
