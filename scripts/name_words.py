"""Lists the words of the project's Python and Go names, and of its Python sentences, that are neither forbidden in
.commandments/custom/lists.json nor accepted before, each with one place it is used. Name words are accepted in
scripts/name_words_accepted.txt and sentence words in scripts/sentence_words_accepted.txt, so a word fine in a
sentence is still shown in a name. --accept and --accept-sentence mark words as fine; --accept-shown marks every word
the run would show."""

import argparse
import ast
import json
import re
from collections.abc import Iterator
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PYTHON_FOLDERS = ["src/core", "src/suites", "src/server", "src/install", "tests", "scripts"]
GO_FOLDERS = ["tools/journal-hook", "tools/journal"]
SKIPPED_FOLDERS = {"__pycache__", "node_modules", "dist", "testdata"}
LISTS = ROOT / ".commandments" / "custom" / "lists.json"
NAMES_ACCEPTED = ROOT / "scripts" / "name_words_accepted.txt"
SENTENCES_ACCEPTED = ROOT / "scripts" / "sentence_words_accepted.txt"
FORBIDDEN_LISTS = ("poetic", "poetic_values", "poetic_types")
NAME_WORD = re.compile(r"[A-Z]?[a-z]+|[A-Z]+(?![a-z])")
SENTENCE_WORD = re.compile(r"[A-Za-z]+")
GO_NAME = re.compile(r"\b(?:const|var|func|type)\s+(?:\([^)]*\)\s*)?([A-Za-z_][A-Za-z0-9_]*)|\b([A-Za-z_][A-Za-z0-9_]*)\s*:=")
SHORTEST_WORD = 3


def source_files(folders: list[str], suffix: str) -> Iterator[Path]:
    for folder in folders:
        for path in sorted((ROOT / folder).rglob(f"*{suffix}")):
            if not SKIPPED_FOLDERS & set(path.parts):
                yield path


def name_words(name: str) -> list[str]:
    return [word.lower() for part in name.split("_") for word in NAME_WORD.findall(part)]


def python_names(tree: ast.AST) -> Iterator[tuple[str, int]]:
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)) and not node.name.startswith("test_"):
            yield node.name, node.lineno
        elif isinstance(node, ast.Name):
            yield node.id, node.lineno
        elif isinstance(node, ast.Attribute):
            yield node.attr, node.lineno
        elif isinstance(node, ast.arg):
            yield node.arg, node.lineno


def python_sentences(tree: ast.AST) -> Iterator[tuple[str, int]]:
    for node in ast.walk(tree):
        if isinstance(node, ast.Constant) and isinstance(node.value, str) and " " in node.value:
            yield node.value, node.lineno


def word_places() -> tuple[dict[str, str], dict[str, str]]:
    names: dict[str, str] = {}
    sentences: dict[str, str] = {}
    for path in source_files(PYTHON_FOLDERS, ".py"):
        try:
            tree = ast.parse(path.read_text())
        except SyntaxError:
            continue
        place = path.relative_to(ROOT)
        for name, line in python_names(tree):
            for word in name_words(name):
                names.setdefault(word, f"{place}:{line} {name}")
        for text, line in python_sentences(tree):
            for word in SENTENCE_WORD.findall(text):
                sentences.setdefault(word.lower(), f"{place}:{line}")
    for path in source_files(GO_FOLDERS, ".go"):
        place = path.relative_to(ROOT)
        for number, line in enumerate(path.read_text().splitlines(), 1):
            for match in GO_NAME.finditer(line):
                name = match.group(1) or match.group(2)
                for word in name_words(name):
                    names.setdefault(word, f"{place}:{number} {name}")
    return names, sentences


def forbidden_words() -> set[str]:
    lists = json.loads(LISTS.read_text())
    return {word.lower() for key in FORBIDDEN_LISTS for word in lists[key]}


def accepted_words(path: Path) -> set[str]:
    return set(path.read_text().split()) if path.exists() else set()


def shown_words() -> tuple[dict[str, str], dict[str, str]]:
    names, sentences = word_places()
    forbidden = forbidden_words()
    name_known, sentence_known = forbidden | accepted_words(NAMES_ACCEPTED), forbidden | accepted_words(SENTENCES_ACCEPTED)
    shown_names = {word: place for word, place in names.items() if word not in name_known and len(word) >= SHORTEST_WORD}
    shown_sentences = {word: place for word, place in sentences.items() if word not in sentence_known and len(word) >= SHORTEST_WORD}
    return dict(sorted(shown_names.items())), dict(sorted(shown_sentences.items()))


def accept(path: Path, words: list[str]) -> None:
    if words:
        path.write_text("\n".join(sorted(accepted_words(path) | {word.lower() for word in words})) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--accept", nargs="+", default=[])
    parser.add_argument("--accept-sentence", nargs="+", default=[])
    parser.add_argument("--accept-shown", action="store_true")
    arguments = parser.parse_args()
    if arguments.accept or arguments.accept_sentence:
        accept(NAMES_ACCEPTED, arguments.accept)
        accept(SENTENCES_ACCEPTED, arguments.accept_sentence)
        return
    names, sentences = shown_words()
    if arguments.accept_shown:
        accept(NAMES_ACCEPTED, list(names))
        accept(SENTENCES_ACCEPTED, list(sentences))
        print(f"{len(names)} name words and {len(sentences)} sentence words accepted")
        return
    for word, place in names.items():
        print(f"name  {word}  {place}")
    for word, place in sentences.items():
        print(f"sentence  {word}  {place}")
    print(f"{len(names)} new name words, {len(sentences)} new sentence words")


if __name__ == "__main__":
    main()
