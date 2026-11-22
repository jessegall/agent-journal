<?php

declare(strict_types=1);

namespace App\Commands\InterruptAgent;

use App\Contracts\Bus\CommandHandler;
use App\Enums\DriverOperation;
use App\Enums\HoldReason;
use App\Support\DriverRequests;
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

        return $request->receipt();
    }
}
