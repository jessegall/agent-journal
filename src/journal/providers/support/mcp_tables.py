import re

from journal.models.mcp_server import McpServer

JOURNAL_COMMENT = "# Written by the journal: edit it on the viewer's MCP page."
OLD_JOURNAL_COMMENT = "# Written by the journal: the project's MCP servers. Edit them on the viewer's MCP page."
HEADER = re.compile(r"^\s*\[\s*mcp_servers\.([^\].]+)")


class McpTables:
    """The MCP servers in a Codex config.toml: the journal's own tables, each under its mark, written anew from the project's servers, and every other line of the file kept as it was."""

    @classmethod
    def merged(cls, text: str, servers: list[McpServer]) -> str:
        user_text = "\n".join(cls.user_lines(text.splitlines(), {server.name for server in servers})).strip()
        journal_text = "\n".join(cls.table(server) for server in servers).strip()
        return "\n\n".join(part for part in (user_text, journal_text) if part) + "\n"

    @staticmethod
    def user_lines(lines: list[str], names: set[str]) -> list[str]:
        user_rows, journal_table, commented, legacy = [], "", False, OLD_JOURNAL_COMMENT in (line.strip() for line in lines)
        for line in lines:
            if line.strip() in (JOURNAL_COMMENT, OLD_JOURNAL_COMMENT):
                commented = True
                continue
            if line.lstrip().startswith("["):
                header = HEADER.match(line)
                name = header[1] if header else ""
                journal_table = name if name and (commented or legacy or name in names or name == journal_table) else ""
                commented = False
            if not journal_table:
                user_rows.append(line)
        return user_rows

    @staticmethod
    def table(server: McpServer) -> str:
        lines = [JOURNAL_COMMENT, f"[mcp_servers.{server.name}]"]
        if server.transport == "stdio":
            lines.append(f'command = "{server.command}"')
            lines.append("args = [" + ", ".join(f'"{item}"' for item in server.args) + "]")
            if server.needs_key:
                lines.append(f'env = {{ {server.key_var} = "${{{server.key_var}}}" }}')
        else:
            lines.append(f'url = "{server.url}"')
            if server.needs_key:
                lines.append(f'bearer_token_env_var = "{server.key_var}"')
        return "\n".join(lines) + "\n"
