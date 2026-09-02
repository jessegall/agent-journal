"""The project's docs, catalogued: a doc is a folder of parts, and the journal knows them.

WHAT THIS IS FOR. A pin is a claim, a rule binds, a to-do is work. None of them holds a
FINDING — a design once it is ruled, a subagent's report, an investigation — and those
were living in the transcript, which compacts, or in the scratchpad, which the next
session cannot open. Read in a live project: a design written the moment it was ruled
("Ruled 2026-09-02" as its first line), then handed to five agents as their brief, then
cited by pins as "read this before touching X". That is what a doc is here.

A DOC IS A FOLDER, A PART IS A FILE. One big file is hard to scrap, edit or remove a
section of; a part is the unit of all three. A subagent's report lands as one part, a
section that turns out wrong is struck as one part, the rest stand. A single markdown
file is a doc with no parts, so an existing docs/ folder is adopted in place.

GLOBAL, LIKE RULES. Knowledge is the project's, not a track's; the track a doc came
from is recorded as provenance. Nothing is deleted: a struck part moves to struck/ with
its reason. Docs rot — a live project had five design files naming a class that no
longer existed, "a map of a system that isn't there" — so age is shown and one doc can
supersede another, which points every later reader at the current one.
"""
from __future__ import annotations

import re
from datetime import datetime, timezone
from pathlib import Path

import fmt
import state

DIR_SETTING = "docs_dir"
COUNTER = "docs_next"           # record key: the next doc number, never reused
INDEX = "index.md"
STRUCK = "struck"
FIELDS = ("n", "title", "abstract", "status", "track", "source", "at", "supersedes", "superseded_by", "adopted")
PART_FIELDS = ("title", "at", "source", "track")
_PART = re.compile(r"^(\d{2,})-(.+)\.md$")


def _slug(text: str, limit: int = 48) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:limit].rstrip("-") or "untitled"


def folder(root: Path) -> Path:
    from settings import load
    conf, _ = load(root)
    return root.parent / conf[DIR_SETTING]


# ------------------------------------------------------------------ frontmatter
def _parse(path: Path) -> tuple[dict, str]:
    text = path.read_text()
    meta: dict = {}
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            for line in text[4:end].splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
            text = text[end + 4:].lstrip("\n")
    return meta, text


def _write(path: Path, meta: dict, body: str, fields=FIELDS) -> None:
    lines = ["---"] + [f"{k}: {meta.get(k, '') or ''}" for k in fields
                       if meta.get(k, "") != "" or k in ("n", "title")] + ["---", ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + (body.strip() + "\n" if body.strip() else ""))


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _age(at: str) -> str:
    from pins import age
    return age(at) if at else ""


# ------------------------------------------------------------------ the catalogue
def _load(root: Path) -> list[dict]:
    """Every catalogued doc: folders with an index.md, and single files with frontmatter."""
    d = folder(root)
    if not d.is_dir():
        return []
    out = []
    for f in sorted(d.iterdir()):
        if f.is_dir() and (f / INDEX).is_file():
            meta, body = _parse(f / INDEX)
            if meta.get("n"):
                out.append({**meta, "n": int(meta["n"]), "body": body, "path": f / INDEX, "dir": f,
                            "parts": _parts(f)})
        elif f.is_file() and f.suffix == ".md":
            meta, body = _parse(f)
            if meta.get("pointer"):
                continue
            if meta.get("n"):
                out.append({**meta, "n": int(meta["n"]), "body": body, "path": f, "dir": None, "parts": []})
    return sorted(out, key=lambda x: x["n"])


def _parts(d: Path) -> list[dict]:
    out = []
    for f in sorted(d.iterdir()):
        m = _PART.match(f.name)
        if f.is_file() and m:
            meta, body = _parse(f)
            out.append({**meta, "p": int(m.group(1)), "slug": m.group(2), "body": body, "path": f,
                        "title": meta.get("title") or m.group(2).replace("-", " ")})
    return out


def uncatalogued(root: Path) -> list[Path]:
    """Markdown files and folders under docs/ the catalogue does not know."""
    d = folder(root)
    if not d.is_dir():
        return []
    out = []
    for f in sorted(d.iterdir()):
        if f.is_file() and f.suffix == ".md":
            meta, _ = _parse(f)
            if not meta.get("n") and not meta.get("pointer"):
                out.append(f)
        elif f.is_dir() and not (f / INDEX).is_file() and any(
                x.suffix == ".md" for x in f.iterdir() if x.is_file()):
            out.append(f)
    return out


def get(root: Path, ref: str) -> tuple[dict | None, dict | None, str]:
    """(doc, part or None, error) for a reference like `4` or `4.2`."""
    m = re.fullmatch(r"(\d+)(?:\.(\d+))?", (ref or "").strip())
    if not m:
        return None, None, f"a doc is referenced by number, like 4 or 4.2; got {ref!r}"
    n, p = int(m.group(1)), m.group(2)
    doc = next((d for d in _load(root) if d["n"] == n), None)
    if doc is None:
        return None, None, f"there is no doc {n}. `journal docs` lists them."
    if p is None:
        return doc, None, ""
    part = next((x for x in doc["parts"] if x["p"] == int(p)), None)
    if part is None:
        return doc, None, f"doc {n} has no part {int(p)}. `journal docs {n}` lists its parts."
    return doc, part, ""


def _next_number(root: Path) -> int:
    with state.locked(root):
        n = int(state.get(root, COUNTER, 0) or 0)
        known = max((d["n"] for d in _load(root)), default=0)
        n = max(n, known) + 1
        state.put(root, COUNTER, n)
    return n


# ------------------------------------------------------------------ writing
def add(root: Path, title: str, abstract: str, body: str, track: str, source: str = "") -> tuple[bool, str]:
    """A new doc: a folder with an index. The abstract is what every session is handed."""
    title = " ".join((title or "").split())
    abstract = " ".join((abstract or "").split())
    if not title:
        return False, 'a doc needs a title: journal docs add "<title>" --abstract "<one line>" --brief'
    if not abstract:
        return False, ('a doc needs an abstract — the one line every session is handed:\n'
                       '  journal docs add "<title>" --abstract "<what it settles, in one line>" --brief')
    for d in _load(root):
        if d.get("title", "").lower() == title.lower():
            return False, f"doc {d['n']} already has that title"
    n = _next_number(root)
    d = folder(root) / _slug(title)
    if d.exists():
        d = folder(root) / f"{_slug(title)}-{n}"
    meta = {"n": n, "title": title, "abstract": abstract, "status": "draft", "track": track,
            "source": source or "the agent", "at": _now()}
    _write(d / INDEX, meta, body)
    return True, (f"doc {n}: {title}\n  {d.relative_to(root.parent)}/{INDEX} — a draft; "
                  f"journal docs final {n} when it is")


def _to_folder(root: Path, doc: dict) -> dict:
    """A single-file doc becomes a folder; the file stays as a pointer so citations resolve."""
    if doc["dir"] is not None:
        return doc
    f = doc["path"]
    d = f.with_suffix("")
    d.mkdir(exist_ok=True)
    meta = {k: doc.get(k, "") for k in FIELDS}
    _write(d / INDEX, meta, doc["body"])
    f.write_text(f"---\npointer: {d.name}/{INDEX}\n---\n\nMoved to `{d.name}/{INDEX}` when it gained "
                 f"parts. `journal docs {doc['n']}` reads it.\n")
    return {**doc, "path": d / INDEX, "dir": d, "parts": []}


def part(root: Path, ref: str, title: str, body: str, track: str, source: str = "") -> tuple[bool, str]:
    title = " ".join((title or "").split())
    if not title:
        return False, 'a part needs a title: journal docs part <n> "<title>" --brief'
    if not (body or "").strip():
        return False, "a part needs a body — pass it on stdin with --brief"
    doc, _, err = get(root, ref)
    if doc is None:
        return False, err
    doc = _to_folder(root, doc)
    p = max((x["p"] for x in doc["parts"]), default=0)
    struck = doc["dir"] / STRUCK
    if struck.is_dir():
        p = max([p] + [int(m.group(1)) for x in struck.iterdir() if (m := _PART.match(x.name))])
    p += 1
    path = doc["dir"] / f"{p:02d}-{_slug(title)}.md"
    _write(path, {"title": title, "at": _now(), "source": source or "the agent", "track": track},
           body, PART_FIELDS)
    return True, f"doc {doc['n']}.{p}: {title}\n  {path.relative_to(root.parent)}"


def replace(root: Path, ref: str, body: str, track: str, source: str = "") -> tuple[bool, str]:
    doc, prt, err = get(root, ref)
    if doc is None or prt is None:
        return False, err or f"replace wants a part, like {ref}.1"
    if not (body or "").strip():
        return False, "a replacement needs a body — pass it on stdin with --brief"
    _strike_file(doc, prt, "replaced")
    _write(prt["path"], {"title": prt["title"], "at": _now(), "source": source or "the agent",
                         "track": track}, body, PART_FIELDS)
    return True, f"doc {doc['n']}.{prt['p']} replaced; the old body is in {STRUCK}/"


def _strike_file(doc: dict, prt: dict, why: str) -> Path:
    struck = doc["dir"] / STRUCK
    struck.mkdir(exist_ok=True)
    meta = {k: prt.get(k, "") for k in PART_FIELDS}
    meta["struck"] = f"{_now()} — {why}"
    dst = struck / prt["path"].name
    _write(dst, meta, prt["body"], PART_FIELDS + ("struck",))
    prt["path"].unlink()
    return dst


def strike(root: Path, ref: str, why: str) -> tuple[bool, str]:
    why = " ".join((why or "").split())
    if not why:
        return False, 'say why: journal docs strike <n>.<p> "<why it no longer holds>"'
    doc, prt, err = get(root, ref)
    if doc is None or prt is None:
        return False, err or f"strike wants a part, like {ref}.1 — a whole doc is superseded, not struck"
    dst = _strike_file(doc, prt, why)
    return True, f"struck doc {doc['n']}.{prt['p']}: {prt['title']}\n  kept at {dst.relative_to(root.parent)}"


def set_status(root: Path, ref: str, status: str) -> tuple[bool, str]:
    doc, _, err = get(root, ref)
    if doc is None:
        return False, err
    meta = {k: doc.get(k, "") for k in FIELDS}
    meta["status"] = status
    _write(doc["path"], meta, doc["body"])
    return True, f"doc {doc['n']} is {status}: {doc['title']}"


def supersede(root: Path, old_ref: str, new_ref: str) -> tuple[bool, str]:
    old, _, err = get(root, old_ref)
    if old is None:
        return False, err
    new, _, err = get(root, new_ref)
    if new is None:
        return False, err
    if old["n"] == new["n"]:
        return False, "a doc cannot supersede itself"
    m = {k: old.get(k, "") for k in FIELDS}
    m["superseded_by"] = str(new["n"])
    _write(old["path"], m, old["body"])
    m = {k: new.get(k, "") for k in FIELDS}
    m["supersedes"] = str(old["n"])
    _write(new["path"], m, new["body"])
    return True, f"doc {old['n']} is superseded by doc {new['n']}; readers of {old['n']} are pointed there"


def adopt(root: Path, track: str) -> list[str]:
    """Catalogue what docs/ already holds: frontmatter for each, an abstract from its first paragraph."""
    out = []
    for f in uncatalogued(root):
        if f.is_dir():
            files = sorted(x for x in f.iterdir() if x.is_file() and x.suffix == ".md")
            first = files[0]
            n = _next_number(root)
            _, body0 = _parse(first)
            title = _title_of(body0) or f.name.replace("-", " ")
            _write(f / INDEX, {"n": n, "title": title, "abstract": _abstract_of(body0), "status": "final",
                               "track": track, "source": "adopted", "at": _now(), "adopted": _now()}, "")
            for i, x in enumerate(files, 1):
                _, body = _parse(x)
                dst = f / f"{i:02d}-{_slug(x.stem)}.md"
                _write(dst, {"title": _title_of(body) or x.stem.replace("-", " "), "at": _now(),
                             "source": "adopted", "track": track}, body, PART_FIELDS)
                x.unlink()
            out.append(f"  + doc {n}: {title} — folder, {len(files)} part(s)")
            continue
        _, body = _parse(f)
        n = _next_number(root)
        title = _title_of(body) or f.stem.replace("-", " ")
        _write(f, {"n": n, "title": title, "abstract": _abstract_of(body), "status": "final",
                   "track": track, "source": "adopted", "at": _now(), "adopted": _now()}, body)
        out.append(f"  + doc {n}: {title}")
    return out or ["  = every file under docs/ is catalogued"]


def _title_of(body: str) -> str:
    for line in body.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return ""


def _abstract_of(body: str, limit: int = 240) -> str:
    paras = [p for p in body.split("\n\n") if p.strip() and not p.lstrip().startswith("#")]
    if not paras:
        return "(no abstract yet — journal docs abstract <n> \"…\" gives it one)"
    text = " ".join(paras[0].split()).replace("**", "")
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"


def set_abstract(root: Path, ref: str, abstract: str) -> tuple[bool, str]:
    abstract = " ".join((abstract or "").split())
    if not abstract:
        return False, 'journal docs abstract <n> "<one line>"'
    doc, _, err = get(root, ref)
    if doc is None:
        return False, err
    meta = {k: doc.get(k, "") for k in FIELDS}
    meta["abstract"] = abstract
    _write(doc["path"], meta, doc["body"])
    return True, f"doc {doc['n']}: {abstract}"


# ------------------------------------------------------------------ what cites a doc
def cited_by(root: Path, n: int) -> list[str]:
    """Every pin, rule and to-do that references doc n, on any track."""
    import todo
    import tracks
    key = str(n)

    def hit(ref: str) -> bool:
        return ref == key or ref.startswith(key + ".")

    hits = []

    def scan(items, label, track=None):
        for i, p in enumerate(items, 1):
            if not p.get("struck") and hit(str(p.get("doc") or "")):
                hits.append(f"{label} {i}" + (f" on track {track}" if track else "") + f": {p['fact'][:70]}")

    scan(state.get(root, "rules", []) or [], "rule")
    here = tracks.current(root)
    scan(state.get(root, "pins", []) or [], "pin", here)
    for name, held in (state.get(root, "tracks", {}) or {}).items():
        scan(held.get("pins", []), "pin", name)
    for t in todo.open_items(root, here):
        if hit(str(t.get("doc") or "")):
            hits.append(f"to-do {t['n']} on track {here}: {t['title'][:70]}")
    return hits


def ref_label(root: Path, ref: str) -> str:
    """'doc 4: title' or 'doc 4.2: part title', for showing beside a citing entry."""
    doc, prt, _ = get(root, ref)
    if doc is None:
        return f"doc {ref} (missing)"
    return f"doc {doc['n']}.{prt['p']}: {prt['title']}" if prt else f"doc {doc['n']}: {doc['title']}"


def check_ref(root: Path, ref: str) -> str | None:
    """The reason a --doc reference cannot be taken, or None."""
    if not ref:
        return None
    doc, prt, err = get(root, ref)
    if doc is None or (prt is None and "." in ref):
        return err
    return None


# ------------------------------------------------------------------ rendering
def catalogue(root: Path, width: int = 88) -> str:
    docs = _load(root)
    if not docs:
        return "  No docs are catalogued."
    out = []
    for d in docs:
        meta = [d.get("status", "draft")]
        if d["parts"]:
            meta.append(f"{len(d['parts'])} part(s)")
        if _age(d.get("at", "")):
            meta.append(_age(d.get("at", "")))
        if d.get("superseded_by"):
            meta.append(f"SUPERSEDED by doc {d['superseded_by']}")
        entry = fmt.numbered(d["n"], d["title"], " · ".join(meta), struck=bool(d.get("superseded_by")),
                             width=width)
        entry += "\n" + fmt.wrap(d.get("abstract", ""), indent=5, width=width)
        out.append(entry)
    return "\n\n".join(out)


def show(root: Path, ref: str, width: int = 88) -> tuple[bool, str]:
    doc, prt, err = get(root, ref)
    if doc is None or (prt is None and "." in ref):
        return False, err
    if prt:
        out = [fmt.title(f"DOC {doc['n']}.{prt['p']}", sub=prt["title"]),
               "  " + fmt.dim(f"of doc {doc['n']}: {doc['title']} · {prt.get('source', '')} · "
                              f"{_age(prt.get('at', ''))} · {prt['path'].relative_to(root.parent)}"), ""]
        out.append(prt["body"].rstrip())
        return True, "\n".join(out)
    meta = [doc.get("status", "draft"), f"track {doc.get('track', '')}", doc.get("source", ""),
            f"written {_age(doc.get('at', ''))}"]
    out = [fmt.title(f"DOC {doc['n']}", sub=doc["title"]),
           "  " + fmt.dim(" · ".join(m for m in meta if m)),
           "  " + fmt.dim(str(doc["path"].relative_to(root.parent)))]
    if doc.get("superseded_by"):
        out.append(fmt.section("superseded"))
        out.append(fmt.wrap(f"Doc {doc['superseded_by']} replaces this one. Read that instead: "
                            f"journal docs {doc['superseded_by']}"))
    if doc.get("supersedes"):
        out.append("  " + fmt.dim(f"supersedes doc {doc['supersedes']}"))
    out.append(fmt.section("abstract"))
    out.append(fmt.wrap(doc.get("abstract", ""), width=width))
    if doc["body"].strip():
        out.append("")
        out.append(doc["body"].rstrip())
    for p in doc["parts"]:
        out.append(fmt.section(f"{doc['n']}.{p['p']}  {p['title']}"))
        out.append("  " + fmt.dim(f"{p.get('source', '')} · {_age(p.get('at', ''))} · "
                                  f"{p['path'].relative_to(root.parent)}"))
        out.append("")
        out.append(p["body"].rstrip())
    cites = cited_by(root, doc["n"])
    if cites:
        out.append(fmt.section("cited by"))
        out.extend(f"  {c}" for c in cites)
    out.append("")
    rows = [(f'journal docs part {doc["n"]} "<title>" --brief', "add a part from stdin")]
    if doc["parts"]:
        rows.append((f'journal docs strike {doc["n"]}.<p> "<why>"', "drop a part, on the record"))
    rows.append((f"journal docs {'final' if doc.get('status') != 'final' else 'draft'} {doc['n']}",
                 "change its status"))
    out.append(fmt.commands(rows))
    return True, "\n".join(out)


def carry(root: Path, cap: int = 20) -> str:
    """The catalogue a session start hands over: number, title, abstract; drafts marked."""
    docs = [d for d in _load(root) if not d.get("superseded_by")]
    if not docs:
        return ""
    lines = []
    for d in docs[:cap]:
        mark = "  (draft)" if d.get("status") != "final" else ""
        lines.append(f"  {d['n']:>3}  {d['title']}{mark}\n       {d.get('abstract', '')}")
    more = f"\n  … and {len(docs) - cap} more; `journal docs` lists them." if len(docs) > cap else ""
    return (f"DOCS OF THIS PROJECT, {len(docs)} catalogued — read one before you re-investigate what "
            "it settles; `journal docs <n>` reads it, `journal docs search <term>` finds a line:\n"
            + "\n".join(lines) + more)


def search_lines(root: Path) -> list[tuple[str, str, int, str]]:
    """(reference, title, line number, text) for every line of every doc and part."""
    out = []
    for d in _load(root):
        for i, line in enumerate(d["body"].splitlines(), 1):
            out.append((str(d["n"]), d["title"], i, line))
        for p in d["parts"]:
            for i, line in enumerate(p["body"].splitlines(), 1):
                out.append((f"{d['n']}.{p['p']}", p["title"], i, line))
    return out
