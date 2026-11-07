from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.commands.end_process.end_process import EndProcess


def reading(bus, process_id):
    # @sin architecture_processes_reader_run_outside_tick
    return bus.run(ReadNewOutput(process_id))


def ending(bus, process_id):
    # @righteous architecture_processes_reader_run_outside_tick
    return bus.run(EndProcess(process_id))
