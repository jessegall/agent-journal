from dataclasses import dataclass

OPERATORS = (";", "&&", "||", "\n")
KEYWORDS = frozenset({"if", "then", "else", "elif", "fi", "for", "while", "until", "do", "done", "case", "esac", "select", "function", "time", "coproc", "in"})
FUNCTION = (
    "journal_step() {{ __js=$?; ( read -r _ __ju < {heartbeat} && curl -s -m 1 --connect-timeout 1 -o /dev/null -X POST "
    "\"${{__ju}}api/step?token={token}&part=$1&phase=start\" >/dev/null 2>&1 & ) 2>/dev/null; (exit $__js); eval \"$2\"; __js=$?; "
    "( read -r _ __ju < {heartbeat} && curl -s -m 1 --connect-timeout 1 -o /dev/null -X POST "
    "\"${{__ju}}api/step?token={token}&part=$1&phase=end&status=$__js\" >/dev/null 2>&1 & ) 2>/dev/null; return $__js; }}"
)


@dataclass(frozen=True)
class Chain:
    """A shell command cut at its top-level separators into the parts that run one after another, with the operator that joins each part to the one before it."""

    parts: tuple[str, ...]
    joins: tuple[str, ...]

    def stepped(self, token: str, heartbeat: str) -> str:
        """The same chain with every part run through journal_step, which reports the part's start and end and keeps its exit status, output and effect on the shell."""
        function = FUNCTION.format(heartbeat=quoted(heartbeat), token=token)
        steps = [f"journal_step {at} {quoted(part)}" for at, part in enumerate(self.parts, 1)]
        chained = steps[0] + "".join(f" {join} {step}" for join, step in zip(self.joins, steps[1:]))
        return f"{function}\n{chained}"


def quoted(text: str) -> str:
    return "'" + text.replace("'", "'\\''") + "'"


def chain_of(command: str) -> Chain | None:
    """The command's parts, or nothing when it cannot be cut with certainty: quotes left open, subshells, groups, substitutions, heredocs, background jobs, comments, or a part that is only a piece of a compound command."""
    parts, joins, current, quote = [], [], [], ""
    at = 0
    while at < len(command):
        char = command[at]
        pair = command[at:at + 2]
        if quote:
            current.append(char)
            if char == "\\" and quote == '"' and at + 1 < len(command):
                current.append(command[at + 1])
                at += 1
            elif char == quote:
                quote = ""
            at += 1
            continue
        if char == "\\" and at + 1 < len(command):
            current.extend((char, command[at + 1]))
            at += 2
            continue
        if char in "'\"":
            quote = char
            current.append(char)
            at += 1
            continue
        if cannot_be_cut(command, at, current):
            return None
        join = pair if pair in ("&&", "||") else char if char in ";\n" else ""
        if join:
            parts.append("".join(current).strip())
            joins.append(join)
            current = []
            at += len(join)
            continue
        current.append(char)
        at += 1
    parts.append("".join(current).strip())
    if quote or any(not part for part in parts) or len(parts) < 2:
        return None
    if any(part.split(None, 1)[0] in KEYWORDS or part.endswith("\\") for part in parts):
        return None
    return Chain(tuple(parts), tuple(joins))


def cannot_be_cut(command: str, at: int, before: list[str]) -> bool:
    """A character that starts a subshell, group, substitution, heredoc, comment or background job, which the command is left whole for."""
    if command[at:at + 2] in ("<<", "$(", ";;", "|&") or command[at] in "`(){}":
        return True
    if command[at] == "#":
        return not before or before[-1].isspace()
    return backgrounds(command, at, before)


def backgrounds(command: str, at: int, before: list[str]) -> bool:
    """An ampersand that starts a background job, not one that joins commands (&&) or belongs to a redirection (2>&1, &>file)."""
    if command[at] != "&" or command[at:at + 2] == "&&":
        return False
    follows = command[at + 1:at + 2]
    return not (follows == ">" or (before and before[-1] in "<>&"))
