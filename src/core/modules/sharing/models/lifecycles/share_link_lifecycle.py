from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.sharing.models.enums.share_link_state import ShareLinkState


class ShareLinkLifecycle(Lifecycle):
    states = ShareLinkState
    initial = [ShareLinkState.WAITING, ShareLinkState.ACTIVE]
    editable = [ShareLinkState.ACTIVE]
    deletable = [ShareLinkState.REVOKED, ShareLinkState.DENIED]

    accept = Move("accept", [ShareLinkState.WAITING], ShareLinkState.ACTIVE)
    deny = Move("deny", [ShareLinkState.WAITING], ShareLinkState.DENIED)
    revoke = Move("revoke", [ShareLinkState.ACTIVE], ShareLinkState.REVOKED)
