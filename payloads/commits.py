from __future__ import annotations

from payloads.base import Field, Payload


class ShowPayload(Payload):
    sha = Field(str)
