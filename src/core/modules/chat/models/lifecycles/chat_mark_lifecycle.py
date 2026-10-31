from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState


class ChatMarkLifecycle(Lifecycle):
    states = ChatMarkState
    initial = [ChatMarkState.SHOWN, ChatMarkState.ENDED]
    editable = (ChatMarkState.SHOWN,)
    deletable = (ChatMarkState.SHOWN, ChatMarkState.ENDED)

    end = Move("end", [ChatMarkState.SHOWN], ChatMarkState.ENDED)
