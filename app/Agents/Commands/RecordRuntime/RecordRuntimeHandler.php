<?php

declare(strict_types=1);

namespace App\Agents\Commands\RecordRuntime;

use App\Agents\Support\DriverRequests;
use App\Agents\Values\DriverReceipt;
use App\Agents\Values\DriverRequestPayload;
use App\Contracts\CommandHandler;

final readonly class RecordRuntimeHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    public function handle(RecordRuntimeCommand $command): DriverReceipt
    {
        $driverEnvelope = DriverRequestPayload::nothing();

        return $this->requests->append(
            $command->target(),
            $command->operation(),
            $command->idempotencyKey,
            $driverEnvelope,
        )
            ->receipt();
    }
}
