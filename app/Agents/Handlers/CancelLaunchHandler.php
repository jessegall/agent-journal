<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\CancelLaunch;
use App\Agents\Events\LaunchCancelled;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\StartRecord;
use App\Agents\Support\DriverRequests;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;

final readonly class CancelLaunchHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private CommandFacts $facts,
    ) {}

    /**
     * Answers whether a runtime was told to stop: a launch whose runtime never opened has nothing to stop.
     */
    public function handle(CancelLaunch $command): bool
    {
        $hasRuntime = AgentRuntime::existsForSession($command->sessionId);

        if ($hasRuntime) {
            $this->requests->stop($command->target(), $command->idempotencyKey);
        }

        StartRecord::ownerStartOf($command->sessionId)->forAll(
            fn (StartRecord $start) => $this->facts->publishAfterCommit(new LaunchCancelled($start->ownerWork())),
        );

        return $hasRuntime;
    }
}
