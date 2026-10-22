import re

RUNNERS = {"python", "python3", "node", "bash", "sh", "zsh", "env", "time", "nohup"}
TOKEN_PATTERN = re.compile(r"[^\s|<>&;]+")
WORD_PATTERN = re.compile(r"[A-Za-z][\w.-]*")
MODULE_FLAG = "-m"
SHAPE_TOKEN_COUNT = 3


class CommandShape:
    """A command as its program and subcommands name it, the values passed to it left out: pytest -k chat and pytest tests/a.py are both pytest, python3 -m pytest -q is python3 -m pytest, npm run test stays npm run test."""

    @staticmethod
    def build(part: str) -> str:
        tokens = TOKEN_PATTERN.findall(part.split("<<", 1)[0])
        if not tokens:
            return ""
        shape_parts = [tokens[0]]
        for token in tokens[1:SHAPE_TOKEN_COUNT]:
            is_module = token == MODULE_FLAG and shape_parts[-1].rsplit("/", 1)[-1] in RUNNERS
            if not is_module and not WORD_PATTERN.fullmatch(token):
                break
            shape_parts.append(token)
        return " ".join(shape_parts)
