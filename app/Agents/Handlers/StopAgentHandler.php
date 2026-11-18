<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\StopAgent;
use App\Agents\Enums\DriverOperation;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\DriverRequests;
use App\Contracts\CommandHandler;

final readonly class StopAgentHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    public function handle(StopAgent $command): DriverReceipt
    {
        $request = $this->requests->append($command->target(), DriverOperation::Stop, $command->idempotencyKey, []);
        $this->requests->markStopping($command->target());

        return $request->receipt();
    }
}
