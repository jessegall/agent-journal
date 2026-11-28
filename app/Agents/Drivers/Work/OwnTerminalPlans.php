<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Work;

use App\Agents\Drivers\Setup\DriverProfiles;
use App\Hosts\Protocol\HostProcessType;
use App\Models\Agents\AgentRuntime;
use App\Sessions\SessionOfflineReplies;
use App\Skills\StartSkillFiles;
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

    public function __construct(
        private DriverProfiles $profiles,
        private SessionOfflineReplies $offlineReplies,
        private StartSkillFiles $skills,
        private RuntimeStarts $starts,
    ) {}

    public function of(AgentRuntime $runtime): HostProcessPlan
    {
        $start = new DriverStart(
            sessionId: $runtime->agent_session_id,
            type: HostProcessType::Terminal,
            workFolder: $runtime->canonical_folder,
            model: $runtime->startModel(),
            effort: $runtime->startEffort(),
            hookCommand: self::HOOK_COMMAND,
            executablePlace: $runtime->executablePlace(),
            offlineReply: $this->offlineReplies->of($runtime->agent_session_id),
            skillFiles: $this->skills->of($runtime->agent_session_id),
        );

        $settings = $this->starts->clientSettingsOf($runtime);

        return $this->profiles->of($runtime)->startPlan($start)->withEnvironment($settings->environment());
    }
}
