<?php

declare(strict_types=1);

namespace App\Commands\Agents\CancelSessionStart;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\Sessions\SessionStartCancelled;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionRequest;
use App\Support\DriverRequests;

final readonly class CancelSessionStartHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private CommandFacts $facts,
    ) {}

    /**
     * Answers whether a runtime was told to stop: a launch whose runtime never opened has nothing to stop.
     */
    public function handle(CancelSessionStartCommand $command): bool
    {
        $hasRuntime = AgentRuntime::existsForSession($command->sessionId);

        SessionRequest::lockedLatestOf($command->sessionId)
            ->forAll(fn (SessionRequest $start) => $start->cancelVerification());

        if ($hasRuntime) {
            $this->requests->stop($command->target(), $command->idempotencyKey);
        }

        SessionRequest::ownerStartOf($command->sessionId)->forAll(
            fn (SessionRequest $start) => $this->facts->publishAfterCommit(new SessionStartCancelled($start->owner_work)),
        );

        return $hasRuntime;
    }
}
