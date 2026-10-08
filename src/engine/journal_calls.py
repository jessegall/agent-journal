import re
import shlex
from dataclasses import dataclass

GLOBAL_OPTIONS = frozenset({"--root", "--env", "--default-env", "--as", "--session", "--agent", "--cwd", "--plugin"})
SEPARATORS = frozenset(";&|()\n")
PUNCTUATION = "".join(SEPARATORS) + "<>"
SEPARATED = re.compile("[" + re.escape("".join(SEPARATORS)) + "]+")
NAMED = re.compile(r"(?:^|(?<=[\s/;&|()'\"`=]))journal(?:\.py)?(?=\s)")
REDIRECTION = re.compile(r"""("(?:\\.|[^"\\])*"|'[^']*')|(?:(?<!\S)\d+)?(?:&>>?|>>?&?|<<?<?)\s*[^\s;&|()<>"']*""")
ENDS = re.compile(r"[;&|()\n\"'`]")


def valued(word: str) -> bool:
    option = word.partition("=")[0]
    return len(option) > 2 and not word.count("=") and any(full.startswith(option) for full in GLOBAL_OPTIONS)


@dataclass(frozen=True)
class JournalCall:
    words: tuple[str, ...]

    @property
    def line(self) -> str:
        return shlex.join(self.words)

    @property
    def options(self) -> dict[str, str]:
        return self._split()[0]

    @property
    def rest(self) -> tuple[str, ...]:
        return self._split()[1]

    @property
    def noun(self) -> str:
        return self.rest[0] if self.rest else ""

    @property
    def verb(self) -> str:
        return self.rest[1] if len(self.rest) > 1 else ""

    @property
    def arguments(self) -> tuple[str, ...]:
        return self.rest[2:]

    @property
    def command(self) -> tuple[str, ...]:
        return tuple(word for word in (self.noun, self.verb) if word)

    @property
    def plain(self) -> bool:
        return not any(set(word) <= set(PUNCTUATION) or word.split("=", 1)[0] in GLOBAL_OPTIONS for word in self.words)

    def matches(self, noun: str, *verbs: str) -> bool:
        return self.noun == noun and (not verbs or self.verb in verbs)

    def names(self, noun: str, verb: str) -> bool:
        return any(pair == (noun, verb) for pair in zip(self.words, self.words[1:]))

    def _split(self) -> tuple[dict[str, str], tuple[str, ...]]:
        words, options = list(self.words[1:]), {}
        while words and words[0].startswith("-"):
            option, _, value = words[0].partition("=")
            if valued(words[0]):
                value, words = " ".join(words[1:2]), words[2:]
            else:
                words = words[1:]
            options[option] = value
        return options, tuple(words)


def tokens(text: str) -> list[str]:
    try:
        return shlex.split(text)
    except ValueError:
        return text.split()


def pieces(shell: str) -> list[tuple[str, ...]]:
    shell = REDIRECTION.sub(lambda found: found.group(1) or " ", shell)
    try:
        return lexed(shell)
    except ValueError:
        return [tuple(part.split()) for part in SEPARATED.split(shell) if part.split()]


def lexed(shell: str) -> list[tuple[str, ...]]:
    lexer = shlex.shlex(shell, posix=True, punctuation_chars=PUNCTUATION)
    lexer.whitespace = " \t\r"
    lexer.commenters = ""
    lexer.whitespace_split = True
    found, piece = [], []
    for token in lexer:
        if set(token) <= SEPARATORS:
            found.append(tuple(piece))
            piece = []
        else:
            piece.append(token)
    found.append(tuple(piece))
    return [one for one in found if one]


def parsed(text: str) -> JournalCall | None:
    words = tokens(text)
    return JournalCall(tuple(words)) if words and words[0] == "journal" else None


def quoted_at(shell: str, end: int) -> bool:
    quote = ""
    for index, letter in enumerate(shell[:end]):
        if not quote:
            quote = letter if letter in "'\"" else ""
        elif letter == quote and not (quote == '"' and shell[index - 1] == "\\"):
            quote = ""
    return bool(quote)


def calls(shell: str) -> list[JournalCall]:
    found = (JournalCall(("journal", *tokens(ENDS.split(shell[named.end():], maxsplit=1)[0])))
             for named in NAMED.finditer(shell) if not quoted_at(shell, named.start()))
    return [call for call in found if call.noun]
