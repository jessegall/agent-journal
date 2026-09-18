from typing import ClassVar

from v2.resources.base import Refused

TEXT, NUMBER, FLAG = "text", "number", "flag"
KINDS = {TEXT: str, NUMBER: (int, float), FLAG: bool}


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
    if not isinstance(value, KINDS[spec]) or isinstance(value, bool) and spec != FLAG:
        raise Refused(f"{name} is a {spec}")
    return value


class Shape:
    fields: ClassVar[dict] = {}
    labels: ClassVar[dict] = {}

    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        cls.fields = {k: v for base in reversed(cls.__mro__) for k, v in vars(base).get("fields", {}).items()}
        cls.labels = {k: v for base in reversed(cls.__mro__) for k, v in vars(base).get("labels", {}).items()}


class Options(Shape):
    fields = {"options": rows(title=TEXT, description=TEXT, code=TEXT), "pick": NUMBER}


class Reasoned(Shape):
    labels = {"brief": "Reasoning", "outcome": "Why struck"}
