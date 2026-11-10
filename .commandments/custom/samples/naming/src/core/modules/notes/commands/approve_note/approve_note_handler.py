from engine.command.handler import Handler
from core.modules.notes.commands.approve_note.approve_note import ApproveNote


# @righteous naming_command_named_for_its_effect
class ApproveNoteHandler(Handler[ApproveNote, None]):
    command = ApproveNote
