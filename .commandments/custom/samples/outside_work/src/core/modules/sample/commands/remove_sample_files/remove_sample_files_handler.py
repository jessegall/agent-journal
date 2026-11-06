import shutil


# @righteous architecture_core_handler_runs_twice
class RemoveSampleFilesHandler(Handler[RemoveSampleFiles, None]):
    runs_once = True

    def handle(self, command, context):
        shutil.rmtree(command.folder)
