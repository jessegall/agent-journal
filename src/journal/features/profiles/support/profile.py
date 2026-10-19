import json
from dataclasses import dataclass


@dataclass(frozen=True)
class Profile:
    """A worker or a subagent as each provider reads it: what it does, which tools it may use and what it is told."""

    name: str
    description: str
    tools: str
    body: str
    kind: str = "subagent"

    def claude_text(self, model: str, codex_model: str) -> str:
        return f"---\nname: {self.name}\ndescription: {self.description}\ntools: {self.tools}\nkind: {self.kind}\nmodel: {model}\ncodex-model: {codex_model}\n---\n\n{self.body}\n"

    def codex_text(self, model: str) -> str:
        sandbox = "read-only" if self.kind == "subagent" else "workspace-write"
        return (f"name = {json.dumps(self.name)}\ndescription = {json.dumps(self.description, ensure_ascii=False)}\nmodel = {json.dumps(model)}\n"
                f"sandbox_mode = \"{sandbox}\"\ndeveloper_instructions = {json.dumps(self.body, ensure_ascii=False)}\n")
