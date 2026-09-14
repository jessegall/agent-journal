from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    text = Field(str)
    about = Field(str)
