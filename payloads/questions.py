from __future__ import annotations

from payloads.base import Field, Payload


class StorePayload(Payload):
    text = Field(str, verbatim=True)
    about = Field(list)
    description = Field(str, verbatim=True)
    options = Field(list)
    pick = Field(int)


class UpdatePayload(Payload):
    text = Field(str, verbatim=True)
    description = Field(str, verbatim=True)
    options = Field(list)
    pick = Field(int)


class RefPayload(Payload):
    ref = Field(str)
