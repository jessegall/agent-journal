from dataclasses import dataclass

from resources.base import Refused

TONES = ("", "note", "good", "warn", "danger", "muted")


@dataclass(frozen=True)
class NodeSpec:
    props: tuple[str, ...]
    required: tuple[str, ...] = ()
    holds_children: bool = False
    items: tuple[str, ...] = ()


NODES = {
    "stack": NodeSpec(("gap",), holds_children=True),
    "row": NodeSpec(("gap", "wrap"), holds_children=True),
    "grid": NodeSpec(("columns", "gap"), holds_children=True),
    "card": NodeSpec(("title", "note", "open"), holds_children=True),
    "heading": NodeSpec(("text", "level"), ("text",)),
    "divider": NodeSpec(()),
    "stat": NodeSpec(("label", "value", "note", "tone", "open"), ("label", "value")),
    "bars": NodeSpec(("title", "items", "unit"), ("items",), items=("label", "value", "note", "tone", "open")),
    "table": NodeSpec(("columns", "rows"), ("columns", "rows"), items=("cells", "open", "tone")),
    "list": NodeSpec(("items",), ("items",), items=("label", "note", "badge", "tone", "open")),
    "text": NodeSpec(("body",), ("body",)),
    "fact": NodeSpec(("label", "body"), ("label", "body")),
    "badge": NodeSpec(("text", "tone"), ("text",)),
    "code": NodeSpec(("text", "language"), ("text",)),
    "file": NodeSpec(("path", "line", "label"), ("path",)),
}


def checked(document) -> dict:
    if not isinstance(document, dict):
        raise Refused("a dashboard is a JSON object with title, start and pages")
    pages = document.get("pages")
    if not isinstance(pages, dict) or not pages:
        raise Refused("pages: an object of pages by id, at least one")
    start = document.get("start") or next(iter(pages))
    if start not in pages:
        raise Refused(f"start: {start!r} is not one of the pages")
    for name, page in pages.items():
        where = f"pages.{name}"
        if not isinstance(page, dict) or "view" not in page:
            raise Refused(f"{where}: a page is an object with a title and a view")
        node(page["view"], f"{where}.view", pages)
    return {**document, "start": start}


def node(given, where: str, pages: dict) -> None:
    if not isinstance(given, dict) or given.get("type") not in NODES:
        raise Refused(f"{where}: a node is an object whose type is one of {', '.join(NODES)}")
    spec = NODES[given["type"]]
    known = {"type", "children", *spec.props}
    for key in given:
        if key not in known:
            raise Refused(f"{where}: {given['type']} has no {key!r}; it takes {', '.join(sorted(known - {'type'}))}")
    for key in spec.required:
        if key not in given:
            raise Refused(f"{where}: {given['type']} needs {key!r}")
    if given.get("tone", "") not in TONES:
        raise Refused(f"{where}: tone is one of {', '.join(t for t in TONES if t)}")
    opened(given.get("open"), where, pages)
    if "children" in given and not spec.holds_children:
        raise Refused(f"{where}: {given['type']} holds no children")
    for i, child in enumerate(given.get("children") or []):
        node(child, f"{where}.children[{i}]", pages)
    for i, item in enumerate(given.get("items") or given.get("rows") or []):
        entry(item, spec, f"{where}.{'rows' if given['type'] == 'table' else 'items'}[{i}]", pages)


def entry(item, spec: NodeSpec, where: str, pages: dict) -> None:
    if not isinstance(item, dict):
        raise Refused(f"{where}: an item is an object with {', '.join(spec.items)}")
    for key in item:
        if key not in spec.items:
            raise Refused(f"{where}: an item has no {key!r}; it takes {', '.join(spec.items)}")
    if item.get("tone", "") not in TONES:
        raise Refused(f"{where}: tone is one of {', '.join(t for t in TONES if t)}")
    opened(item.get("open"), where, pages)


def opened(target, where: str, pages: dict) -> None:
    if target is not None and target not in pages:
        raise Refused(f"{where}: open names page {target!r}, which the dashboard does not have")
