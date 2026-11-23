<?php

declare(strict_types=1);

namespace App\Commands\ReportRuntimeHeartbeat;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\SessionStateChanged;
use App\Models\AgentSession;
use App\Support\DriverHeartbeatSource;
use App\Support\HeartbeatEvidence;
use App\Support\HostRuntimes;
use Carbon\CarbonImmutable;

final readonly class ReportRuntimeHeartbeatHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private DriverHeartbeatSource $heartbeats,
        private CommandFacts $facts,
    ) {}

    public function handle(ReportRuntimeHeartbeatCommand $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $session = AgentSession::query()->findOrFail($runtime->agent_session_id);

        $evidence = new HeartbeatEvidence($command->hostId, $command->processGeneration, $command->evidence);
        $now = CarbonImmutable::now();
        $wasStale = $runtime->isStale($now);

        $this->heartbeats->record($session, $evidence, $command->dispatchedBy());
        $runtime->confirmAlive($now);

        // A beat that only keeps a fresh report fresh changes nothing a page shows; one after a silence does.
        if ($wasStale) {
            $this->facts->publishAfterCommit(new SessionStateChanged($session->id));
        }
    }
}
