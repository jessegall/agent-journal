<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\CancelLaunch;
use App\Agents\Events\LaunchCancelled;
use App\Agents\Models\StartRecord;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\DriverRequests;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CancelLaunchHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private Dispatcher $events,
    ) {}

    public function handle(CancelLaunch $command): DriverReceipt
    {
        $receipt = $this->requests->stop($command->target(), $command->idempotencyKey)->receipt();

        StartRecord::ownerStartOf($command->sessionId)->forAll(
            fn (StartRecord $start) => $this->events->dispatch(new LaunchCancelled($start->ownerWork())),
        );

        return $receipt;
    }
}
