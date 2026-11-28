<?php

declare(strict_types=1);

namespace App\Hosts\Enums;

/**
 * What a process on a host is for: an agent's terminal, an agent's headless turn, the owner of an account, or a probe.
 */
enum HostProcessPurpose: string
{
    case AgentTerminal = 'agent_terminal';
    case AgentTurn = 'agent_turn';
    case AccountOwner = 'account_owner';
    case Probe = 'probe';
    case BuildProbe = 'build_probe';
    case SignInProbe = 'sign_in_probe';

    /**
     * Whether the process only probes the start, its build or its sign-in, and is never the agent itself.
     */
    public function isProbe(): bool
    {
        return in_array($this, [self::Probe, self::BuildProbe, self::SignInProbe], true);
    }

    /**
     * Whether every worker of the process reads all it printed again: a probe, whose verdict needs the whole of what
     * it printed, often before its first worker began, and an account owner, which rebuilds its threads and turns.
     */
    public function readsItsOutputWhole(): bool
    {
        return $this === self::AccountOwner || $this->isProbe();
    }

    /**
     * Whether the process is its runtime's own: it takes the runtime's work and its end is the runtime's end. A turn
     * the journal opened for a runtime takes only stops and interrupts, a probe none, and both end alone.
     */
    public function isRuntimeProcess(): bool
    {
        $ownedByNoRuntime = [self::AgentTurn, self::BuildProbe, self::SignInProbe];

        return ! in_array($this, $ownedByNoRuntime, true);
    }
}
