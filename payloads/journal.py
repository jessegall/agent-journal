from __future__ import annotations

from payloads.base import Field, Payload


class SettingsPayload(Payload):
    auto = Field(bool)
