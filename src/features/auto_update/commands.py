from features.auto_update import routes
from features.auto_update.countdown import cancel
from features.auto_update.new_feature import unseen_announced
from framework.parts import Command, Context


class CancelUpdate(Command):
    name = "cancel_update"
    user_only = True

    def run(self, context: Context, features) -> str:
        cancel(context.record.root)
        return "the update that was counting down is cancelled"


class ShowNewFeatures(Command):
    name = "new_features"

    def run(self, context: Context, features) -> str:
        found = unseen_announced(context.record, routes.CHANGELOG)
        return "\n".join(f"{one.version}: {one.title} - {one.text}" for one in found) or "no new feature waits to be seen"
