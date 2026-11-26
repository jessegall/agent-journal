<?php

declare(strict_types=1);

namespace App\Enums\Hosts;

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
    case RelayProbe = 'relay_probe';
    case SandboxProbe = 'sandbox_probe';

    /**
     * Whether the process is its runtime's own: it takes the runtime's work and its end is the runtime's end. A turn
     * or a probe the journal opened for a runtime takes only stops and interrupts, and ends alone.
     */
    public function isRuntimeProcess(): bool
    {
        $ownedByNoRuntime = [self::AgentTurn, self::BuildProbe, self::SignInProbe, ...self::isolationProbes()];

        return ! in_array($this, $ownedByNoRuntime, true);
    }

    /**
     * The probes that show whether Claude Code's sandbox runs in the agent image: socat, the relay it needs, then
     * bubblewrap.
     *
     * @return list<self>
     */
    public static function isolationProbes(): array
    {
        return [self::RelayProbe, self::SandboxProbe];
    }
}
