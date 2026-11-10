from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Transcription(EnvironmentScoped, Model):
    """A transcript kept in the project, pasted by a person or fetched by an agent, which an agent turns into
    summaries and other rows linked back to it."""

    model_name = "transcription"
    cli_name = "transcription"
    search_fields = ["title", "text"]

    environment_id: int = 0
    creator_id: int
    title: str
    text: str = ""
    source: str = ""
