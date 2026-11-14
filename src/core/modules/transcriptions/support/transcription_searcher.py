from engine.viewer.model_searcher import ModelSearcher
from core.modules.transcriptions.models.transcription import Transcription


class TranscriptionSearcher(ModelSearcher):
    """Finds the transcriptions whose title or text holds the words."""

    model = Transcription
