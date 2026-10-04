from engine.events.engine import FileEdited
from features.file_feed.feed import noted
from features.parts import AgentContext, Handler


class KeepEdits(Handler):
    def handle(self, context: AgentContext, event: FileEdited) -> None:
        noted(context.record, event)
