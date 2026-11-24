<?php

declare(strict_types=1);

namespace App\Commands\CancelLaunch;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\LaunchCancelled;
use App\Models\Agents\AgentRuntime;
use App\Models\Starts\StartRecord;
use App\Support\DriverRequests;

final readonly class CancelLaunchHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private CommandFacts $facts,
    ) {}

    /**
     * Answers whether a runtime was told to stop: a launch whose runtime never opened has nothing to stop.
     */
    public function handle(CancelLaunchCommand $command): bool
    {
        $hasRuntime = AgentRuntime::existsForSession($command->sessionId);

        StartRecord::lockedLatestOf($command->sessionId)
            ->forAll(fn (StartRecord $start) => $start->cancelVerification());

        if ($hasRuntime) {
            $this->requests->stop($command->target(), $command->idempotencyKey);
        }

        StartRecord::ownerStartOf($command->sessionId)->forAll(
            fn (StartRecord $start) => $this->facts->publishAfterCommit(new LaunchCancelled($start->ownerWork)),
        );

        return $hasRuntime;
    }
}
