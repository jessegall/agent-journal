from dataclasses import dataclass


@dataclass(frozen=True)
class AgentType:
    """An agent profile the journal writes for each provider present, as Claude's .claude/agents/<name>.md or Codex's .codex/agents/<name>.toml."""

    name: str
    description: str
    tools: str
    setting: str
    prompt: str

    @property
    def instructions(self) -> str:
        return self.prompt
