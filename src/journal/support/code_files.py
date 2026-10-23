import re

SOURCE = re.compile(r"\.(py|pyi|vue|js|mjs|cjs|jsx|ts|tsx|cs|go|rs|swift|kt|kts|java|scala|php|rb|ex|exs|erl|hs|ml|clj|c|h|cc|cpp|hpp|m|mm|lua|dart|r|jl|sh|bash|zsh|fish|ps1|sql|css|scss|sass|less|svelte|astro)$")


class CodeFiles:
    """Which files a tool call writes are code, the program's own source, apart from documents, markdown, data and settings."""

    @staticmethod
    def has_code(paths: tuple[str, ...]) -> bool:
        return any(SOURCE.search(path) for path in paths)
