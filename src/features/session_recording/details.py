from features.base import FeatureDetails


class SessionRecordingDetails(FeatureDetails):
    name = "session_recording"
    has_skill = False

    title = "Session recording"

    abstract = "A session can be recorded into a folder, moment by moment, for the demo"

    help = """
        journal record start <folder> runs alongside the session. On every new event in any
        environment's log it stores the journal's record and the project's files, content-addressed in
        <folder>/blobs, and writes one line to <folder>/frames.jsonl with the events that caused it and
        the paths that changed or went. It reads the logs' sizes and nothing else while they stand
        still. journal record stop ends it and copies in the transcripts of the agents that ran.
    """
