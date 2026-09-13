from __future__ import annotations

from payloads.base import Field, Payload


class ReminderPayload(Payload):
    text = Field(str)
    until = Field(str)
