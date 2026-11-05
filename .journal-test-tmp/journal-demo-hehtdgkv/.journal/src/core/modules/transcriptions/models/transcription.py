from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Transcription(Model):
    """A transcript kept in the project, pasted by a person or fetched by an agent, which an agent turns into
    summaries and other rows linked back to it."""

    model_name = "transcription"
    cli_name = "transcription"
    search_fields = ["title", "text"]

    environment_id: int
    creator_id: int
    title: str
    text: str = ""
    source: str = ""
