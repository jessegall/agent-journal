import json
import re
from pathlib import Path

PACKAGE = "@playwright/mcp@latest"
STORAGE = "--storage-state"
ISOLATED = "--isolated"
HEADER = re.compile(r"^\[[^\n]*\][ \t]*$", re.M)
SERVER_TABLE = re.compile(r"^\[mcp_servers\.([^\].]+)\][ \t]*$")
ARGS = re.compile(r"^args[ \t]*=[ \t]*(\[.*\])[ \t]*$", re.M)


def server_args(storage: Path) -> list[str]:
    return ["-y", PACKAGE, "--headless", ISOLATED, STORAGE, str(storage)]


def environment(storage: Path) -> dict[str, str]:
    """What a Playwright browser tool reads from its environment to start from the saved logins, whoever installed it."""
    return {"PLAYWRIGHT_MCP_STORAGE_STATE": str(storage), "PLAYWRIGHT_MCP_ISOLATED": "true"}


def runs_playwright(server) -> bool:
    return "playwright" in json.dumps(server).lower()


def with_logins(args: list[str], storage: Path) -> list[str]:
    """A Playwright server's own arguments, starting from the saved logins in place of any it named before."""
    kept = [arg for i, arg in enumerate(args)
            if arg not in (ISOLATED, STORAGE) and not arg.startswith(f"{STORAGE}=") and (i == 0 or args[i - 1] != STORAGE)]
    return [*kept, ISOLATED, STORAGE, str(storage)]


def plain_args(body: str) -> list[str] | None:
    """A TOML table's args when they are written as plain strings, which JSON reads too; None otherwise."""
    found = ARGS.search(body)
    if found is None:
        return None
    try:
        loaded = json.loads(found.group(1))
    except ValueError:
        return None
    if not isinstance(loaded, list):
        return None
    return [str(arg) for arg in loaded]


def table_with_logins(body: str, storage: Path) -> str:
    """A Playwright server's table keeping its own arguments, with the saved logins added; written anew when its arguments are not plain."""
    args = plain_args(body)
    if args is None:
        return f'\ncommand = "npx"\nargs = {json.dumps(server_args(storage))}\n\n'
    return ARGS.sub(lambda _: f"args = {json.dumps(with_logins(args, storage))}", body, count=1)


def with_logins_table(text: str, storage: Path) -> str:
    """Codex's config with its Playwright server starting from the saved logins: the one it names, or one added."""
    headers = list(HEADER.finditer(text))
    for i, header in enumerate(headers):
        end = headers[i + 1].start() if i + 1 < len(headers) else len(text)
        named = SERVER_TABLE.match(header.group(0))
        body = text[header.end():end]
        if named and runs_playwright(f"{named.group(1)} {body}"):
            return f"{text[:header.end()]}{table_with_logins(body, storage)}{text[end:]}".rstrip() + "\n"
    return f"{text.rstrip()}\n\n[mcp_servers.playwright]\n{table_with_logins('', storage).lstrip()}".lstrip().rstrip() + "\n"
