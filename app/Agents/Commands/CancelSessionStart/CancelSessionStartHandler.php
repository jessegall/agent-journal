<?php

declare(strict_types=1);

namespace App\Agents\Commands\CancelSessionStart;

use App\Agents\DriverRequests;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Sessions\SessionStartCancelled;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;

final readonly class CancelSessionStartHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private CommandFacts $facts,
    ) {}

    /**
     * Answers whether a runtime was told to stop: a start whose runtime never opened has nothing to stop.
     */
    public function handle(CancelSessionStartCommand $command): bool
    {
        $hasRuntime = AgentRuntime::hasSession($command->sessionId);

        SessionRequest::findLockedLatestOf($command->sessionId)
            ->forAll(fn (SessionRequest $start) => $start->cancelVerification());

        // A start no host has taken has no process to stop, so it ends now and holds its account no longer.
        foreach (SessionProcess::findLockedPendingOf($command->sessionId) as $pending) {
            $pending->cancelPending();
        }

        if ($hasRuntime) {
            $this->requests->stop($command->target(), $command->idempotencyKey);
        }

        SessionRequest::findOwnerStartOf($command->sessionId)->forAll(
            fn (SessionRequest $start) => $this->facts->publishAfterCommit(
                new SessionStartCancelled($start->owner_work),
            ),
        );

        return $hasRuntime;
    }
}
