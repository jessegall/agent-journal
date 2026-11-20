<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\CancelLaunch;
use App\Agents\Events\LaunchCancelled;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\StartRecord;
use App\Agents\Support\DriverRequests;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CancelLaunchHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private Dispatcher $events,
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
            fn (StartRecord $start) => $this->events->dispatch(new LaunchCancelled($start->ownerWork())),
        );

        return $hasRuntime;
    }
}
