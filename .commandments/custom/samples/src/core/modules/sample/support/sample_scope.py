from core.base.scope.actor_scope import ActorScope


class SampleListener:
    # @righteous architecture_scope_disabled_scopes_set_in_code
    disabled_scopes = [ActorScope]

    def open(self, listener):
        # @sin architecture_scope_disabled_scopes_set_in_code
        listener.disabled_scopes = []
