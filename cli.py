from __future__ import annotations

from typing import Callable, NamedTuple


class Arg(NamedTuple):
    name: str
    type: Callable = str          # raises ValueError with the reason
    rest: bool = False            # takes every remaining word, joined
    optional: bool = False
    what: str = ""

    def says(self) -> str:
        return self.what or f"<{self.name}>"


class Opt(NamedTuple):
    name: str
    type: Callable = str
    repeat: bool = False
    bare: bool = False
    default: object = None


class Command(NamedTuple):
    noun: str
    verb: str = ""
    args: tuple = ()
    opts: tuple = ()
    writes: bool = False
    run: Callable | None = None
    verbs: tuple = ()
    summary: str = ""


class Parsed:
    __slots__ = ("command", "_args", "_opts")

    def __init__(self, command: Command, args: dict, opts: dict):
        self.command, self._args, self._opts = command, args, opts

    @property
    def noun(self) -> str:
        return self.command.noun

    @property
    def verb(self) -> str:
        return self.command.verb

    def arg(self, name: str, default=None):
        return self._args.get(name, default)

    def option(self, name: str, default=None):
        return self._opts.get(name, default)


def number(what: str) -> Callable[[str], int]:
    def convert(word: str) -> int:
        try:
            return int(word)
        except ValueError:
            raise ValueError(f"{what} must be a number, got {word!r}") from None
    return convert


class Registry:
    def __init__(self, shared: tuple = ()):
        self.shared = {o.name: o for o in shared}
        self._nouns: dict[str, str] = {}
        self._commands: dict[str, list[Command]] = {}

    def noun(self, name: str, *aliases: str) -> None:
        for spelling in (name, *aliases):
            self._nouns[spelling] = name
        self._commands.setdefault(name, [])

    def add(self, cmd: Command) -> Command:
        if cmd.noun not in self._commands:
            self.noun(cmd.noun)
        self._commands[cmd.noun].append(cmd)
        return cmd

    def commands(self, noun: str | None = None) -> list[Command]:
        if noun is None:
            return [c for cs in self._commands.values() for c in cs]
        return list(self._commands.get(self._nouns.get(noun, noun), []))

    def usage(self, cmd: Command) -> str:
        words = ["journal", *(w for w in (cmd.noun, cmd.verb) if w)]
        for a in cmd.args:
            shown = f"<{a.name}>" + ("..." if a.rest else "")
            words.append(f"[{shown}]" if a.optional else shown)
        return " ".join(words)

    def _resolve(self, words: list[str]) -> tuple[list[Command], list[str], str]:
        first = words[0] if words else ""
        noun = self._nouns.get(first)
        if noun is None:
            return [], [], f"no such command: {first!r}. `journal help` lists them."
        cmds = self._commands[noun]
        if len(words) > 1:
            named = [c for c in cmds if c.verb and words[1] in (c.verb, *c.verbs)]
            if named:
                return named, words[2:], ""
        default = [c for c in cmds if not c.verb]
        if default:
            return default, words[1:], ""
        verbs = ", ".join(sorted({c.verb for c in cmds}))
        got = f" has no {words[1]!r}." if len(words) > 1 else " needs a verb."
        return [], [], f"{noun}{got} It takes {verbs}."

    def _bind(self, cmd: Command, words: list[str]) -> tuple[dict | None, str]:
        out: dict = {}
        left = list(words)
        for a in cmd.args:
            if a.rest:
                text = " ".join(left).strip()
                left = []
                if not text:
                    if a.optional:
                        continue
                    return None, f"`{self.usage(cmd)}` wants {a.says()}"
                out[a.name] = a.type(text) if a.type is not str else text
                continue
            if not left:
                if a.optional:
                    continue
                return None, f"`{self.usage(cmd)}` wants {a.says()}"
            try:
                out[a.name] = a.type(left.pop(0))
            except ValueError as e:
                return None, f"`{self.usage(cmd)}`: {e}"
        if left:
            return None, f"`{self.usage(cmd)}` does not take {' '.join(left)!r}"
        return out, ""

    def _options(self, cmd: Command, raw: list[tuple[str, str | None]]) -> tuple[dict | None, str]:
        specs = {**self.shared, **{o.name: o for o in cmd.opts}}
        out: dict = {o.name: ([] if o.repeat else o.default) for o in specs.values()}
        for name, val in raw:
            spec = specs.get(name)
            if spec is None:
                return None, f"unknown option '--{name}' for `{self.usage(cmd)}`"
            if spec.bare:
                if val is not None:
                    return None, f"'--{name}' takes no value"
                out[name] = True
                continue
            if val is None:
                return None, f"'--{name}' wants a value: --{name}=<value>"
            try:
                got = spec.type(val)
            except ValueError as e:
                return None, f"'--{name}': {e}"
            if spec.repeat:
                out[name].append(got)
            else:
                out[name] = got
        return out, ""

    def parse(self, argv: list[str]) -> tuple[Parsed | None, str]:
        argv = list(argv)
        payload: list[str] = []
        if "--" in argv:
            cut = argv.index("--")
            argv, payload = argv[:cut], argv[cut + 1:]
        words: list[str] = []
        raw: list[tuple[str, str | None]] = []
        for a in argv:
            if a.startswith("--") and len(a) > 2:
                name, eq, val = a[2:].partition("=")
                raw.append((name, val if eq else None))
            else:
                words.append(a)
        cands, left, refusal = self._resolve(words or [""])
        if not cands:
            return None, refusal
        left += payload
        first = ""
        for cmd in cands:
            bound, why = self._bind(cmd, left)
            if bound is None:
                first = first or why
                continue
            opts, why = self._options(cmd, raw)
            if opts is None:
                return None, why
            return Parsed(cmd, bound, opts), ""
        return None, first

    def command_of(self, words: list[str]) -> Command | None:
        # a malformed write is still a write, so a failed bind falls back to the first candidate
        plain = [w for w in words if not (w.startswith("--") and len(w) > 2)]
        if "--" in plain:
            plain.remove("--")
        cands, left, _ = self._resolve(plain or [""])
        for cmd in cands:
            if self._bind(cmd, left)[0] is not None:
                return cmd
        return cands[0] if cands else None
