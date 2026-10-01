from features.base import Feature
from features.session_recording.controller import Recordings
from features.session_recording.details import SessionRecordingDetails

__all__ = ["Recordings"]


class SessionRecording(Feature):
    details = SessionRecordingDetails
