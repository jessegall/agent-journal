<?php

declare(strict_types=1);

namespace App\Agents\Commands\CancelSessionStart;

use App\Agents\DriverRequests;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Sessions\SessionStartCancelled;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Sessions\StartHeartbeats;

final readonly class CancelSessionStartHandler implements CommandHandler
{
    private const string CANCELLED = 'the start was cancelled before its driver ran';

    public function __construct(
        private DriverRequests $requests,
        private CommandFacts $facts,
        private StartHeartbeats $heartbeats,
    ) {}

    /**
     * Answers whether a runtime was told to stop: a start whose runtime never opened, or whose processes have all
     * ended, has nothing to stop and ends now.
     */
    public function handle(CancelSessionStartCommand $command): bool
    {
        $hasRuntime = AgentRuntime::hasSession($command->sessionId);
        $isRunning = $hasRuntime && HostProcess::hasLiveOfSession($command->sessionId);

        SessionRequest::findLockedLatestOf($command->sessionId)
            ->forAll(fn (SessionRequest $start) => $start->cancelVerification());

        // A start no host has taken has no process to stop, so it ends now and holds its account no longer.
        foreach (SessionProcess::findLockedPendingOf($command->sessionId) as $pending) {
            $pending->cancelPending();
        }

        if ($isRunning) {
            $this->requests->stop($command->target(), $command->idempotencyKey);
        }

        // A runtime whose processes all ended, such as a start refused after its build probe, has no one to tell.
        if ($hasRuntime && ! $isRunning) {
            $this->endWithoutProcess($command->sessionId);
        }

        SessionRequest::findOwnerStartOf($command->sessionId)->forAll(
            fn (SessionRequest $start) => $this->facts->publishAfterCommit(
                new SessionStartCancelled($start->owner_work),
            ),
        );

        return $isRunning;
    }

    private function endWithoutProcess(string $sessionId): void
    {
        $session = AgentSession::query()->lockForUpdate()->findOrFail($sessionId);
        $start = SessionProcess::findCurrentOf($sessionId);

        if ($start !== null) {
            $this->heartbeats->endStart($start, $session, self::CANCELLED);

            return;
        }

        $this->heartbeats->markExited($session, self::CANCELLED);
    }
}
