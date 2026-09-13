from __future__ import annotations

from payloads.base import Field, Payload


class ListingPayload(Payload):
    all = Field(bool)
    cap = Field(int)
    page = Field(int, 1)
    order = Field(str)
    sort = Field(str)
    direction = Field(str)


class WhyPayload(Payload):
    why = Field(str)


class MovePayload(Payload):
    environment = Field(str)


class TextPayload(Payload):
    text = Field(str, verbatim=True)


class AnswerPayload(Payload):
    answer = Field(str, verbatim=True)


class SectionPayload(Payload):
    title = Field(str)
    body = Field(str, verbatim=True)


class WherePayload(Payload):
    where = Field(dict)
