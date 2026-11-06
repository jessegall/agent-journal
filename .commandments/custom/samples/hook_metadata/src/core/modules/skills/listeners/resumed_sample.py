DRIVERS_MODULE = "journal.core.drivers"
MESSAGES_MODULE = "journal.core.messages"


def resumed(call):
    # @sin architecture_drivers_raw_hook_metadata_read
    return call.metadata.module_part(DRIVERS_MODULE).get("resumed")


def commented(message):
    # @righteous architecture_drivers_raw_hook_metadata_read
    return message.metadata.module_part(MESSAGES_MODULE).get("commented_row")


def read_resume_status(call):
    # @righteous architecture_drivers_raw_hook_metadata_read
    return call.was_resumed
