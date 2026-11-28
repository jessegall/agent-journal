<?php

declare(strict_types=1);

namespace App\Hosts\Enums;

/**
 * What a process on a host is for: an agent's terminal, an agent's headless turn, or a probe.
 */
enum HostProcessPurpose: string
{
    case AgentTerminal = 'agent_terminal';
    case AgentTurn = 'agent_turn';
    case Probe = 'probe';
    case BuildProbe = 'build_probe';
    case SignInProbe = 'sign_in_probe';

    /**
     * The purposes of a process that is the agent itself, its terminal or its turn, whichever its driver runs.
     *
     * @return list<self>
     */
    public static function agentPurposes(): array
    {
        return [
            self::AgentTerminal,
            self::AgentTurn,
        ];
    }

    /**
     * Whether the process only probes the start, its build or its sign-in, and is never the agent itself.
     */
    public function isProbe(): bool
    {
        return in_array($this, [self::Probe, self::BuildProbe, self::SignInProbe], true);
    }

    /**
     * Whether the process is its runtime's own: it takes the runtime's work and its end is the runtime's end. A turn
     * the journal opened for a runtime takes only stops and interrupts, a probe none, and both end alone.
     */
    public function isRuntimeProcess(): bool
    {
        $ownedByNoRuntime = [
            self::AgentTurn,
            self::BuildProbe,
            self::SignInProbe,
        ];

        return ! in_array($this, $ownedByNoRuntime, true);
    }

    /**
     * The process as a sentence names it, such as "sign-in probe".
     */
    public function label(): string
    {
        return match ($this) {
            self::AgentTerminal => 'agent terminal',
            self::AgentTurn => 'agent turn',
            self::Probe => 'probe',
            self::BuildProbe => 'build probe',
            self::SignInProbe => 'sign-in probe',
        };
    }
}
