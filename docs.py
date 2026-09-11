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

GLOBAL, LIKE RULES. Knowledge is the project's, not an environment's; the environment a doc came
from is recorded as provenance. Nothing is deleted: a struck part moves to struck/ with
its reason. Docs rot — a live project had five design files naming a class that no
longer existed, "a map of a system that isn't there" — so age is shown and one doc can
supersede another, which points every later reader at the current one.
"""
from __future__ import annotations

import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path

import fmt
import state

DIR_SETTING = "docs_dir"
COUNTER = "docs_next"           # record key: the next doc number, never reused
INDEX = "index.md"
STRUCK = "struck"
FILES = "files"                 # a doc's attachments: any file or folder, copied in, listed in a manifest
MANIFEST = "manifest.json"
FIELDS = ("n", "title", "abstract", "status", "track", "source", "at", "supersedes", "superseded_by", "adopted")

#: WHAT `track:` MEANS ON A DOC, and it is a SCOPE now rather than a note about where the
#: doc came from.
#:
#: IT WAS PROVENANCE AND IT WAS ALREADY DRIFTING. The field recorded which line of work a
#: doc came out of and nothing filtered by it, so every environment was handed every doc —
#: in one real project, eighty-four titles at every session start, almost none of them about
#: the work in front of the reader. Meanwhile `cleanup` had quietly started reading it to
#: decide what to flag. This codebase has never kept a field inert; a field that describes
#: something always ends up deciding something.
#:
#: GLOBAL IS A SCOPE, NOT AN ABSENCE. `journal docs add --global` writes GLOBAL here, and a
#: doc with no track at all is treated the same — which is what every doc written before
#: this release has, and they must all stay visible everywhere. So the migration is nothing:
#: the empty value already means what it needs to mean.
#:
#: AND A SCOPED DOC IS STILL READABLE FROM ANYWHERE, by number. That is the whole reason
#: scope is a property of the DOC rather than a filter on the store: a rule binds every
#: environment and may cite a doc, so a citation that stops resolving outside one
#: environment would make `--doc=` a trap. Scope decides what is LISTED, never what can be
#: read.
GLOBAL = "*"


def scope_of(doc: dict) -> str:
    """The environment a doc belongs to, or GLOBAL. An unset track has always meant global."""
    got = (doc.get("track") or "").strip()
    return got if got and got != GLOBAL else GLOBAL


def scope_text(doc: dict) -> str:
    """A doc's scope in the words a reader uses — for every renderer, not one.

    THE CATALOGUE NEVER SAID IT AT ALL and `show` said it wrong. `show` interpolated the raw
    field, so a global doc read "environment " with nothing after it, or "environment *" —
    and a reader cannot tell "global" from "the renderer said nothing", which is the same
    ambiguity an omitted section has. `journal docs` said nothing either way, so the one
    command whose job is to show you the docs could not answer whether one was the
    project's or this environment's.
    """
    got = scope_of(doc)
    return "the project's" if got == GLOBAL else f"environment {got}"


def here(doc: dict, track: str) -> bool:
    """Is this doc one that `track` should be shown? Its own, or the project's."""
    got = scope_of(doc)
    return got == GLOBAL or got == track
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
    _CATALOGUE.clear()   # a doc changed: whatever was read before this is now a guess
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
#: str(docs folder) -> (its mtime_ns, the catalogue). ONE PROCESS, and dropped by any write.
#:
#: `_load` opens every index.md and every part body in the project. `ref_label` calls `get`,
#: `get` calls `_load`, and `pins.carry` calls `ref_label` once per doc-citing entry — so a
#: consumer with 78 docs and 27 citing rules read the whole catalogue 27 times to build ONE
#: context block: 218ms on a hook event, against a 68ms whole CLI run. Nothing between those
#: 27 reads can change a doc, and every write from this module drops the entry, so a part
#: added mid-process is seen. The folder's mtime catches a doc added by anybody else.
_CATALOGUE: dict = {}


def _load(root: Path) -> list[dict]:
    """Every catalogued doc: folders with an index.md, and single files with frontmatter."""
    d = folder(root)
    if not d.is_dir():
        return []
    key = str(d)
    try:
        stamp = d.stat().st_mtime_ns
    except OSError:
        stamp = 0
    hit = _CATALOGUE.get(key)
    if hit is not None and hit[0] == stamp:
        return hit[1]
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
    out = sorted(out, key=lambda x: x["n"])
    _CATALOGUE[key] = (stamp, out)
    return out


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


def all_docs(root: Path) -> list[dict]:
    """The whole catalogue — the public entry point `_load` is read through."""
    return _load(root)


def by_name(root: Path, name: str) -> tuple[dict | None, str]:
    """The doc called `name`: its title, case-insensitive; else the one title containing it."""
    key = " ".join((name or "").split()).lower()
    if not key:
        return None, "a doc is referenced by number or by name; got nothing"
    docs = _load(root)
    hits = [d for d in docs if d["title"].lower() == key or _slug(d["title"]) == _slug(key)]
    if not hits:
        hits = [d for d in docs if key in d["title"].lower()]
    if len(hits) == 1:
        return hits[0], ""
    if not hits:
        return None, f"no doc is called {name!r}. `journal docs` lists them."
    return None, f"{name!r} could be " + " or ".join(f"doc {d['n']} ({d['title']})" for d in hits[:6]) + " — say which"


#: A HEADING INSIDE A DOC OR A PART: `4.2#the-measurements`. The citation used to stop at
#: the part, and a part of any size has `## sections` inside it — so the reader was handed a
#: chapter and left to find the paragraph, which is the problem parts themselves were added
#: to solve, one level down.
_ANCHOR = re.compile(r"^(?P<ref>[^#]*)#(?P<head>.+)$")


def slug_of(text: str) -> str:
    """A heading's slug: what a citation spells, and what a heading is matched by."""
    return re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")


def headings(root: Path, ref: str) -> list[str]:
    """Every `##` heading in what `ref` names, in order — the titles, not the slugs."""
    doc, prt, _ = get(root, ref)
    if doc is None:
        return []
    path = prt["path"] if prt else (doc["dir"] / INDEX if doc.get("dir") else None)
    if path is None or not Path(path).is_file():
        return []
    return [l.lstrip("#").strip() for l in Path(path).read_text().splitlines()
            if re.match(r"^#{2,3} +\S", l)]


def anchor(root: Path, ref: str) -> tuple[str, str, str]:
    """(the ref without its anchor, the heading's title, the refusal) for `<ref>#<slug>`.

    REFUSED WHEN THE HEADING IS NOT THERE, and the refusal names the ones that are. A
    citation that silently points at nothing is the failure this package refuses everywhere
    else — and a slug is exactly the kind of thing that is mistyped once and never checked.
    """
    m = _ANCHOR.match((ref or "").strip())
    if not m:
        return ref, "", ""
    base, want = m.group("ref").strip(), slug_of(m.group("head"))
    found = {slug_of(h): h for h in headings(root, base)}
    if want in found:
        return base, found[want], ""
    if not found:
        return base, "", f"doc {base} has no headings to cite; drop the `#{m.group('head')}`"
    return base, "", (f"doc {base} has no heading `{m.group('head')}`. It has: "
                      + ", ".join(f"#{s}" for s in found))


def get(root: Path, ref: str) -> tuple[dict | None, dict | None, str]:
    """(doc, part or None, error) for a reference like `4`, `4.2`, `4.2#a-heading`, or a name."""
    ref = _ANCHOR.match((ref or "").strip()).group("ref").strip() if "#" in (ref or "") else ref
    m = re.fullmatch(r"(\d+)(?:\.(\d+))?", (ref or "").strip())
    if not m:
        doc, err = by_name(root, ref)
        if doc is None:
            # `<name>.<p>`: the part of a doc named before the dot
            nm = re.fullmatch(r"(.+)\.(\d+)", (ref or "").strip())
            if nm:
                named, _ = by_name(root, nm.group(1))
                if named is not None:
                    return get(root, f"{named['n']}.{nm.group(2)}")
            return None, None, err
        return doc, None, ""
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


# ------------------------------------------------------------------ attachments
def _manifest(doc: dict) -> list[dict]:
    if doc.get("dir") is None:
        return []
    f = doc["dir"] / FILES / MANIFEST
    if not f.is_file():
        return []
    try:
        got = json.loads(f.read_text())
        return [x for x in got if isinstance(x, dict) and x.get("name")] if isinstance(got, list) else []
    except ValueError:
        return []


def _save_manifest(doc: dict, items: list[dict]) -> None:
    (doc["dir"] / FILES).mkdir(exist_ok=True)
    (doc["dir"] / FILES / MANIFEST).write_text(json.dumps(items, indent=2) + "\n")


def attachments(doc: dict) -> list[dict]:
    """The doc's attachments that are still there: manifest entries with their file present."""
    if doc.get("dir") is None:
        return []
    out = []
    for a in _manifest(doc):
        p = doc["dir"] / FILES / a["name"]
        if p.exists():
            out.append({**a, "path": p, "size": _size(p), "dir": p.is_dir()})
    return out


def _size(p: Path) -> int:
    if p.is_file():
        return p.stat().st_size
    return sum(x.stat().st_size for x in p.rglob("*") if x.is_file())


def _human(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.0f} {unit}" if unit == "B" else f"{n:.1f} {unit}"
        n /= 1024
    return f"{n:.1f} GB"


def attach(root: Path, ref: str, src: str, title: str, track: str, source: str = "",
           replace: bool = False) -> tuple[bool, str]:
    """Copy a file or a folder into the doc, and list it with what it is.

    A DOC IS NOT ONLY PROSE. A design's HTML, a screenshot, a PDF the user was sent, a CSV
    behind a finding: the doc is where they belong, beside the parts that explain them,
    and copied — the original lives wherever it lives and may not tomorrow. Nothing is
    read into the journal: the file is kept, listed by name with one line saying what it
    is, and `journal docs <n>` prints its path for whoever wants to open it.
    """
    doc, _, err = get(root, ref)
    if doc is None:
        return False, err
    p = Path(src).expanduser()
    if not p.is_absolute():
        p = Path.cwd() / p
    if not p.exists():
        return False, f"there is no file at {src}"
    doc = _to_folder(root, doc)
    dst_dir = doc["dir"] / FILES
    if p.resolve() == dst_dir.resolve() or dst_dir.resolve() in p.resolve().parents:
        return False, f"{src} is already inside doc {doc['n']}'s files; `journal docs index` lists it"
    name = p.name
    dst = dst_dir / name
    items = _manifest(doc)
    if dst.exists():
        if not replace:
            return False, (f"doc {doc['n']} already has {name} — `--replace` to swap it (the old one is "
                           f"kept under {STRUCK}/), or attach it under another name by copying it first")
        _strike_attachment(doc, name, "replaced", items)
        items = [x for x in items if x.get("name") != name]
    dst_dir.mkdir(exist_ok=True)
    if p.is_dir():
        shutil.copytree(p, dst)
    else:
        shutil.copy2(p, dst)
    title = " ".join((title or "").split()) or name
    items.append({"name": name, "title": title, "from": str(p), "at": _now(), "source": source or "the agent",
                  "track": track})
    _save_manifest(doc, items)
    kind = "folder" if dst.is_dir() else _human(_size(dst))
    return True, f"doc {doc['n']} · {name}: {title} ({kind})\n  {dst.relative_to(root.parent)}"


def _strike_attachment(doc: dict, name: str, why: str, items: list[dict]) -> Path:
    src = doc["dir"] / FILES / name
    struck = doc["dir"] / STRUCK / FILES
    struck.mkdir(parents=True, exist_ok=True)
    dst = struck / name
    if dst.exists():
        stamp = _now().replace(":", "").replace("-", "")[:15]
        dst = struck / f"{stamp}-{name}"
    shutil.move(str(src), str(dst))
    entry = next((x for x in items if x.get("name") == name), {"name": name})
    log = struck / MANIFEST
    kept = []
    if log.is_file():
        try:
            kept = json.loads(log.read_text())
        except ValueError:
            kept = []
    kept.append({**entry, "kept_as": dst.name, "struck": f"{_now()} — {why}"})
    log.write_text(json.dumps(kept, indent=2) + "\n")
    return dst


def detach(root: Path, ref: str, name: str, why: str) -> tuple[bool, str]:
    why = " ".join((why or "").split())
    if not why:
        return False, 'say why: journal docs detach <n> <name> "<why it no longer belongs>"'
    doc, _, err = get(root, ref)
    if doc is None:
        return False, err
    have = [a for a in attachments(doc) if a["name"] == name]
    if not have:
        return False, f"doc {doc['n']} has no attachment named {name}; `journal docs {doc['n']}` lists them"
    items = _manifest(doc)
    dst = _strike_attachment(doc, name, why, items)
    _save_manifest(doc, [x for x in items if x.get("name") != name])
    return True, f"detached {name} from doc {doc['n']}\n  kept at {dst.relative_to(root.parent)}"


def _tree(p: Path, cap: int = 40) -> list[str]:
    """The files inside a folder attachment, indented by depth; the tail elided past `cap`."""
    rows = []
    for x in sorted(p.rglob("*")):
        if x.name.startswith("."):
            continue
        depth = len(x.relative_to(p).parts) - 1
        rows.append("  " * depth + x.name + ("/" if x.is_dir() else f"  {_human(x.stat().st_size)}"))
    if len(rows) > cap:
        rows = rows[:cap] + [f"… and {len(rows) - cap} more"]
    return rows


def _attachment_lines(root: Path, files: list[dict]) -> list[str]:
    """One table: the name, what it is; under it what kind, who, when, where; a folder's files."""
    rows = []
    for a in files:
        if a["dir"]:
            inside = [x for x in a["path"].rglob("*") if x.is_file() and not x.name.startswith(".")]
            kind = f"folder of {len(inside)} file(s), {_human(a['size'])}"
        else:
            kind = _human(a["size"])
        rows.append((a["name"] + ("/" if a["dir"] else ""), a["title"]))
        rows.append(("", f"{kind} · added by {a.get('source', '')} {_age(a.get('at', ''))}"))
        rows.append(("", str(a["path"].relative_to(root.parent))))
        if a["dir"]:
            for r in _tree(a["path"]):
                lead = len(r) - len(r.lstrip(" "))
                name, _, size = r.strip().partition("  ")
                rows.append(("  " + " " * lead + name, size))
        rows.append(("", ""))
    return [fmt.table(rows[:-1])] if rows else []


def list_attachments(root: Path, ref: str = "", width: int | None = None) -> tuple[bool, str]:
    """Every attachment of one doc, or of every doc: name, what it is, size, where."""
    width = fmt.room(width)
    if ref:
        doc, _, err = get(root, ref)
        if doc is None:
            return False, err
        chosen = [doc]
    else:
        chosen = _load(root)
    out = []
    total = 0
    for d in chosen:
        files = attachments(d)
        if not files:
            continue
        total += len(files)
        out.append(fmt.section(f"doc {d['n']}  {d['title']}"))
        out.append("")
        out.extend(_attachment_lines(root, files))
    if not out:
        where = f"doc {chosen[0]['n']} has" if ref else "no doc has"
        return True, (f"  {where} no attachments. `journal docs attach <n> <path> \"<what it is>\"` "
                      "copies a file or a folder in.")
    head = fmt.title("ATTACHMENTS", sub=f"{total} file(s)" + (f" of doc {chosen[0]['n']}" if ref else f" across {len([d for d in chosen if attachments(d)])} doc(s)"))
    return True, head + "\n" + "\n".join(out)


def adopt_attachments(root: Path) -> list[str]:
    """Files copied into a doc's files/ by hand are listed, by name, as what they are."""
    out = []
    for doc in _load(root):
        if doc.get("dir") is None:
            continue
        fd = doc["dir"] / FILES
        if not fd.is_dir():
            continue
        known = {a["name"] for a in _manifest(doc)}
        items = _manifest(doc)
        for f in sorted(fd.iterdir()):
            if f.name == MANIFEST or f.name in known or f.name.startswith("."):
                continue
            items.append({"name": f.name, "title": f.name, "from": "", "at": _now(), "source": "adopted", "track": doc.get("track", "")})
            out.append(f"  + doc {doc['n']} · {f.name} (say what it is: journal docs attach {doc['n']} … or edit files/{MANIFEST})")
        if len(items) != len(known):
            _save_manifest(doc, items)
    return out


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
        return False, 'a doc needs a title: journal docs add "<title>" --abstract="<one line>" --brief'
    if not abstract:
        return False, ('a doc needs an abstract — the one line every session is handed:\n'
                       '  journal docs add "<title>" --abstract="<what it settles, in one line>" --brief')
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


def move(root: Path, ref: str, dst: str) -> tuple[bool, str]:
    """Change a doc's SCOPE: to another environment, or to the project with `--global`.

    ONLY THE FIELD MOVES, and that is the point. Its number, its folder and its parts stay
    exactly where they are, so every citation of it keeps working from every environment —
    a rule binds all of them and may cite a doc, so a citation that stopped resolving
    outside one environment would make `--doc=` a trap. Scope decides what is LISTED.
    """
    import state as _state
    to_global = dst in ("--global", "global", GLOBAL)
    dst = GLOBAL if to_global else _state.slug(dst)
    if not dst:
        return False, ('say where: `journal docs move <n> "<environment>"`, or '
                       "`journal docs move <n> --global` to give it to the project")
    doc, prt, err = get(root, ref)
    if doc is None:
        return False, err
    if prt is not None:
        return False, "a part belongs to its doc — move the doc"
    was = scope_of(doc)
    was_said = "the project" if was == GLOBAL else f"`{was}`"
    meta = {k: doc.get(k, "") for k in FIELDS}
    meta["track"] = dst
    _write(doc["path"], meta, doc["body"])
    now_said = "the project — every environment lists it" if to_global else f"`{dst}`"
    return True, (f"doc {doc['n']} belongs to {now_said} now (was {was_said}): {doc['title']}\n"
                  "  it was always readable from anywhere by number, and still is — scope is "
                  "what a catalogue LISTS")


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
    out += adopt_attachments(root)
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
def cited_by_rows(root: Path, n: int) -> list[dict]:
    """Every pin, rule and to-do that references doc n, on ANY environment, as
    structured rows — {kind, env, n, text}, env=None for a rule. `cited_by` below
    is the text form built from this; a web page turns a row into a link instead
    (a rule to /rules, a pin to its environment's pins, a to-do to its own page) —
    the SAME rows, never re-parsed back out of the formatted string.

    EVERY ENVIRONMENT, INCLUDING FOR TO-DOS. The pin scan already walked
    `tracks._all(root)`; the to-do scan used to check only `tracks.current(root)`,
    so a to-do citing this doc on any OTHER environment was invisible here despite
    the docstring's own claim. Walking to-dos the same way the pins loop already
    does is the fix, not a new behaviour.
    """
    import todo
    import tracks
    key = str(n)

    def hit(ref: str) -> bool:
        return ref == key or ref.startswith(key + ".")

    hits: list[dict] = []
    for i, p in enumerate(state.get(root, "rules", []) or [], 1):
        if not p.get("struck") and hit(str(p.get("doc") or "")):
            hits.append({"kind": "rule", "env": None, "n": i, "text": p["fact"][:70]})
    for name in tracks._all(root):
        for i, p in enumerate(state.tracked(root, "pins", name, []) or [], 1):
            if not p.get("struck") and hit(str(p.get("doc") or "")):
                hits.append({"kind": "pin", "env": name, "n": i, "text": p["fact"][:70]})
        for t in todo.open_items(root, name):
            if hit(str(t.get("doc") or "")):
                hits.append({"kind": "to-do", "env": name, "n": t["n"], "text": t["title"][:70]})
    return hits


def cited_by(root: Path, n: int) -> list[str]:
    """Every pin, rule and to-do that references doc n, on any environment — the
    text form; see `cited_by_rows` for the structured rows this is built from."""
    def label(r: dict) -> str:
        if r["kind"] == "rule":
            return f"rule {r['n']}: {r['text']}"
        return f"{r['kind']} {r['n']} on environment {r['env']}: {r['text']}"
    return [label(r) for r in cited_by_rows(root, n)]


def ref_label(root: Path, ref: str, short: bool = False) -> str:
    """'doc 4: title' or 'doc 4.2: title · part title', for showing beside a citing entry.

    `short` drops the doc's title — for a page that has already listed the doc above.
    """
    base, head, _ = anchor(root, ref)
    doc, prt, _ = get(root, base)
    if doc is None:
        return f"doc {ref} (missing)"
    sec = f" § {head}" if head else ""
    if short:
        return (f"doc {doc['n']}.{prt['p']}: {prt['title']}{sec}" if prt
                else f"doc {doc['n']}{sec}")
    if prt:
        return f"doc {doc['n']}.{prt['p']}: {doc['title']} · {prt['title']}{sec}"
    return f"doc {doc['n']}: {doc['title']}{sec}"


def check_ref(root: Path, ref: str) -> str | None:
    """The reason a --doc reference cannot be taken, or None."""
    if not ref:
        return None
    base, _, bad = anchor(root, ref)
    if bad:
        return bad
    doc, prt, err = get(root, base)
    if doc is None or (prt is None and "." in ref):
        return err
    return None


# ------------------------------------------------------------------ as data
#: A DOC/PART/ATTACHMENT AS A PLAIN DICT — the shape the web viewer serves. Built
#: from the same primitives (`scope_text`, `attachments`, `_age`) `catalogue`'s own
#: `facts()` reads to build its joined line for a terminal; only the final shaping
#: differs — a sentence there, separate fields here for a page that renders its
#: own badges and links from them.
def row(root: Path, d: dict) -> dict:
    return {
        "n": d["n"],
        "title": d.get("title", ""),
        "abstract": d.get("abstract", ""),
        "status": d.get("status") or "draft",
        "scope": scope_text(d),
        "at": d.get("at", ""),
        "age": _age(d.get("at", "")),
        "parts": len(d.get("parts") or []),
        "attachments": len(attachments(d)),
        "superseded_by": d.get("superseded_by") or "",
        "supersedes": d.get("supersedes") or "",
    }


def part_row(p: dict) -> dict:
    return {
        "p": p["p"],
        "title": p.get("title", ""),
        "body": p.get("body", ""),
        "at": p.get("at", ""),
        "age": _age(p.get("at", "")),
        "source": p.get("source", ""),
    }


def attachment_row(a: dict) -> dict:
    return {
        "name": a.get("name", ""),
        "title": a.get("title", ""),
        "dir": bool(a.get("dir")),
        "size": int(a.get("size") or 0),
    }


# ------------------------------------------------------------------ rendering
def catalogue(root: Path, width: int | None = None, cap: int | None = None, page: int = 1,
              order: str = fmt.DESC, track: str = "", all_of_them: bool = False) -> str:
    """The catalogue, capped like `carry` (below) so a bare `journal docs` never grows
    without bound; unlike carry — handed automatically, every session — this is asked
    for, so it pages rather than just saying "N more".

    THE LOOP IS `entries.listing`, shared with `todo.render` and `tools.catalogue` — only
    `facts` below is a doc's own, the same strategy `pins._store` already supplies for a
    pin, a rule and a reminder.
    """
    width = fmt.room(width)
    import entries
    docs = _load(root)
    if track and not all_of_them:
        docs = [d for d in docs if here(d, track)]
    if not docs:
        return "  No docs are catalogued."

    def facts(d: dict) -> list[str]:
        out = [d.get("status", "draft"), scope_text(d)]
        if d["parts"]:
            out.append(f"{len(d['parts'])} part(s)")
        files = attachments(d)
        if files:
            out.append(f"{len(files)} file(s)")
        if _age(d.get("at", "")):
            out.append(_age(d.get("at", "")))
        if d.get("superseded_by"):
            out.append(f"SUPERSEDED by doc {d['superseded_by']}")
        if d.get("abstract"):
            out.append(d["abstract"])
        return out

    def item_of(d: dict):
        return fmt.Item(n=d["n"], text=d["title"], meta=" · ".join(facts(d)),
                        struck=bool(d.get("superseded_by")))

    rows, left = entries.listing(docs, item_of, cap=cap, page=page, order=order)
    return fmt.render(fmt.Out(items=tuple(rows))) + fmt.more("docs", left, page, order)


def show(root: Path, ref: str, width: int | None = None) -> tuple[bool, str]:
    width = fmt.room(width)
    doc, prt, err = get(root, ref)
    if doc is None or (prt is None and "." in ref):
        return False, err
    if prt:
        out = [fmt.title(f"DOC {doc['n']}.{prt['p']}", sub=prt["title"]),
               "  " + fmt.dim(f"of doc {doc['n']}: {doc['title']} · {prt.get('source', '')} · "
                              f"{_age(prt.get('at', ''))} · {prt['path'].relative_to(root.parent)}"), ""]
        out.append(fmt.prose(prt["body"].rstrip(), width=width))
        return True, "\n".join(out)
    meta = [doc.get("status", "draft"), scope_text(doc), doc.get("source", ""),
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
        out.append(fmt.prose(doc["body"].rstrip(), width=width))
    for p in doc["parts"]:
        out.append(fmt.section(f"{doc['n']}.{p['p']}  {p['title']}"))
        out.append("  " + fmt.dim(f"{p.get('source', '')} · {_age(p.get('at', ''))} · "
                                  f"{p['path'].relative_to(root.parent)}"))
        out.append("")
        out.append(fmt.prose(p["body"].rstrip(), width=width))
    files = attachments(doc)
    if files:
        out.append(fmt.section("attachments"))
        out.append("")
        out.extend(_attachment_lines(root, files))
    cites = cited_by(root, doc["n"])
    if cites:
        out.append(fmt.section("cited by"))
        out.extend(f"  {c}" for c in cites)
    out.append("")
    rows = [(f'journal docs part {doc["n"]} "<title>" --brief', "add a part from stdin"),
            (f'journal docs attach {doc["n"]} <path> "<what it is>"', "copy a file or folder in, beside the parts")]
    if files:
        rows.append((f'journal docs detach {doc["n"]} <name> "<why>"', "drop an attachment, kept under struck/"))
    if doc["parts"]:
        rows.append((f'journal docs strike {doc["n"]}.<p> "<why>"', "drop a part, on the record"))
    rows.append((f"journal docs {'final' if doc.get('status') != 'final' else 'draft'} {doc['n']}",
                 "change its status"))
    out.append(fmt.commands(rows))
    return True, "\n".join(out)


def carry(root: Path, cap: int = 20, track: str = "", brief: bool = False) -> str:
    """The catalogue a session start hands over: number, title, abstract; drafts marked.

    BRIEF IS THE TITLE AND NOTHING ELSE. A doorway carries pointers, and an abstract is
    content — the two sentences that explain a doc belong to `journal docs <n>`, which is
    printed right beside the title. Three abstracts were the largest content in a block
    whose entire purpose is to be small enough to survive.

    NEWEST FIRST, like every other list that pages. 1.30.0 flipped the five renderers and
    did not reach this one, so a session start handed docs 1 to 20 — the OLDEST twenty —
    and hid everything since behind "and N more". In a project with 78 docs that is every
    doc the current work is about, invisible at exactly the moment the catalogue exists to
    stop somebody re-investigating what a doc settles.
    """
    # THE CATALOGUE A SESSION IS HANDED IS THE ONE FOR ITS OWN WORK, plus the project's.
    # Every environment used to be handed every doc: eighty-four titles at a session start
    # in one real project, almost none of them about the work in front of the reader — and
    # a catalogue nobody can skim is a catalogue nobody reads, which is the one thing it
    # exists to prevent.
    docs = [d for d in _load(root)
            if not d.get("superseded_by") and (not track or here(d, track))]
    if not docs:
        return ""
    lines = []
    for d in fmt.ordered(docs)[:cap]:
        mark = "  (draft)" if d.get("status") != "final" else ""
        files = [] if brief else attachments(d)
        if files:
            mark += f"  ({len(files)} file(s): " + ", ".join(a["name"] for a in files[:3]) + ("…" if len(files) > 3 else "") + ")"
        if brief:
            lines.append(f"  {d['n']:>3}  {fmt.gist(d['title'])}{'  (draft)' if d.get('status') != 'final' else ''}")
        else:
            lines.append(f"  {d['n']:>3}  {d['title']}{mark}\n       {d.get('abstract', '')}")
    more = fmt.cut(cap, len(docs), "journal docs", shortened=brief)
    return (f"DOCS OF THIS PROJECT, {len(docs)} catalogued — read one before you re-investigate what "
            "it settles; `journal docs <n>` reads it, `journal docs search <term>` finds a line:\n"
            + "\n".join(lines) + more)


def search_lines(root: Path, track: str = "",
                 all_of_them: bool = False) -> list[tuple[str, str, int, str]]:
    """(reference, title, line number, text) for every line of every doc in scope.

    A SEARCH IS A LISTING. `journal docs` has filtered by scope since 1.44.0 and this read
    every doc in the project, so a doc that is deliberately absent from the catalogue turned
    up in the results anyway — with its lines quoted, which is more than the catalogue would
    have shown. Scope decides what is LISTED, and this is one of the places that lists.

    READING BY NUMBER IS STILL UNSCOPED, which is the property that keeps `--doc=N` honest
    from any environment. Nothing here changes that: a reference the search does not return
    is still a reference `journal docs <n>` will read.
    """
    out = []
    for d in _load(root):
        if track and not all_of_them and not here(d, track):
            continue
        for i, line in enumerate(d["body"].splitlines(), 1):
            out.append((str(d["n"]), d["title"], i, line))
        for p in d["parts"]:
            for i, line in enumerate(p["body"].splitlines(), 1):
                out.append((f"{d['n']}.{p['p']}", p["title"], i, line))
        for a in attachments(d):
            rel = a["path"].relative_to(root.parent)
            out.append((str(d["n"]), d["title"], 0, f"attachment {a['name']} — {a['title']} ({rel})"))
            if a["dir"]:
                for x in sorted(a["path"].rglob("*")):
                    if x.is_file() and not x.name.startswith("."):
                        out.append((str(d["n"]), d["title"], 0, f"attachment {a['name']}/{x.relative_to(a['path'])} — in {a['title']}"))
    return out
