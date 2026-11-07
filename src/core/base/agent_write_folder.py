from pathlib import Path


class AgentWriteFolder:
    """The folder an agent may write in when its type requires a separate folder."""

    def folder(self, agent_id: int) -> Path | None:
        return None
