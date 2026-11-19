MYSQL_PROGRAMS = ("mysql", "mysqldump")
POSTGRES_PROGRAMS = ("psql", "pg_dump")
ALIASES = {
    "host": ("host", "hostname", "server"),
    "port": ("port",),
    "database": ("database", "db", "dbname", "schema"),
    "user": ("username", "user", "login"),
    "password": ("password", "pass", "pwd"),
}


class ClientVariables:
    """The variables a database client reads itself, built from the fields of a login secret: the password stays in the client's environment, never in an argument or a file that outlives the run."""

    def __init__(self, program: str, fields: dict[str, str]) -> None:
        self.program = program
        found = {part: next((fields[a] for a in names if a in fields), None) for part, names in ALIASES.items()}
        self.parts = {part: value for part, value in found.items() if value}

    def applies(self) -> bool:
        return self.program in MYSQL_PROGRAMS + POSTGRES_PROGRAMS and bool(self.parts)

    def environment(self) -> dict[str, str]:
        names = {"host": "MYSQL_HOST", "port": "MYSQL_TCP_PORT", "password": "MYSQL_PWD"} if self.program in MYSQL_PROGRAMS else {
            "host": "PGHOST", "port": "PGPORT", "database": "PGDATABASE", "user": "PGUSER", "password": "PGPASSWORD"}
        return {names[part]: value for part, value in self.parts.items() if part in names}

    def defaults_file(self) -> str | None:
        """The user (mysql has no variable for it) and, for mysql only, the database: the content of the throwaway home's .my.cnf."""
        if self.program not in MYSQL_PROGRAMS:
            return None
        sections = {"client": {"user": self.parts.get("user")}, "mysql": {"database": self.parts.get("database")}}
        rows = [f"[{name}]\n" + "".join(f"{key}={self.quoted(value)}\n" for key, value in options.items() if value) for name, options in sections.items() if any(options.values())]
        return "".join(rows) or None

    @staticmethod
    def quoted(value: str) -> str:
        return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'
