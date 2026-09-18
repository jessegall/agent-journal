from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

from controller import Controller, Payload, Result

IMAGES = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif")


def _stamp(path: Path, fallback: str = "") -> str:
    try:
        return datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).isoformat(timespec="seconds")
    except OSError:
        return fallback


class FilesController(Controller):
    resource = "files"
    noun = "file"
    actions = ("index",)
    numbered = ()

    def index(self, root: Path, p: Payload) -> Result:
        import docs
        import inbox
        from pins import age
        env = p.env
        out = []
        for n, m in enumerate(inbox._all(root, env), 1):
            if m.get("removed"):
                continue
            for f in m.get("files") or []:
                # a file moved into a document is listed with that document; a kept one stays with its message
                if str(f.get("filed") or "").startswith("doc:") or f.get("removed"):
                    continue
                at = _stamp(inbox.files_dir(root, env, n) / f["name"], m.get("at", ""))
                out.append({"name": f["name"], "size": int(f.get("size") or 0), "at": at, "age": age(at) if at else "",
                            "source": "message", "n": n, "folder": False, "count": 0,
                            "url": f"/message-files/{env}/{n}/{quote(f['name'])}",
                            "image": f["name"].lower().endswith(IMAGES)})
        for d in docs._load(root):
            if not docs.here(d, env):
                continue
            for a in docs.attachments(d):
                row = docs.attachment_row(a)
                at = _stamp(a["path"], d.get("at", ""))
                out.append({"name": row["name"], "size": row["size"], "at": at, "age": age(at) if at else "",
                            "source": "doc", "n": d["n"], "folder": row["dir"], "count": len(row["files"]),
                            "url": f"/docs/{d['n']}/files/{quote(row['name'])}",
                            "image": not row["dir"] and row["name"].lower().endswith(IMAGES)})
        out.sort(key=lambda f: f["at"], reverse=True)
        return Result("ok", "", out)
