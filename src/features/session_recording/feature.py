from framework.base import Feature
from controllers.types import Recordings
from features.session_recording.details import SessionRecordingDetails

__all__ = ["Recordings"]


class SessionRecording(Feature):
    details = SessionRecordingDetails
