from __future__ import annotations

from payloads.base import Field, Payload


class AgentPayload(Payload):
    agent = Field(str)
    kind = Field(str)
    transcript = Field(bool)
    after = Field(int)
    limit = Field(int)
