def stop_agent(bus, hook):
    # @righteous architecture_drivers_slow_stop_in_a_hook
    bus.run(StopAgent(hook.agent_id))
