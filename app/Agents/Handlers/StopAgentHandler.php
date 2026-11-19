<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\StopAgent;
use App\Agents\Enums\DriverOperation;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\DriverRequests;
use App\Agents\Values\DriverRequestPayload;
use App\Contracts\CommandHandler;

final readonly class StopAgentHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    public function handle(StopAgent $command): DriverReceipt
    {
        return $this->requests->stop($command->target(), $command->idempotencyKey)->receipt();
    }
}
