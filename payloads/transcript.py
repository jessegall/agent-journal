from __future__ import annotations

from payloads.base import Field, Payload


class ChunkPayload(Payload):
    session = Field(str)
    before = Field(int)
    limit = Field(int)
    mode = Field(str)
    moment = Field(int)
