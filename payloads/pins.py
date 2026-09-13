from __future__ import annotations

from payloads.base import Field
from payloads.common import WherePayload


class StorePayload(WherePayload):
    fact = Field(str)
    supersedes = Field(int)
    doc = Field(str)
    body = Field(str, verbatim=True)


class UpdatePayload(WherePayload):
    fact = Field(str)
    body = Field(str, verbatim=True)
