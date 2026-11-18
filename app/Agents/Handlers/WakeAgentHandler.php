<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\WakeAgent;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\DriverRequests;
use App\Contracts\CommandHandler;

final readonly class WakeAgentHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    public function handle(WakeAgent $command): DriverReceipt
    {
        return $this->requests->wake($command->target(), $command->idempotencyKey);
    }
}
