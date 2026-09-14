from __future__ import annotations

from payloads.base import Field, Payload


class KeepPayload(Payload):
    days = Field(int)


class StorePayload(Payload):
    title = Field(str)
    body = Field(str, verbatim=True)
    about = Field(str)
