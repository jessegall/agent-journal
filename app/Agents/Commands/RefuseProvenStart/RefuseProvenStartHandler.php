<?php

declare(strict_types=1);

namespace App\Agents\Commands\RefuseProvenStart;

use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Sessions\StartHeartbeats;

final readonly class RefuseProvenStartHandler implements CommandHandler
{
    public function __construct(private StartHeartbeats $heartbeats) {}

    public function handle(RefuseProvenStartCommand $command): void
    {
        $runtime = AgentRuntime::query()->whereKey($command->runtimeId)->sole();
        $start = SessionProcess::findLockedCurrentOf($runtime->agent_session_id);

        // A start that ended meanwhile, such as one stopped by its user, keeps how it ended.
        if ($start === null) {
            return;
        }

        $this->heartbeats->refuseStart($start, $command->refusal);
    }
}
