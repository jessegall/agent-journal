from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    text = Field(str)
    tone = Field(str)
    link = Field(str)
    label = Field(str)
