import re
import shlex

from features.parts import AgentContext, ToolInterceptor
from engine.reach import Reach
from controllers.types import Agents

SEPARATORS = {"&&", "||", ";", "|", "&", "\n"}
VALUED = {"--root", "--env", "--as", "--session", "--agent", "--page", "--back"}
REDIRECT = re.compile(r"\s\d*[<>]+&?\s*[^\s|;&]*")


def said(tokens: list[str]) -> list[list[str]]:
    lines, line = [], []
    for token in tokens:
        if token in SEPARATORS:
            lines.append(line)
            line = []
            continue
        line.append(token)
    return [*lines, line]


def asked(line: list[str]) -> list[str]:
    starts = [i for i, token in enumerate(line) if token == "journal" or token.endswith("/journal")]
    if not starts:
        return []
    rest, words = line[starts[0] + 1:], []
    skip = False
    for token in rest:
        if skip:
            skip = False
            continue
        if token in VALUED:
            skip = True
            continue
        if not token.startswith("-"):
            words.append(token)
    return words


def back(line: list[str]) -> int:
    given = [token.removeprefix("--back=") for token in line if token.startswith("--back=")]
    given += [after for token, after in zip(line, line[1:]) if token == "--back"]
    return next((int(value) for value in given if value.isdigit()), 0)


def label(words: list[str], line: list[str]) -> str:
    noun, terms = (words[0], words[1:]) if words else ("", [])
    if noun == "search" and terms:
        return f"Searched the history for {' '.join(terms)!r}"
    if noun == "conversation":
        return {0: "Read back the conversation", 1: "Read back the conversation the last summary replaced"}.get(
            back(line), f"Read back the conversation {back(line)} summaries ago")
    if noun == "user":
        return "Read back your own words"
    return ""


def searches(command: str) -> list[str]:
    if "journal" not in command:
        return []
    try:
        lexer = shlex.shlex(REDIRECT.sub(" ", command), posix=True, punctuation_chars=True)
        lexer.whitespace_split = True
        tokens = list(lexer)
    except ValueError:
        return []
    return [found for line in said(tokens) if (found := label(asked(line), line))]


class MarkHistorySearches(ToolInterceptor):
    reach = Reach.MAIN
    refuses = False

    def intercept(self, context: AgentContext, call) -> str:
        for command in call.commands:
            for found in searches(command):
                context.journal.get(Agents).card(context.agent.row.n, label=found, icon="search", tone="note")
        return ""
