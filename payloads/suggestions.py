from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    title = Field(str)
    body = Field(str, verbatim=True)
    about = Field(list)
    despite = Field(int)
    because = Field(str)


class UpdatePayload(Payload):
    title = Field(str)
    body = Field(str, verbatim=True)


class NotePayload(Payload):
    note = Field(str)


class ChangePayload(Payload):
    change = Field(str, verbatim=True)


class RefPayload(Payload):
    ref = Field(str)
