def bypass_queue(folder, process_id):
    # @sin architecture_processes_slot_written_outside_the_queue
    folder.write_slot(process_id)


def check_queue(folder, process_id):
    # @righteous architecture_processes_slot_written_outside_the_queue
    return folder.has_slot(process_id)
