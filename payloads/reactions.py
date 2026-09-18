from __future__ import annotations

from payloads.base import Field, Payload


class ReactPayload(Payload):
    turn = Field(str)
    face = Field(str)
