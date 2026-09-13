from __future__ import annotations

from payloads.base import Field, Payload


class SearchPayload(Payload):
    term = Field(str, verbatim=True)
    all = Field(bool)
    page = Field(int, 1)
    session = Field(str)
