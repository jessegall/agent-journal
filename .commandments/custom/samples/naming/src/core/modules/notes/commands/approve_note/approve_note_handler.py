from core.base.command.handler import Handler
from core.modules.notes.commands.approve_note.approve_note import ApproveNote


# @righteous naming_CommandAsAnOrderDetector
class ApproveNoteHandler(Handler[ApproveNote, None]):
    command = ApproveNote
