def bypass_queue(folder, process_id):
    # @sin architecture_processes_SlotOnlyThroughTheQueueDetector
    folder.write_slot(process_id)


def check_queue(folder, process_id):
    # @righteous architecture_processes_SlotOnlyThroughTheQueueDetector
    return folder.has_slot(process_id)
