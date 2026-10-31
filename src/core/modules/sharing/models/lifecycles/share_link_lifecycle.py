from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.sharing.models.enums.share_link_state import ShareLinkState


class ShareLinkLifecycle(Lifecycle):
    states = ShareLinkState
    initial = [ShareLinkState.ACTIVE]
    editable = []
    deletable = [ShareLinkState.REVOKED]

    revoke = Move("revoke", [ShareLinkState.ACTIVE], ShareLinkState.REVOKED)
