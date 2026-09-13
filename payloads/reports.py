from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    title = Field(str)
    body = Field(str, verbatim=True)
    about = Field(str)
