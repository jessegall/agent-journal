from engine.helper_type.command_allow_list import CommandAllowList

BASE_COMMANDS = CommandAllowList(lines=("message unread", "message read", "message reply", "message send", "skill list", "skill show", "skill required",
                                        "skill requirements", "output read"))
