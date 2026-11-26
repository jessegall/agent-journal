<?php

declare(strict_types=1);

namespace App\Agents\Commands\InterruptAgent;

use App\Agents\DriverRequests;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\HoldReason;
use App\Bus\Contracts\CommandHandler;
use App\Values\DriverReceipt;
use App\Values\DriverRequestPayload;

final readonly class InterruptAgentHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    public function handle(InterruptAgentCommand $command): DriverReceipt
    {
        $request = $this->requests->append(
            $command->target(),
            DriverOperation::Interrupt,
            $command->idempotencyKey,
            DriverRequestPayload::nothing(),
        );

        $this->requests->holdRuntime($command->target(), HoldReason::Interrupted);

        return $request->receipt;
    }
}
