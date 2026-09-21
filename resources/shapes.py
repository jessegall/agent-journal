from typing import ClassVar

import json

from resources.base import Field, Refused, names

TEXT, NUMBER, FLAG, LIST = "text", "number", "flag", "list"
KINDS = {TEXT: str, NUMBER: (int, float), FLAG: bool, LIST: list}


def typed(value):
    if not isinstance(value, str):
        return value
    try:
        return json.loads(value) if value[:1] in "[{" or value in ("true", "false") or value.lstrip("-").replace(".", "", 1).isdigit() else value
    except ValueError:
        return value


LEVELS = {"low": 50, "default": 100, "high": 150, "critical": 200}


def rows(**columns: str) -> dict:
    return {"rows": columns}



def check(name: str, spec, value):
    if isinstance(spec, dict):
        if not isinstance(value, list) or not all(isinstance(v, dict) for v in value):
            raise Refused(f"{name} is a list of rows")
        for row in value:
            for column, kind in spec["rows"].items():
                if column in row:
                    check(f"{name}.{column}", kind, row[column])
        return value
    if spec == LIST and isinstance(value, str):
        value = [word.strip() for word in value.split(",") if word.strip()]
    if spec == NUMBER and isinstance(value, str) and value.lower() in LEVELS:
        value = LEVELS[value.lower()]
    if not isinstance(value, KINDS[spec]) or isinstance(value, bool) and spec != FLAG:
        raise Refused(f"{name} is a {spec}")
    return value


def normalize_options(value):
    if not isinstance(value, list):
        return value
    normalized = []
    for option in value:
        if not isinstance(option, dict):
            normalized.append(option)
            continue
        raw = option
        option = {k: v for k, v in raw.items() if k not in ("label", "value")}
        title = option.get("title") or raw.get("label")
        if not title:
            raise Refused("options.title is required")
        option["title"] = title
        if "code" not in option and "value" in raw:
            option["code"] = raw["value"]
        normalized.append(option)
    return normalized


class Shape:
    fields: ClassVar[dict] = {}
    labels: ClassVar[dict] = {}

    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        cls.fields = {k: v.spec for base in reversed(cls.__mro__) for k, v in vars(base).items() if isinstance(v, Field) and v.spec}
        cls.labels = {k: v for base in reversed(cls.__mro__) for k, v in vars(base).get("labels", {}).items()}


OPTION = names("title", "description", "code")


class Options(Shape):
    options = Field(rows(title=TEXT, description=TEXT, code=TEXT), list)
    pick = Field(NUMBER)


class Reasoned(Shape):
    keywords = Field(LIST, list)
    labels = {"brief": "Reasoning", "outcome": "Why struck"}




class Ranked(Shape):
    priority = Field(NUMBER)
    labels = {"priority": "Priority"}


CHANGE = names("path", "added", "removed", "created")
COMMIT = names("sha", "subject")


class Traced(Shape):
    changed = Field(rows(path=TEXT, added=NUMBER, removed=NUMBER, created=FLAG), list)
    commits = Field(rows(sha=TEXT, subject=TEXT), list)
