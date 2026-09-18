from __future__ import annotations

from payloads.base import Field, Payload
from payloads.common import WherePayload


class StartPayload(WherePayload):
    subject = Field(str)


class NotePayload(Payload):
    text = Field(str)
    on = Field(str)


class EndPayload(Payload):
    subject = Field(str)
    force = Field(bool)
    todo = Field(bool)
    agent = Field(str, key="as")


class WaitPayload(Payload):
    what = Field(str)
    on = Field(str)
    minutes = Field(float, key="for")
    agent = Field(str)
    pid = Field(int)


class ParkPayload(Payload):
    why = Field(str)
    on = Field(str)
