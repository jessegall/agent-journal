from engine.driver.hook_event_name import HookEventName


class FirstStopListener:
    def handle(self, call):
        # @sin listener_repeats_a_listener_repeats_a_decision
        if call.hook == HookEventName.STOP and call.is_allowed:
            call.note()
        # @righteous listener_repeats_a_listener_repeats_a_decision
        if call.hook == HookEventName.TICK:
            call.note()
