<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Enums\Hosts\HostProcessType;
use App\Models\Agents\AgentRuntime;
use App\Support\Drivers\Profiles\DriverProfiles;
use App\Values\DriverStart;
use App\Values\HostProcessPlan;

/**
 * The plan of a session its owner runs in their own terminal, as journal claude does in a connected folder: the
 * driver's argv, settings and environment from its profile, with no account of the journal's, so the device only
 * writes and runs what the journal decided.
 */
final readonly class OwnTerminalPlans
{
    /**
     * The hook command the device fills in: the hook adapter of its own installation.
     */
    private const string HOOK_COMMAND = '{host:HOOK_COMMAND}';

    public function __construct(private DriverProfiles $profiles) {}

    public function of(AgentRuntime $runtime): HostProcessPlan
    {
        $start = new DriverStart(
            sessionId: $runtime->agent_session_id,
            type: HostProcessType::Terminal,
            workFolder: $runtime->canonical_folder,
            hookCommand: self::HOOK_COMMAND,
        );

        return $this->profiles->of($runtime)->startPlan($start);
    }
}
