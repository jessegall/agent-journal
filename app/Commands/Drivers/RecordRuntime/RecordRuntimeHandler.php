<?php

declare(strict_types=1);

namespace App\Commands\Drivers\RecordRuntime;

use App\Contracts\Bus\CommandHandler;
use App\Support\DriverRequests;
use App\Values\DriverReceipt;
use App\Values\DriverRequestPayload;

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
