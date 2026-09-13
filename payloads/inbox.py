from __future__ import annotations

from payloads.base import Field, Payload


class ProcessPayload(Payload):
    part = Field(str)
    became = Field(list)
