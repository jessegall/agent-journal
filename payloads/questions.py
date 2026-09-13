from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    text = Field(str, verbatim=True)
    about = Field(list)


class RefPayload(Payload):
    ref = Field(str)
