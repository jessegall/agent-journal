# @righteous architecture_core_handler_runs_twice
class SaveSampleHandler(Handler[SaveSample, None]):
    def handle(self, command, context):
        return None
