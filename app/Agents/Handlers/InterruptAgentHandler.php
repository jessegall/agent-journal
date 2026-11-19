<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\InterruptAgent;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\HoldReason;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\DriverRequests;
use App\Agents\Values\DriverRequestPayload;
use App\Contracts\CommandHandler;

final readonly class InterruptAgentHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    public function handle(InterruptAgent $command): DriverReceipt
    {
        $request = $this->requests->append($command->target(), DriverOperation::Interrupt, $command->idempotencyKey, DriverRequestPayload::nothing());
        $this->requests->holdRuntime($command->target(), HoldReason::Interrupted);

        return $request->receipt();
    }
}
