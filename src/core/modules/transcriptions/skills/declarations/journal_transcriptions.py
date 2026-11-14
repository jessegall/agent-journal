from engine.skill.skill_declaration import SkillDeclaration


class JournalTranscriptions(SkillDeclaration):
    """The skill journal-transcriptions: turn a transcript into summaries, notes, documents, tasks or plans linked back to it."""

    folder = "journal-transcriptions"
    description = "Turn a transcript into summaries, notes, documents, tasks or plans linked back to it; read it when a transcription arrives or is edited"
    keywords = ("transcription", "transcriptions", "transcript")
    commands = ["transcription"]
    types = ["main"]
