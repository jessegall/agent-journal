"""Adds the imports a move leaves missing in doc comments: a type named by its short name, which resolved in the file's
namespace before the move because the class sat beside it, gets a `use` of where that class is now.

    python3 tools/refactoring/layout/moved-doc-imports.py <rows file of move.php>
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
NAMESPACE = re.compile(r"^namespace\s+([^;]+);", re.M)
DECLARED = re.compile(r"^(?:final\s+|abstract\s+|readonly\s+)*(?:class|interface|trait|enum)\s+(\w+)", re.M)
IMPORT = re.compile(r"^use\s+([^;]+);", re.M)
DOC_TAG = re.compile(r"^\s*\*.*@(?:param|return|var|property|throws|template|extends|implements|use|method|phpstan-[\w-]+|psalm-[\w-]+|mixin|see)\b(.*)$", re.M)
TYPE_WORD = re.compile(r"(?<![\\\w$])([A-Z]\w*)(?![\w\\])")


def current_classes() -> dict[str, Path]:
    found = {}
    for folder in ("app", "domain", "tests"):
        for path in (ROOT / folder).rglob("*.php"):
            text = path.read_text(errors="replace")
            namespace, declared = NAMESPACE.search(text), DECLARED.search(text)
            if namespace and declared:
                found[f"{namespace.group(1)}\\{declared.group(1)}"] = path
    return found


def main() -> None:
    rows = [line.split(" ") for line in Path(sys.argv[1]).read_text().splitlines() if line.strip()]
    moved = {row[0]: row[1] for row in rows}
    old_namespace_of = {row[1]: row[0].rsplit("\\", 1)[0] for row in rows}
    classes = current_classes()
    fixed = 0
    for name, path in classes.items():
        text = path.read_text(errors="replace")
        namespace = name.rsplit("\\", 1)[0]
        before = old_namespace_of.get(name, namespace)
        imported = {entry.split(" as ")[-1].strip().rsplit("\\", 1)[-1] for entry in IMPORT.findall(text)}
        words = {word for tag in DOC_TAG.findall(text) for word in TYPE_WORD.findall(tag)}
        missing = []
        for word in sorted(words - imported):
            if f"{namespace}\\{word}" in classes:
                continue
            was = f"{before}\\{word}"
            now = moved.get(was, was if was in classes else None)
            if now is not None and now in classes and now.rsplit("\\", 1)[0] != namespace:
                missing.append(now)
        if not missing:
            continue
        uses = "".join(f"use {fqcn};\n" for fqcn in missing)
        if IMPORT.search(text):
            first = IMPORT.search(text)
            text = text[: first.start()] + uses + text[first.start():]
        else:
            end = NAMESPACE.search(text).end()
            text = text[:end] + "\n\n" + uses.rstrip("\n") + text[end:]
        path.write_text(text)
        fixed += 1
    print(f"Added doc comment imports to {fixed} files.")


main()
