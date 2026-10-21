import shlex
from dataclasses import dataclass, field
from pathlib import Path

from journal.models.alias import Alias


@dataclass(frozen=True)
class PluginAlias:
    """An alias a plugin's manifest ships: its name, its line with the program named from the plugin's folder, the variables put before it (env in the manifest), the arguments it takes, the reader that reads its output and what it does."""

    name: str
    line: str
    variables: dict = field(default_factory=dict)
    args: tuple[str, ...] = ()
    reader: str = ""
    description: str = ""

    @classmethod
    def parsed(cls, data: dict) -> "PluginAlias":
        fields = {key: value for key, value in data.items() if key != "env"}
        return cls(**{**fields, "variables": data.get("env", data.get("variables", {})), "args": tuple(data.get("args", ()))})

    @property
    def program(self) -> str:
        return self.line.split(None, 1)[0] if self.line.strip() else ""

    def row(self, folder: Path, plugin: str) -> Alias:
        remainder = self.line.split(None, 1)[1:]
        line = " ".join([shlex.quote(str(folder / self.program)), *remainder])
        description = self.description or (f"takes {', '.join(self.args)}" if self.args else "")
        return Alias(name=self.name, line=line, reader=self.reader, description=description, variables=self.variables, plugin=plugin)
