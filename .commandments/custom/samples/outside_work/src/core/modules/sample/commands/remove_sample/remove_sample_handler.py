import shutil


# @sin architecture_core_handler_runs_twice
class RemoveSampleHandler(Handler[RemoveSample, None]):
    def handle(self, command, context):
        shutil.rmtree(command.folder)
