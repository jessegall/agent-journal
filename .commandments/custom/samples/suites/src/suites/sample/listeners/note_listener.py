from engine.listener.commit_listener import CommitListener


# @righteous architecture_layout_suite_listener_outside_listeners
class NoteListener(CommitListener):
    name = "sample.note-listener"
