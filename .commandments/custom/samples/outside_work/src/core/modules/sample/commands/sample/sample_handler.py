import shutil


# @sin architecture_core_handler_runs_twice
class SampleRemovalHandler(Handler[SampleRemoval, None]):
    def handle(self, command, context):
        shutil.rmtree(command.folder)


# @righteous architecture_core_handler_runs_twice
class SampleOnceHandler(Handler[SampleOnce, None]):
    runs_once = True

    def handle(self, command, context):
        shutil.rmtree(command.folder)


# @righteous architecture_core_handler_runs_twice
class SampleRowsHandler(Handler[SampleRows, None]):
    def handle(self, command, context):
        return None
