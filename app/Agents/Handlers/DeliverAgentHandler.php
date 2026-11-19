<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\DeliverAgent;
use App\Agents\Enums\DriverOperation;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\DriverRequests;
use App\Agents\Values\DriverRequestPayload;
use App\Contracts\CommandHandler;

final readonly class DeliverAgentHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests) {}

    public function handle(DeliverAgent $command): DriverReceipt
    {
        return $this->requests->append($command->target(), DriverOperation::Deliver, $command->idempotencyKey, DriverRequestPayload::message($command->message))->receipt();
    }
}
