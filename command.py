from __future__ import annotations

import re
from typing import Callable, NamedTuple
from templates import render as fill


class Arg(NamedTuple):
    name: str
    type: Callable = str
    rest: bool = False
    optional: bool = False
    what: str = ""

    def says(self) -> str:
        return self.what or say("arg", name=self.name)


class Opt(NamedTuple):
    name: str
    type: Callable = str
    repeat: bool = False
    bare: bool = False
    default: object = None


MESSAGES = {
    "arg": "<{name}>",
    "arg_rest": "<{name}>...",
    "optional": "\\[{shown}\\]",
    "not_a_number": "{what} must be a number, got {word}",
    "no_such": "no such command: {word}. `journal help` lists them.",
    "no_verb": "{noun} has no {verb}. It takes {verbs}.",
    "needs_verb": "{noun} needs a verb. It takes {verbs}.",
    "wants": "`{usage}` wants {what}",
    "bad_value": "`{usage}`: {error}",
    "extra": "`{usage}` does not take {words}",
    "unknown_option": "unknown option '--{name}' for `{usage}`",
    "bare_option": "'--{name}' takes no value",
    "option_value": "'--{name}' wants a value: --{name}=<value>",
    "option_error": "'--{name}': {error}",
}

def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


def number(what: str) -> Callable[[str], int]:
    def convert(word: str) -> int:
        try:
            return int(word)
        except ValueError:
            raise ValueError(say("not_a_number", what=what, word=repr(word))) from None
    return convert


_BLOCK = re.compile(r"\{([^{}]*)\}")


def _option(spec: str, casts: dict) -> Opt:
    name, eq, default = spec[2:].partition("=")
    cast = casts.get(name, str)
    if not eq:
        return Opt(name, cast, bare=True)
    if default == "*":
        return Opt(name, cast, repeat=True)
    return Opt(name, cast, default=cast(default) if default else None)


def options(signature: str, casts: dict | None = None) -> tuple:
    """The `{--...}` blocks of a signature, as options."""
    return tuple(_option(b.partition(" : ")[0].strip(), casts or {})
                 for b in _BLOCK.findall(signature) if b.strip().startswith("--"))


def parse_signature(signature: str, casts: dict | None = None) -> tuple[str, str, tuple, tuple]:
    """`noun:verb {arg} {arg?} {rest*} {--flag} {--opt=} {--opt=default} {--opt=*}`, with
    ` : description` inside any block."""
    casts = casts or {}
    noun, _, verb = signature.split("{", 1)[0].strip().partition(":")
    args = []
    for block in _BLOCK.findall(signature):
        spec, _, what = block.partition(" : ")
        spec = spec.strip()
        if spec.startswith("--"):
            continue
        name = spec.rstrip("?*")
        suffix = spec[len(name):]
        args.append(Arg(name, casts.get(name, str), rest="*" in suffix, optional="?" in suffix,
                        what=what.strip()))
    return noun, verb, tuple(args), options(signature, casts)


class Parsed:
    __slots__ = ("command", "_args", "_opts", "_raw", "_extra")

    def __init__(self, command: Command, args: dict, opts: dict, raw: tuple = (), extra: tuple = ()):
        self.command, self._args, self._opts, self._raw = command, args, opts, tuple(raw)
        self._extra = tuple(extra)

    def options_in_order(self) -> list[tuple[str, str | None]]:
        """Every --name=value as typed, in command-line order: for options that belong to the one before them."""
        return list(self._raw)

    def passthrough_options(self) -> list[str]:
        """Options the command did not declare, as typed (`--flag` or `--opt=value`), in order."""
        return list(self._extra)

    def arg(self, name: str, default=None):
        return self._args.get(name, default)

    def option(self, name: str, default=None):
        return self._opts.get(name, default)

    def payload(self, kind, extra: dict | None = None):
        import state
        fields = {**self._opts, **self._args, **(extra or {})}
        ident = fields.pop(getattr(self.command, "id_arg", "n"), None)
        env_arg = getattr(self.command, "env_arg", "")
        env = fields.pop(env_arg, None) if env_arg else None
        return kind.build(env or (state._TRACK[0] if state._TRACK else ""), ident, fields, "cli")


class Command:
    signature: str = ""
    casts: dict = {}
    verbs: tuple = ()
    default: bool = False         # also answers the bare noun
    needs: tuple = ()             # options that must be present for this command to be chosen
    writes: bool = False
    passthrough: bool = False     # keeps undeclared options instead of refusing them

    noun: str = ""
    verb: str = ""
    args: tuple = ()
    opts: tuple = ()

    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        if "signature" in cls.__dict__ or "casts" in cls.__dict__:
            cls.noun, cls.verb, cls.args, cls.opts = parse_signature(cls.signature, cls.casts)

    def answers(self, word: str) -> bool:
        return word in (self.verb, *self.verbs)

    def usage(self) -> str:
        words = ["journal", *(w for w in (self.noun, self.verb) if w)]
        for a in self.args:
            shown = say("arg_rest" if a.rest else "arg", name=a.name)
            words.append(say("optional", shown=shown) if a.optional else shown)
        return " ".join(words)

    def run(self, parsed: Parsed) -> int:
        raise NotImplementedError


class Registry:
    def __init__(self, shared: tuple = ()):
        self.shared = {o.name: o for o in shared}
        self._nouns: dict[str, str] = {}
        self._commands: dict[str, list[Command]] = {}

    def noun(self, name: str, *aliases: str) -> None:
        for spelling in (name, *aliases):
            self._nouns[spelling] = name
        self._commands.setdefault(name, [])

    def add(self, *classes: type[Command]) -> None:
        for cls in classes:
            if cls.noun not in self._commands:
                self.noun(cls.noun)
            self._commands[cls.noun].append(cls())

    def knows(self, word: str) -> bool:
        return word in self._nouns

    def commands(self, noun: str | None = None) -> list[Command]:
        if noun is None:
            return [c for cs in self._commands.values() for c in cs]
        return list(self._commands.get(self._nouns.get(noun, noun), []))

    def _resolve(self, words: list[str]) -> tuple[list[Command], list[str], str]:
        first = words[0] if words else ""
        noun = self._nouns.get(first)
        if noun is None:
            return [], [], say("no_such", word=repr(first))
        cmds = self._commands[noun]
        if len(words) > 1:
            named = [c for c in cmds if c.verb and c.answers(words[1])]
            if named:
                return named, words[2:], ""
        bare = [c for c in cmds if c.default or not c.verb]
        if bare:
            return bare, words[1:], ""
        verbs = ", ".join(sorted({c.verb for c in cmds}))
        if len(words) > 1:
            return [], [], say("no_verb", noun=noun, verb=repr(words[1]), verbs=verbs)
        return [], [], say("needs_verb", noun=noun, verbs=verbs)

    @staticmethod
    def _bind(cmd: Command, words: list[str]) -> tuple[dict | None, str]:
        out: dict = {}
        left = list(words)
        for a in cmd.args:
            if a.rest:
                text = " ".join(left).strip()
                left = []
                if not text:
                    if a.optional:
                        continue
                    return None, say("wants", usage=cmd.usage(), what=a.says())
                try:
                    out[a.name] = a.type(text)
                except ValueError as e:
                    return None, say("bad_value", usage=cmd.usage(), error=e)
                continue
            if not left:
                if a.optional:
                    continue
                return None, say("wants", usage=cmd.usage(), what=a.says())
            try:
                out[a.name] = a.type(left.pop(0))
            except ValueError as e:
                return None, say("bad_value", usage=cmd.usage(), error=e)
        if left:
            return None, say("extra", usage=cmd.usage(), words=repr(" ".join(left)))
        return out, ""

    def _options(self, cmd: Command, raw: list[tuple[str, str | None]]) -> tuple[dict | None, list, str]:
        specs = {**self.shared, **{o.name: o for o in cmd.opts}}
        out: dict = {o.name: ([] if o.repeat else o.default) for o in specs.values()}
        extra: list = []
        for name, val in raw:
            spec = specs.get(name)
            if spec is None:
                if cmd.passthrough:
                    extra.append(f"--{name}" if val is None else f"--{name}={val}")
                    continue
                return None, extra, say("unknown_option", name=name, usage=cmd.usage())
            if spec.bare:
                if val is not None:
                    return None, extra, say("bare_option", name=name)
                out[name] = True
                continue
            if val is None:
                return None, extra, say("option_value", name=name)
            try:
                got = spec.type(val)
            except ValueError as e:
                return None, extra, say("option_error", name=name, error=e)
            if spec.repeat:
                out[name].append(got)
            else:
                out[name] = got
        return out, extra, ""

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
        present = {name for name, _ in raw}
        cands = [c for c in cands if set(c.needs) <= present]
        left += payload
        first = ""
        for cmd in cands:
            bound, why = self._bind(cmd, left)
            if bound is None:
                first = first or why
                continue
            opts, extra, why = self._options(cmd, raw)
            if opts is None:
                return None, why
            return Parsed(cmd, bound, opts, raw, extra), ""
        return None, first

    def command_of(self, words: list[str]) -> Command | None:
        # a malformed write is still a write, so a failed bind falls back to the first candidate
        plain = [w for w in words if not (w.startswith("--") and len(w) > 2)]
        present = {w[2:].partition("=")[0] for w in words if w.startswith("--") and len(w) > 2}
        if "--" in plain:
            plain.remove("--")
        cands, left, _ = self._resolve(plain or [""])
        cands = [c for c in cands if set(c.needs) <= present] or cands
        for cmd in cands:
            if self._bind(cmd, left)[0] is not None:
                return cmd
        return cands[0] if cands else None
